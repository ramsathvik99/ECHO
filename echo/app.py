import os
import json
from flask import Flask, render_template, request, jsonify
from huggingface_hub import InferenceClient
from extensions.emotion_engine import predict_emotion
from dotenv import load_dotenv
import re
import concurrent.futures

load_dotenv()

app = Flask(__name__)

# Initialize Hugging Face client
REPO_ID = "HuggingFaceH4/zephyr-7b-beta"
client = InferenceClient(token=os.getenv("HUGGINGFACE_API_KEY"))

def truncate_output(text, max_words=100):
    """Safety trimmer for AI output. Expanded to 100 words to prevent truncation."""
    if not text: return text
    words = text.split()
    if len(words) > max_words:
        return " ".join(words[:max_words]) + "..."
    return text

def extract_json(text):
    """Helper to extract JSON from text if the model includes markdown."""
    if not text: return None
    clean_text = text.strip()
    try:
        # Try finding JSON inside markdown code blocks
        code_block = re.search(r"```(?:json)?\s*(\{.*?\})\s*```", clean_text, re.DOTALL)
        if code_block:
            return json.loads(code_block.group(1))
            
        # Try finding the largest valid JSON object
        match = re.search(r"(\{.*\})", clean_text, re.DOTALL)
        if match:
             content = match.group(1)
             try: return json.loads(content)
             except json.JSONDecodeError:
                 # Attempt fix for common trailing commas or missing braces
                 try:
                     fixed = re.sub(r",\s*}", "}", content)
                     return json.loads(fixed)
                 except: pass

        return json.loads(clean_text)
    except Exception as e:
        print(f"JSON Extraction Error: {e} | Raw Content: {text}")
        return None

@app.route('/')
def index():
    return render_template('index.html', page_class="home-bg")

RELATIONSHIP_RULES = {
    "Partner": "Warm, emotionally expressive, and vulnerable tone allowed.",
    "Parent": "Respectful, balanced, slightly formal but caring tone.",
    "Friend": "Casual, natural, and light tone.",
    "Boss": "Polite, structured, and professional vocabulary.",
    "Stranger": "Neutral, polite, and minimal emotional intensity."
}

@app.route('/analyze', methods=['POST'])
def analyze_message():
    print("👉 ROUTE HIT: /analyze")
    try:
        data = request.json
        print("Incoming request [/analyze]:", data)
        msg = data.get('message', '').strip()
        rel = data.get('relationship', 'Stranger')
        
        if not msg:
             return jsonify({"error": "No message provided"}), 400

        # 🧠 ML EMOTION DETECTION (Primary Source)
        detected_emotion = predict_emotion(msg)
        print(f"🧠 ML Detected Emotion: {detected_emotion}")

        # 🤖 LLM ANALYSIS & REWRITES
        system_prompt = "You are a communication analyst. Return JSON ONLY. No markdown. No explanations."
        user_prompt = f"""You are a communication analyst.

Detected emotion: {detected_emotion}
Relationship: {rel}

Analyze the message: "{msg}"

Return JSON only in this format:

{{
"tone": "Brief tone description",
"interpretation": "One sentence insight",
"conflict_risk": "Low | Medium | High",
"clarity_score": 0-100,
"empathy_score": 0-100,
"warmth_score": 0-100,
"rewrites": {{
"softer": "Single sentence rewrite",
"assertive": "Single sentence rewrite",
"neutral": "Single sentence rewrite",
"professional": "Single sentence rewrite"
}}
}}

Rules:

One rewrite per key.

No OR.

No multiple options.

No explanation outside JSON.

Maximum 20 words per rewrite.

Tone must match {rel} relationship.

Strict JSON format.
"""

        response = client.chat_completion(
            model=REPO_ID,
            messages=[{"role": "system", "content": system_prompt}, {"role": "user", "content": user_prompt}],
            max_tokens=600, 
            temperature=0.4 # Lower temperature for practical, deterministic output
        )

        content = response.choices[0].message.content
        print("AI response [/analyze]:", content)
        
        # 🔥 VALIDATION: Handle "OR" responses
        if " OR " in content:
             print("⚠️ Detected multiple options (OR), taking first one.")
             content = content.split(" OR ")[0]

        parsed = extract_json(content)
        if not parsed:
            # Fallback if LLM fails JSON
            return jsonify({
                "emotion": detected_emotion,
                "intensity": 50,
                "tone": "Neutral",
                "interpretation": "Analysis unavailable.",
                "conflict_risk": "Low",
                "empathy_score": 50,
                "clarity_score": 50,
                "warmth_score": 50,
                "rewrites": {
                    "softer": msg,
                    "assertive": msg,
                    "professional": msg,
                    "neutral": msg
                }
            })
            
        # 🎯 FORCE ML EMOTION (Architecture Rule)
        parsed["emotion"] = detected_emotion 
        
        # Ensure numeric scores are integers
        for score in ["intensity", "empathy_score", "clarity_score", "warmth_score"]:
             if score in parsed:
                 try: parsed[score] = int(parsed[score])
                 except: parsed[score] = 0

        # Ensure strings for text fields
        for key in ["tone", "interpretation", "conflict_risk"]:
            val = parsed.get(key, "")
            parsed[key] = str(val)

        parsed["interpretation"] = truncate_output(parsed.get("interpretation", "No insight."), 100)
        
        # Ensure rewrites structure exists
        if "rewrites" not in parsed or not isinstance(parsed["rewrites"], dict):
             parsed["rewrites"] = {
                 "softer": "Not available",
                 "assertive": "Not available",
                 "neutral": "Not available",
                 "professional": "Not available"
             }

        return jsonify(parsed)
    except Exception as e:
        print(f"Analyze Error: {e}")
        return jsonify({"error": "Analysis engine unavailable.", "details": str(e)}), 500

