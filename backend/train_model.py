"""
Train EEG-Only ADHD Detection Model
Uses dataset.csv with 19 EEG channels to classify ADHD vs Non_ADHD.
Saves model and scaler to models/ directory.
"""

import numpy as np
import pandas as pd
import joblib
import os
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix

# ---------------------------
# Load EEG dataset
# ---------------------------
data = pd.read_csv("dataset.csv")
print(f"Dataset loaded: {data.shape[0]} rows, {data.shape[1]} columns")
print(f"Class distribution:\n{data['Class'].value_counts()}\n")

# EEG feature columns (19 channels - standard 10-20 system)
eeg_columns = [
    'Fp1', 'Fp2', 'F3', 'F4', 'C3', 'C4', 'P3', 'P4',
    'O1', 'O2', 'F7', 'F8', 'T7', 'T8', 'P7', 'P8',
    'Fz', 'Cz', 'Pz'
]

# Validate all EEG columns are present
missing = [col for col in eeg_columns if col not in data.columns]
if missing:
    raise ValueError(f"Missing EEG columns: {missing}")

X = data[eeg_columns].values
y = data['Class'].values

# ---------------------------
# Scale EEG features
# ---------------------------
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# ---------------------------
# Train-test split (80/20, stratified)
# ---------------------------
X_train, X_test, y_train, y_test = train_test_split(
    X_scaled, y, test_size=0.2, random_state=42, stratify=y
)

print(f"Training set: {len(X_train)} samples")
print(f"Test set: {len(X_test)} samples\n")

# ---------------------------
# Train Random Forest Classifier
# ---------------------------
model = RandomForestClassifier(
    n_estimators=300,
    max_depth=20,
    min_samples_split=5,
    min_samples_leaf=2,
    random_state=42,
    n_jobs=-1
)

model.fit(X_train, y_train)

# ---------------------------
# Evaluate model
# ---------------------------
y_pred = model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)

print(f"Model Accuracy: {accuracy:.4f}")
print(f"\nClassification Report:")
print(classification_report(y_test, y_pred))
print(f"Confusion Matrix:")
print(confusion_matrix(y_test, y_pred))

# Cross-validation
cv_scores = cross_val_score(model, X_scaled, y, cv=5, scoring='accuracy')
print(f"\n5-Fold Cross Validation: {cv_scores.mean():.4f} (+/- {cv_scores.std():.4f})")

# ---------------------------
# Verify predictions on known samples
# ---------------------------
adhd_samples = data[data['Class'] == 'ADHD'].head(10)[eeg_columns].values
non_adhd_samples = data[data['Class'] == 'Non_ADHD'].head(10)[eeg_columns].values

adhd_preds = model.predict(scaler.transform(adhd_samples))
non_adhd_preds = model.predict(scaler.transform(non_adhd_samples))

print(f"\nVerification - 10 ADHD samples predicted as: {list(adhd_preds)}")
print(f"Verification - 10 Non_ADHD samples predicted as: {list(non_adhd_preds)}")

# ---------------------------
# Save model and scaler
# ---------------------------
os.makedirs("models", exist_ok=True)
joblib.dump(model, "models/eeg_only_model.pkl")
joblib.dump(scaler, "models/eeg_scaler.pkl")

print(f"\n✅ Model saved to models/eeg_only_model.pkl")
print(f"✅ Scaler saved to models/eeg_scaler.pkl")
print(f"Model classes: {model.classes_}")
