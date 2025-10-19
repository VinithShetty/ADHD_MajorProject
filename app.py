from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import joblib

app = Flask(__name__)
CORS(app)  # <--- Enable CORS for all routes

# Load model and scaler
model = joblib.load("models/eeg_only_model.pkl")
scaler = joblib.load("models/eeg_scaler.pkl")

eeg_columns = ['Fp1','Fp2','F3','F4','C3','C4','P3','P4','O1','O2',
               'F7','F8','T7','T8','P7','P8','Fz','Cz','Pz']

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

        df[eeg_columns] = scaler.transform(df[eeg_columns])
        pred = model.predict(df[eeg_columns])[0]

        return jsonify({"prediction": pred})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
