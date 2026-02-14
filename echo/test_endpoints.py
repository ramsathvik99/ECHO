import requests
import json

BASE_URL = "http://127.0.0.1:5000"

test_cases = [
    {
        "endpoint": "/analyze",
        "payload": {"message": "You never listen to me.", "relationship": "Partner"},
        "desc": "Analyze: Accusatory message"
    },
    {
        "endpoint": "/rewrite",
        "payload": {"message": "Fine. Do whatever you want.", "relationship": "Partner", "style": "Soft"},
        "desc": "Rewrite: Passive-aggressive message"
    },
    {
        "endpoint": "/analyze_screenshot",
        "payload": {},
        "desc": "Vision: Simulated OCR extraction"
    },
    {
        "endpoint": "/generate_replies",
        "payload": {"received_message": "How are you doing?"},
        "desc": "Replies: Social interaction"
    },
    {
        "endpoint": "/strategy",
        "payload": {"user_input": "Ask for a promotion", "relationship_type": "Boss"},
        "desc": "Strategy: Professional goal"
    },
    {
        "endpoint": "/affinity",
        "payload": {"message": "I really like you", "action": "confess"},
        "desc": "Affinity: Confession advice"
    },
    {
        "endpoint": "/corporate",
        "payload": {"message": "I'm sorry I was late", "action": "apology"},
        "desc": "Corporate: Apology polish"
    }
]

def run_tests():
    print("Starting ECHO Quality Verification...\n")
    for tc in test_cases:
        print(f"Testing {tc['desc']}...")
        try:
            res = requests.post(BASE_URL + tc['endpoint'], json=tc['payload'])
            print(f"Status: {res.status_code}")
            data = res.json()
            # If data is a string (due to json.dumps in flask), parse it
            if isinstance(data, str):
                data = json.loads(data)
            
            print(f"Output: {json.dumps(data, indent=2)}")
            
            # Validation checks
            if tc['endpoint'] == "/analyze":
                assert "emotion" in data, "Missing emotion"
                assert "interpretation" in data, "Missing interpretation"
            elif tc['endpoint'] == "/strategy":
                assert "opening" in data, "Missing opening"
                assert "main_point" in data, "Missing main_point"
                assert "possible_reaction" in data, "Missing reaction"
                assert "closing" in data, "Missing closing"
                print("Quality Check: Strategy has all 4 segments")
            
            print("✓ SUCCESS\n")
        except Exception as e:
            print(f"✗ FAILED: {str(e)}\n")

    print("Testing Context Sensitivity: Partner vs Boss...")
    msg = "I need to talk to you about something important."
    
    # Partner call
    p_resp = requests.post(f"{BASE_URL}/rewrite", json={"message": msg, "relationship": "Partner", "style": "Warm"})
    p_rewrite = p_resp.json().get("rewrite", "")
    
    # Boss call
    b_resp = requests.post(f"{BASE_URL}/rewrite", json={"message": msg, "relationship": "Boss", "style": "Polite"})
    b_rewrite = b_resp.json().get("rewrite", "")
    
    print(f"Partner Output: {p_rewrite}")
    print(f"Boss Output: {b_rewrite}")
    
    if p_rewrite.lower() != b_rewrite.lower():
        print("✓ SUCCESS: Outputs are context-aware (different for different roles)")
    else:
        print("⚠ WARNING: Outputs are identical. Prompt weighting may need tuning.")

    print("\n--- Verification Complete ---")

if __name__ == "__main__":
    run_tests()
