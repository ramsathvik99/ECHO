import re
import string
import os

# Emoji Dictionary Loading
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
EMOJI_PATH = os.path.join(BASE_DIR, 'emojis.txt')

emoji_dict = {}
try:
    if os.path.exists(EMOJI_PATH):
        with open(EMOJI_PATH, 'r', encoding='utf-8') as f:
            for line in f:
                if ',' in line:
                    emoji, word = line.strip().split(',', 1)
                    emoji_dict[emoji.strip()] = word.strip()
except Exception as e:
    print(f"⚠️ Warning: Preprocessor could not load emojis: {e}")

def replace_emojis(text):
    """
    Replaces emojis with their text equivalent using the loaded dictionary.
    """
    if not isinstance(text, str): return ""
    for emoji, word in emoji_dict.items():
        if emoji in text:
            text = text.replace(emoji, f" {word} ")
    return text

def clean_text(text):
    """
    Standard text cleaning function for Emotion Engine.
    - Replaces emojis FIRST
    - Lowercases text
    - Removes punctuation
    - Removes extra whitespace
    """
    if not isinstance(text, str):
        return ""
    
    # 1. Emoji Replacement
    text = replace_emojis(text)
    
    # 2. Lowercase
    text = text.lower()
    
    # 3. Remove Punctuation
    text = text.translate(str.maketrans('', '', string.punctuation))
    
    # 4. Remove extra whitespace
    text = re.sub(r'\s+', ' ', text).strip()
    
    return text
