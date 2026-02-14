import requests
import json
import time

BASE_URL = "http://127.0.0.1:5000"

def test_analyze():
    print("Testing /analyze endpoint...")
    payload = {
        "message": "I am really frustrated with you right now.",
        "relationship": "Partner"
    }
    try:
        response = requests.post(f"{BASE_URL}/analyze", json=payload)
        if response.status_code == 200:
            data = response.json()
            if isinstance(data, str):
                data = json.loads(data)
            
            required_keys = ["emotion", "intensity", "tone", "interpretation", "conflict_risk", "empathy_score", "clarity_score", "warmth_score"]
            missing = [k for k in required_keys if k not in data]
            
            if not missing:
                print("✅ /analyze Passed")
                print(json.dumps(data, indent=2))
            else:
                print(f"❌ /analyze Failed: Missing keys {missing}")
                print(json.dumps(data, indent=2))
        else:
            print(f"❌ /analyze Failed with status {response.status_code}")
            print(response.text)
    except Exception as e:
        print(f"❌ /analyze Exception: {e}")

def test_rewrite():
    print("\nTesting /rewrite endpoint...")
    payload = {
        "message": "You never listen to me.",
        "relationship": "Partner",
        "style": "Softer"
    }
    try:
        response = requests.post(f"{BASE_URL}/rewrite", json=payload)
        if response.status_code == 200:
            data = response.json()
            if isinstance(data, str):
                data = json.loads(data)
                
            if "rewrite" in data:
                print("✅ /rewrite Passed")
                print(f"Original: {payload['message']}")
                print(f"Rewrite: {data['rewrite']}")
            else:
                print("❌ /rewrite Failed: Missing 'rewrite' key")
                print(json.dumps(data, indent=2))
        else:
            print(f"❌ /rewrite Failed with status {response.status_code}")
            print(response.text)
    except Exception as e:
        print(f"❌ /rewrite Exception: {e}")

if __name__ == "__main__":
    # Wait a moment for server to ensure it's up
    time.sleep(2)
    test_analyze()
    test_rewrite()
