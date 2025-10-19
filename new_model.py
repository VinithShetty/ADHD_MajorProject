import numpy as np
import pandas as pd
import joblib
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
import os

# ---------------------------
# Load EEG dataset
# ---------------------------
data = pd.read_csv(r"C:\Users\RITHESH\Downloads\major project fin\dataset.csv")  # ✅ Update path if needed
print("Columns found:", data.columns.tolist())

# ✅ Automatically detect the class/target column
possible_class_names = ["Class", "class", "Label", "label", "Target", "target"]
target_col = None
for name in possible_class_names:
    if name in data.columns:
        target_col = name
        break

if target_col is None:
    raise ValueError("❌ No target/class column found in dataset. Please check column names.")

# EEG feature columns
eeg_columns = [
    'Fp1','Fp2','F3','F4','C3','C4','P3','P4','O1','O2',
    'F7','F8','T7','T8','P7','P8','Fz','Cz','Pz'
]

# ✅ Validate presence of all EEG columns
missing_cols = [col for col in eeg_columns if col not in data.columns]
if missing_cols:
    raise ValueError(f"❌ Missing EEG columns in dataset: {missing_cols}")

# ---------------------------
# Prepare features and labels
# ---------------------------
X = data[eeg_columns]
y = data[target_col]

# ---------------------------
# Scale EEG features
# ---------------------------
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# ---------------------------
# Train-test split
# ---------------------------
X_train, X_test, y_train, y_test = train_test_split(
    X_scaled, y, test_size=0.2, random_state=42, stratify=y
)

# ---------------------------
# Train RandomForest classifier
# ---------------------------
model = RandomForestClassifier(
    n_estimators=300,
    max_depth=15,
    min_samples_split=5,
    random_state=42
)
model.fit(X_train, y_train)

# ---------------------------
# Evaluate model
# ---------------------------
y_pred = model.predict(X_test)
print("\n🧩 EEG-Only ADHD Model Performance:")
print("Accuracy:", round(accuracy_score(y_test, y_pred), 3))
print("\nClassification Report:\n", classification_report(y_test, y_pred))
print("Confusion Matrix:\n", confusion_matrix(y_test, y_pred))

# ---------------------------
# Save model and scaler
# ---------------------------
os.makedirs("models", exist_ok=True)
joblib.dump(model, "models/eeg_only_model.pkl")
joblib.dump(scaler, "models/eeg_scaler.pkl")
print("\n✅ EEG-only model and scaler saved successfully in /models folder.")
