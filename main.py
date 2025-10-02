# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS   # ✅ Add CORS
import pandas as pd
import numpy as np
import joblib

# ---------------------------
# Load trained model and scaler
# ---------------------------
model = joblib.load("adhd_model_multimodal.pkl")
scaler = joblib.load("scaler_eeg.pkl")

# EEG columns
eeg_columns = [
    'Fp1','Fp2','F3','F4','C3','C4','P3','P4','O1','O2',
    'F7','F8','T7','T8','P7','P8','Fz','Cz','Pz'
]

# Question columns
question_columns = [f'Q{i}' for i in range(1, 21)]

# ---------------------------
# Heuristic function for other disorders
# ---------------------------
def heuristic_flags_weighted(questionnaire, medical_history=None):
    if medical_history is None:
        medical_history = {}
    flags = {}

    # ODD (Q11-Q13)
    odd_score = np.mean([questionnaire[i] for i in range(10, 13)]) if len(questionnaire) >= 13 else 0
    if medical_history.get('family_adhd', 'No').lower() == 'yes':
        odd_score = (odd_score + 1) / 2
    flags['ODD'] = 'Possible' if odd_score >= 0.5 else 'Unlikely'

    # Dyslexia (Q14-Q16)
    dys_score = np.mean([questionnaire[i] for i in range(13, 16)]) if len(questionnaire) >= 16 else 0
    if medical_history.get('family_learning_disorders', 'No').lower() == 'yes':
        dys_score = (dys_score + 1) / 2
    flags['Dyslexia'] = 'Possible' if dys_score >= 0.5 else 'Unlikely'

    # ASD (Q17-Q20)
    asd_score = np.mean([questionnaire[i] for i in range(16, 20)]) if len(questionnaire) >= 20 else 0
    flags['ASD'] = 'Possible' if asd_score >= 0.5 else 'Unlikely'

    return flags

# ---------------------------
# Final prediction logic
# ---------------------------
def final_prediction(eeg_features, questionnaire, medical_history=None):
    # Normalize EEG features
    eeg_scaled = scaler.transform([eeg_features])

    # Normalize first 10 ADHD questions to 0-1
    adhd_questions = np.array(questionnaire[:10])
    adhd_questions = (adhd_questions - 1) / 4

    # Combine EEG + ADHD questions
    model_input = np.concatenate([eeg_scaled.flatten(), adhd_questions]).reshape(1, -1)

    eeg_pred = model.predict(model_input)[0]

    if eeg_pred == "ADHD":
        return "ADHD"

    # Check other disorders
    other_flags = heuristic_flags_weighted(questionnaire, medical_history)
    possible_disorders = [k for k, v in other_flags.items() if v == "Possible"]

    if possible_disorders:
        return possible_disorders[0]  # return first possible disorder
    else:
        return "Healthy"

# ---------------------------
# Flask App
# ---------------------------
app = Flask(__name__)
CORS(app)  # ✅ Enable CORS so frontend can call

@app.route('/')
def index():
    return "✅ EEG + Questionnaire ADHD Prediction API is running!"

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()

        eeg = data['eeg']               # dict of EEG features
        questions = data['questions']   # list of 20 answers (1-5)
        medical_history = data.get('medical_history', {})  # optional dict

        # Convert EEG dict to list in correct order
        eeg_features = [eeg[col] for col in eeg_columns]

        prediction = final_prediction(eeg_features, questions, medical_history)
        return jsonify({"prediction": prediction})

    except Exception as e:
        return jsonify({"error": str(e)})

if __name__ == '__main__':
    app.run(debug=True)
