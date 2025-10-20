import numpy as np
import pandas as pd
import joblib
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix

# ---------------------------
# Load EEG dataset
# ---------------------------
data = pd.read_csv(r"C:\Users\RITHESH\Downloads\major project fin\dataset.csv")  # Change path

# EEG features
eeg_columns = ['Fp1','Fp2','F3','F4','C3','C4','P3','P4','O1','O2',
               'F7','F8','T7','T8','P7','P8','Fz','Cz','Pz']

# ---------------------------
# Simulate ADHD question columns (Q1-Q10) for multi-modal testing
# ---------------------------
for i in range(1, 11):
    data[f'Q{i}'] = np.random.randint(1, 6, size=len(data))  # 1-5 scale

question_columns = [f'Q{i}' for i in range(1, 11)]

# ---------------------------
# Combine EEG + Question features
# ---------------------------
feature_columns = eeg_columns + question_columns
X = data[feature_columns]
y = data['Class']

# ---------------------------
# Scale EEG features
# ---------------------------
scaler = StandardScaler()
X[eeg_columns] = scaler.fit_transform(X[eeg_columns])

# Normalize question columns 1-5 -> 0-1
X[question_columns] = (X[question_columns] - 1)/4

# ---------------------------
# Train-test split
# ---------------------------
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# ---------------------------
# Train improved RandomForest classifier
# ---------------------------
rf_model = RandomForestClassifier(
    n_estimators=300, 
    max_depth=15,
    min_samples_split=5,
    random_state=42
)
rf_model.fit(X_train, y_train)

# ---------------------------
# Evaluate model
# ---------------------------
y_pred = rf_model.predict(X_test)
print("EEG + Questions Model Accuracy:", accuracy_score(y_test, y_pred))
print(classification_report(y_test, y_pred))
print("Confusion Matrix:\n", confusion_matrix(y_test, y_pred))

# ---------------------------
# Save model and scaler
# ---------------------------
joblib.dump(rf_model, "adhd_model_multimodal.pkl")
joblib.dump(scaler, "scaler_eeg.pkl")

# ---------------------------
# Heuristic function for other disorders
# ---------------------------
def heuristic_flags_weighted(questionnaire, medical_history=None):
    if medical_history is None:
        medical_history = {}
    flags = {}
    
    # ODD (Q11-Q13) simulated
    odd_score = np.mean([questionnaire[i] for i in range(10, 13)]) if len(questionnaire) >= 13 else 0
    if medical_history.get('family_adhd', 'No') == 'Yes':
        odd_score = (odd_score + 1)/2
    flags['ODD'] = 'Possible' if odd_score >= 0.5 else 'Unlikely'
    
    # Dyslexia (Q14-Q16)
    dys_score = np.mean([questionnaire[i] for i in range(13, 16)]) if len(questionnaire) >= 16 else 0
    if medical_history.get('family_learning_disorders', 'No') == 'Yes':
        dys_score = (dys_score + 1)/2
    flags['Dyslexia'] = 'Possible' if dys_score >= 0.5 else 'Unlikely'
    
    # ASD (Q17-Q20)
    asd_score = np.mean([questionnaire[i] for i in range(16, 20)]) if len(questionnaire) >= 20 else 0
    flags['ASD'] = 'Possible' if asd_score >= 0.5 else 'Unlikely'
    
    return flags

# ---------------------------
# Final prediction logic
# ---------------------------
def final_prediction(eeg_pred, question_scores):
    if eeg_pred == "ADHD":
        return "ADHD"
    
    possible_disorders = {k: v for k, v in question_scores.items() if v == "Possible"}
    
    if possible_disorders:
        return list(possible_disorders.keys())[0]  # pick first possible disorder
    else:
        return "Healthy"
