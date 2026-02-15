from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import joblib
import warnings
import json
from datetime import datetime
from supabase_config import supabase

# Suppress scikit-learn version warnings
warnings.filterwarnings('ignore', category=UserWarning)

app = Flask(__name__)
CORS(app)  # <--- Enable CORS for all routes

# Load model and scaler
model = joblib.load("models/eeg_only_model.pkl")
scaler = joblib.load("models/eeg_scaler.pkl")

eeg_columns = ['Fp1','Fp2','F3','F4','C3','C4','P3','P4','O1','O2',
               'F7','F8','T7','T8','P7','P8','Fz','Cz','Pz']


def get_risk_level(prediction):
    """Determine risk level based on prediction."""
    if prediction == 'ADHD':
        return 'high'
    elif prediction in ['ODD', 'ASD', 'Dyslexia']:
        return 'moderate'
    return 'low'


def store_assessment_in_supabase(data, prediction):
    """Store the complete assessment data in Supabase database."""
    try:
        user_info = data.get("user_info", {})
        medical_history = data.get("medical_history", {})
        questions = data.get("questions", [])
        eeg_data = data.get("eeg", {})
        risk_level = get_risk_level(prediction)

        record = {
            "patient_id": user_info.get("patientId", "UNKNOWN"),
            "age": user_info.get("age", ""),
            "gender": user_info.get("gender", ""),
            "education": user_info.get("education", ""),
            "occupation": user_info.get("occupation", ""),
            "referring_physician": user_info.get("referringPhysician", ""),
            "medical_history": json.dumps(medical_history) if isinstance(medical_history, dict) else medical_history,
            "questionnaire_responses": json.dumps(questions) if isinstance(questions, list) else questions,
            "eeg_data": json.dumps(eeg_data) if isinstance(eeg_data, dict) else eeg_data,
            "prediction": prediction,
            "risk_level": risk_level,
            "assessment_date": datetime.utcnow().isoformat(),
        }

        response = supabase.table("patient_assessments").insert(record).execute()
        print(f"[Supabase] Assessment stored successfully for patient: {record['patient_id']}")
        return response.data
    except Exception as e:
        print(f"[Supabase] Error storing assessment: {str(e)}")
        return None


@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()
    if not data or "eeg" not in data:
        return jsonify({"error": "No EEG data provided"}), 400

    eeg_data = data["eeg"]
    try:
        df = pd.DataFrame([eeg_data])
        missing = [col for col in eeg_columns if col not in df.columns]
        if missing:
            return jsonify({"error": f"Missing EEG columns: {missing}"}), 400

        # Extract EEG values as numpy array (avoids feature name warnings)
        import numpy as np
        eeg_values = df[eeg_columns].values.astype(np.float64)
        eeg_scaled = scaler.transform(eeg_values)
        pred = model.predict(eeg_scaled)[0]

        # Get confidence scores (probability for each class)
        probabilities = model.predict_proba(eeg_scaled)[0]
        class_labels = model.classes_.tolist()
        confidence_scores = {label: round(float(prob) * 100, 2) for label, prob in zip(class_labels, probabilities)}
        confidence = confidence_scores.get(pred, 0)

        # Store complete assessment in Supabase
        db_result = store_assessment_in_supabase(data, pred)
        saved = db_result is not None

        return jsonify({
            "prediction": pred,
            "risk_level": get_risk_level(pred),
            "confidence": confidence,
            "confidence_scores": confidence_scores,
            "saved_to_database": saved
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/assessments", methods=["GET"])
def get_assessments():
    """Fetch all stored patient assessments from Supabase."""
    try:
        response = supabase.table("patient_assessments") \
            .select("*") \
            .order("assessment_date", desc=True) \
            .execute()
        return jsonify({"assessments": response.data, "count": len(response.data)})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/assessments/<patient_id>", methods=["GET"])
def get_patient_assessments(patient_id):
    """Fetch assessments for a specific patient by patient ID."""
    try:
        response = supabase.table("patient_assessments") \
            .select("*") \
            .eq("patient_id", patient_id) \
            .order("assessment_date", desc=True) \
            .execute()
        return jsonify({"assessments": response.data, "count": len(response.data)})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/assessments/stats", methods=["GET"])
def get_assessment_stats():
    """Get summary statistics of all assessments."""
    try:
        response = supabase.table("patient_assessments").select("*").execute()
        assessments = response.data

        total = len(assessments)
        predictions = {}
        risk_levels = {}
        for a in assessments:
            pred = a.get("prediction", "Unknown")
            risk = a.get("risk_level", "Unknown")
            predictions[pred] = predictions.get(pred, 0) + 1
            risk_levels[risk] = risk_levels.get(risk, 0) + 1

        return jsonify({
            "total_assessments": total,
            "predictions_breakdown": predictions,
            "risk_levels_breakdown": risk_levels
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)
