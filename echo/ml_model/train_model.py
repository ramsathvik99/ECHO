import pandas as pd
import pickle
import os
import sys
from sklearn.feature_extraction.text import CountVectorizer, TfidfTransformer
from sklearn.svm import LinearSVC
# from sklearn.linear_model import SGDClassifier # Replaced with LinearSVC for stability

# Define Base Dir and Add to Path to import extensions
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(BASE_DIR)

from extensions.text_preprocessing import clean_text

DATASET_PATH = os.path.join(BASE_DIR, 'text_emotions.csv')
MODEL_DIR = os.path.join(BASE_DIR, 'ml_model')

# Ensure model directory exists
if not os.path.exists(MODEL_DIR):
    os.makedirs(MODEL_DIR)

print("🚀 Starting Model Training Pipeline...")

# 1. Load Dataset
print(f"📂 Loading dataset from {DATASET_PATH}...")
try:
    df = pd.read_csv(DATASET_PATH)
    print(f"✅ Dataset loaded: {len(df)} rows.")
except Exception as e:
    print(f"❌ Error loading dataset: {e}")
    exit(1)

# Verify columns
if 'content' not in df.columns or 'sentiment' not in df.columns:
    print("❌ Dataset missing required columns 'content' or 'sentiment'.")
    exit(1)

# 2. Apply Centralized Preprocessing
print("   - Applying centralized text cleaning (includes emojis)...")
# clean_text in extensions/text_preprocessing.py now handles emojis + cleaning
df['cleaned_content'] = df['content'].apply(clean_text)

# 3. Train Model
print("🧠 Training LinearSVC Model...")

# Step A: Vectorization (Standard, no custom analyzer to ensure pickle stability)
print("   - Vectorizing...")
vectorizer = CountVectorizer() 
X_counts = vectorizer.fit_transform(df['cleaned_content'])

# Step B: TF-IDF
print("   - Applying TF-IDF...")
tfidf_transformer = TfidfTransformer()
X_tfidf = tfidf_transformer.fit_transform(X_counts)

# Step C: Classification (LinearSVC for robust margin maximization)
print("   - Fitting LinearSVC...")
# LinearSVC is generally faster and more stable for text classification than SGDClassifier
clf = LinearSVC(random_state=42, tol=1e-5)
clf.fit(X_tfidf, df['sentiment'])

print("✅ Model Trained successfully!")

# 4. Save Artifacts
print("💾 Saving artifacts to ml_model/...")

# Delete old files first to be clean
for f in ["emotion_model.pkl", "vectorizer.pkl", "tfidf.pkl"]:
    path = os.path.join(MODEL_DIR, f)
    if os.path.exists(path):
        os.remove(path)

with open(os.path.join(MODEL_DIR, "emotion_model.pkl"), "wb") as f:
    pickle.dump(clf, f)

with open(os.path.join(MODEL_DIR, "vectorizer.pkl"), "wb") as f:
    pickle.dump(vectorizer, f)

with open(os.path.join(MODEL_DIR, "tfidf.pkl"), "wb") as f:
    pickle.dump(tfidf_transformer, f)

print("🎉 All Done! Pipeline Stabilized.")