@app.route('/rewrite', methods=['POST'])
def rewrite_message():
    print("👉 ROUTE HIT: /rewrite")
    try:
        data = request.json
        print("Incoming request [/rewrite]:", data)
        message = data.get('message', '').strip()
        rel = data.get('relationship', 'Stranger')
        style = data.get('style', 'Natural')
        
        if not message:
            return jsonify({"error": "No message provided"}), 400

        # Create properly formatted prompt
        # We combine system and user instructions for better adherence with some models, 
        # or keep them separate. The user requested a specific prompt structure.
        
        system_prompt = "You are a communication assistant. Strict JSON output only."
        user_prompt = f"""You are a communication assistant.

Rewrite the following message in a {style} tone appropriate for a {rel}.

Rules:

Return ONLY ONE rewritten sentence.

Do NOT provide multiple options.

Do NOT use 'OR'.

Do NOT provide explanations.

Do NOT include variations.

Maximum 20 words.

Natural human tone.

Return JSON only in this format:

{{
"rewrite": "your single rewritten sentence"
}}

Message:
"{message}"
"""

        response = client.chat_completion(
            model=REPO_ID,
            messages=[{"role": "system", "content": system_prompt}, {"role": "user", "content": user_prompt}],
            max_tokens=200, 
            temperature=0.4 # Strictness increased
        )

        content = response.choices[0].message.content
        print("AI response [/rewrite]:", content)

        # 🔥 VALIDATION: Handle "OR" responses
        if " OR " in content:
            print("⚠️ Detected multiple options (OR), taking first one.")
            content = content.split(" OR ")[0]
        
        result = extract_json(content)
        if not result:
            return jsonify({
                "rewrite": content,
                "fallback_output": content
            })
            
        if isinstance(result.get("rewrite"), dict): result["rewrite"] = result["rewrite"].get("text", str(result["rewrite"]))
        
        result["rewrite"] = truncate_output(str(result.get("rewrite", "")), 40) # Reduced truncation length as per query constraint
        return jsonify(result)
    except Exception as e:
        print(f"Rewrite Error: {e}")
        return jsonify({"error": "Rewrite engine unavailable.", "details": str(e)}), 500

@app.route('/generate_replies', methods=['POST'])
def generate_replies():
    print("👉 ROUTE HIT: /generate_replies")
    try:
        data = request.json
        print("Incoming request [/generate_replies]:", data)
        msg = data.get('received_message')
        
        if not msg:
            return jsonify({"error": "No message provided"}), 400

        system_prompt = "Return JSON ONLY. Keys: calm, confident, flirty, funny, professional, deep. Max 15 words per value."
        user_prompt = f"Reply to: \"{msg}\". Example: {{\"calm\": \"I understand.\", \"confident\": \"I have this handled.\", \"flirty\": \"Thinking of you.\", \"funny\": \"That's what she said.\", \"professional\": \"I will review this.\", \"deep\": \"You mean so much.\"}}"

        response = client.chat_completion(
            model=REPO_ID,
            messages=[{"role": "system", "content": system_prompt}, {"role": "user", "content": user_prompt}],
            max_tokens=600, temperature=0.6
        )
        content = response.choices[0].message.content
        print("AI response [/generate_replies]:", content)
        
        parsed = extract_json(content)
        if not parsed:
            return jsonify({
                "error": "Failed to parse replies",
                "fallback_output": content,
                "calm": content,
                "confident": "Error parsing response."
            })
        return jsonify(parsed)
    except Exception as e:
        print(f"Replies Error: {e}")
        return jsonify({"error": "Reply engine unavailable.", "details": str(e)}), 500

