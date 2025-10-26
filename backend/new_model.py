import numpy as np
import pandas as pd
import joblib
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
import os
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Dropout
from tensorflow.keras.optimizers import Adam
from sklearn.preprocessing import LabelEncoder

# ---------------------------
# Load EEG dataset
# ---------------------------
data = pd.read_csv(r"C:\Users\RITHESH\Downloads\major project fin\dataset.csv")  # ✅ Update path if needed
print("Columns found:", data.columns.tolist())

# Automatically detect the class/target column
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

# Validate presence of all EEG columns
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
# Ensure numeric data types
# ---------------------------
# Convert labels to numeric if they are object type (e.g., "ADHD", "Control")
if y_train.dtype == 'O' or y_test.dtype == 'O':
    le = LabelEncoder()
    y_train = le.fit_transform(y_train)
    y_test = le.transform(y_test)
    
# Convert to numpy float arrays
X_train = np.array(X_train, dtype=np.float32)
X_test = np.array(X_test, dtype=np.float32)
y_train = np.array(y_train, dtype=np.float32)
y_test = np.array(y_test, dtype=np.float32)

# ---------------------------
# Create models folder
# ---------------------------
os.makedirs("models", exist_ok=True)

# Save LabelEncoder for later (after folder is created)
if 'le' in locals():
    joblib.dump(le, "models/label_encoder.pkl")

# ---------------------------
# Deep Learning Model (MLP)
# ---------------------------
model = Sequential([
    Dense(128, activation='relu', input_shape=(X_train.shape[1],)),
    Dropout(0.3),
    Dense(64, activation='relu'),
    Dropout(0.3),
    Dense(1, activation='sigmoid')  # Binary classification (ADHD / non-ADHD)
])

model.compile(optimizer=Adam(learning_rate=0.001),
              loss='binary_crossentropy',
              metrics=['accuracy'])

# ---------------------------
# Train model
# ---------------------------
history = model.fit(
    X_train, y_train,
    validation_split=0.2,
    epochs=50,
    batch_size=32,
    verbose=1
)

# ---------------------------
# Evaluate model
# ---------------------------
y_pred_prob = model.predict(X_test)
y_pred = (y_pred_prob > 0.5).astype(int).flatten()

print("\n🧠 EEG Deep Learning Model Performance:")
print("Accuracy:", round(accuracy_score(y_test, y_pred), 3))
print("\nClassification Report:\n", classification_report(y_test, y_pred))
print("Confusion Matrix:\n", confusion_matrix(y_test, y_pred))

# ---------------------------
# Save model and scaler
# ---------------------------
model.save("models/eeg_deep_model.h5")
joblib.dump(scaler, "models/eeg_scaler.pkl")
print("\n✅ Deep Learning EEG model, scaler, and label encoder saved successfully in /models folder.")