@app.route('/strategy', methods=['POST'])
@app.route('/strategy', methods=['POST'])
def plan_strategy():
    print("👉 ROUTE HIT: /strategy")
    try:
        data = request.json
        print("Incoming data:", data)
        
        # User input handling matching previous logic but safer
        user_input = data.get('user_input', data.get('goal', '')).strip()
        rel = data.get('relationship_type', data.get('relationship', 'Unknown'))
        
        if not user_input:
            return jsonify({"error": "Empty goal provided."}), 400

        # 🧠 ML EMOTION DETECTION
        detected_emotion = predict_emotion(user_input)
        print(f"🧠 ML Detected Emotion for Strategy: {detected_emotion}")

        # 🔥 STEP 2 – STRICT PROMPT
        system_prompt = "Return JSON only. No explanation. No markdown. No OR. No additional text."
        user_prompt = f"""You are a communication coach.

Message: "{user_input}"
Relationship: {rel}
Detected emotion: {detected_emotion}

Create a structured 6-step conversation plan.

Return JSON only in this format:

{{
  "step1": "...",
  "step2": "...",
  "step3": "...",
  "step4": "...",
  "step5": "...",
  "step6": "..."
}}

Rules:
- You MUST return exactly 6 steps.
- Each step must be 1–2 meaningful sentences.
- Each step must clearly explain what to say and why.
- Steps must directly relate to the given message.
- No generic advice.
- No OR.
- No additional commentary.
- JSON only."""

        # 🔥 WRAP LLM CALL WITH TIMEOUT
        def call_llm():
            return client.chat_completion(
                model=REPO_ID,
                messages=[{"role": "system", "content": system_prompt}, {"role": "user", "content": user_prompt}],
                max_tokens=500,  # Enough room for 6 detailed steps
                temperature=0.5,  # Moderate creativity for natural language
                stream=False
            )

        raw_response = ""
        try:
            with concurrent.futures.ThreadPoolExecutor() as executor:
                future = executor.submit(call_llm)
                # Hard 25-second timeout for 6-step generation
                response = future.result(timeout=25)
            
            raw_response = response.choices[0].message.content
            print("Raw LLM Strategy:", raw_response)
            
        except concurrent.futures.TimeoutError:
            print("❌ Strategy generation timed out. Using intelligent fallback.")
            # Smart fallback based on context - 6 steps
            return jsonify({
                "step1": f"Begin by calmly expressing your feelings about this situation to establish trust.",
                "step2": f"Clearly communicate your intention regarding '{user_input}' and explain why it matters to you.",
                "step3": f"Provide context about why this is important to you right now.",
                "step4": f"Listen to their response and acknowledge their perspective.",
                "step5": f"Discuss potential next steps or solutions together.",
                "step6": f"End the conversation positively to maintain the relationship."
            })
        except Exception as e:
            print(f"❌ LLM Call Failed: {e}")
            # Fallback for other errors - 6 steps
            return jsonify({
                "step1": "Start with a calm and respectful tone to set the right atmosphere.",
                "step2": "Clearly state what you want to communicate and why it's important.",
                "step3": "Explain how the situation is affecting you emotionally.",
                "step4": "Be open to their response and ready for a constructive conversation.",
                "step5": "Work together to find a mutually acceptable solution.",
                "step6": "Close with appreciation and a positive note."
            })

        # 🔥 STEP 1 – JSON PARSING & FALLBACK
        try:
            # Try to start parsing
            parsed = extract_json(raw_response)
            if not parsed:
                 raise ValueError("Extraction returned None")
            
            # Ensure all 6 keys are present
            required_keys = ["step1", "step2", "step3", "step4", "step5", "step6"]
            for key in required_keys:
                if key not in parsed:
                    parsed[key] = "..."
            
            return jsonify(parsed)

        except Exception as json_err:
            print(f"⚠️ Strategy JSON parse failed: {json_err}")
            # Fallback JSON - 6 steps
            return jsonify({
                "step1": "Start calmly and clearly express your intention.",
                "step2": "State your core concern honestly.",
                "step3": "Explain why this matters to you.",
                "step4": "Listen actively to their response.",
                "step5": "Work together on finding a solution.",
                "step6": "End with a positive forward-looking note."
            })

    except Exception as e:
        print("❌ Strategy route failed:", str(e))
        return jsonify({
            "step1": "Take a moment to gather your thoughts before speaking.",
            "step2": "Express yourself clearly and honestly about what you need.",
            "step3": "Be prepared to listen and respond with empathy."
        }), 200  # Return 200 with fallback instead of 500 error

@app.route('/affinity', methods=['POST'])
def affinity_mode():
    print("👉 ROUTE HIT: /affinity")
    try:
        data = request.json
        print("Incoming request [/affinity]:", data)
        msg = data.get('message', '')
        action = data.get('action', 'Analyze signals')
        
        system_prompt = "You are a relationship expert. Help users navigate courtship and intimacy. Be natural and empathetic. Max 80 words."
        response = client.chat_completion(
            model=REPO_ID,
            messages=[{"role": "system", "content": system_prompt}, {"role": "user", "content": f"Action: {action} on message: {msg}"}],
            max_tokens=400, temperature=0.6
        )
        text = response.choices[0].message.content
        print("AI response [/affinity]:", text)
        if not text:
            return jsonify({"error": "Unable to generate response. Please try again."}), 500
        return jsonify({"result": truncate_output(text, 100)})
    except Exception as e:
        print(f"Affinity Error: {e}")
        return jsonify({"error": "Dating engine unavailable.", "details": str(e)}), 500

@app.route('/corporate', methods=['POST'])
def corporate_mode():
    print("👉 ROUTE HIT: /corporate")
    try:
        data = request.json
        print("Incoming request [/corporate]:", data)
        input = data.get('message', '')
        action = data.get('action', 'Clean professional tone')
        
        system_prompt = "You are a corporate communication expert. Focus on clarity, etiquette, and de-passive/assertive tone. Max 80 words."
        response = client.chat_completion(
            model=REPO_ID,
            messages=[{"role": "system", "content": system_prompt}, {"role": "user", "content": f"Action: {action} on: {input}"}],
            max_tokens=400, temperature=0.6
        )
        text = response.choices[0].message.content
        print("AI response [/corporate]:", text)
        if not text:
            return jsonify({"error": "Unable to generate response. Please try again."}), 500
        return jsonify({"result": truncate_output(text, 100)})
    except Exception as e:
        print(f"Corporate Error: {e}")
        return jsonify({"error": "Professional engine unavailable.", "details": str(e)}), 500

@app.route('/analyze_screenshot', methods=['POST'])
def analyze_screenshot():
    print("👉 ROUTE HIT: /analyze_screenshot")
    try:
        data = request.json or {}
        print("Incoming request [/analyze_screenshot]:", data)
        # Placeholder OCR text simulating extraction
        text = "Hey, why haven't you replied? I feel like you're avoiding me."
        
        system_prompt = "You are a digital social expert. Analyze this screen capture text for hidden emotion and strategic intent. Return JSON."
        response = client.chat_completion(
            model=REPO_ID,
            messages=[{"role": "system", "content": system_prompt}, {"role": "user", "content": f"Analyze: {text}"}],
            max_tokens=400, temperature=0.4
        )
        content = response.choices[0].message.content
        print("AI response [/analyze_screenshot]:", content)
        
        if not content:
            return jsonify({"error": "Vision engine timed out."}), 500
            
        parsed = extract_json(content)
        return jsonify({
            "extracted_text": text,
            "analysis": parsed or {"error": "Deep scan failed", "fallback_output": content}
        })
        return jsonify({"extracted_text": text, "analysis": parsed or {"error": "Deep scan failed", "fallback_output": content}})
    except Exception as e:
        print(f"Vision Error: {e}")
        return jsonify({"error": "Vision analyzer unavailable.", "details": str(e)}), 500

@app.route('/insights', methods=['GET'])
def get_insights():
    print("👉 ROUTE HIT: /insights")
    try:
        # In a real app, this would fetch from a database.
        # For now, we return a success status to confirm connectivity.
        return render_template('index.html', page_class="insights-bg")
    except Exception as e:
        print(f"Insights Error: {e}")
        return jsonify({"error": "Insights unavailable.", "details": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
