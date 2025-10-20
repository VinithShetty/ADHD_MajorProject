import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
import joblib

# -----------------------
# Define 30 built-in questions
# -----------------------
questions = [
    "1. Do you often have trouble paying attention to details or make careless mistakes?",
    "2. Do you often find it hard to stay focused on tasks or activities?",
    "3. Do you often avoid tasks that require sustained mental effort?",
    "4. Do you frequently lose things needed for tasks (e.g., keys, notes)?",
    "5. Are you easily distracted by external stimuli?",
    "6. Do you often feel restless or fidgety?",
    "7. Do you have difficulty staying seated when expected?",
    "8. Do you often feel driven by a motor or always on the go?",
    "9. Do you talk excessively or interrupt others?",
    "10. Do you struggle to wait for your turn in activities?",
    "11. Do you often have difficulty organizing tasks or activities?",
    "12. Do you frequently start tasks without reading instructions?",
    "13. Do you lose focus during conversations?",
    "14. Do you forget daily activities or appointments?",
    "15. Do you often feel mentally overactive or distracted?",
    "16. Do you have trouble relaxing quietly?",
    "17. Do you act before thinking about consequences?",
    "18. Do you find it hard to listen when others are talking?",
    "19. Do you have difficulty finishing tasks?",
    "20. Do you struggle to follow through on instructions?",
    "21. Do you often misplace school/work materials?",
    "22. Do you find yourself blurting out answers before questions are completed?",
    "23. Do you have difficulty maintaining focus on boring tasks?",
    "24. Do you often make impulsive decisions?",
    "25. Do you struggle to manage time effectively?",
    "26. Do you feel emotionally impulsive or frustrated easily?",
    "27. Do you often switch between tasks without completing them?",
    "28. Do you procrastinate frequently?",
    "29. Do you have difficulty prioritizing tasks?",
    "30. Do you feel that your mind frequently wanders?",
]

# -----------------------
# Simulate a dataset (temporary until real data)
# -----------------------
np.random.seed(42)
num_samples = 300

# Random answers (1 to 5 scale)
X = np.random.randint(1, 6, (num_samples, len(questions)))

# Random labels (simulate 5 possible classes)
labels = ["ADHD", "ODD", "ASD", "Dyslexia", "Healthy"]
y = np.random.choice(labels, num_samples)

data = pd.DataFrame(X, columns=[f"Q{i}" for i in range(1, len(questions)+1)])
data["label"] = y

# -----------------------
# Train model
# -----------------------
X = data.drop(columns=["label"])
y = data["label"]

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

model = RandomForestClassifier(n_estimators=150, max_depth=10, random_state=42)
model.fit(X_train, y_train)

y_pred = model.predict(X_test)
print("Questionnaire Model Accuracy:", accuracy_score(y_test, y_pred))

# -----------------------
# Save model
# -----------------------
joblib.dump(model, "questionnaire_model.pkl")
print("✅ Questionnaire model saved successfully.")

# -----------------------
# Optional: Test input manually
# -----------------------
if __name__ == "__main__":
    print("\n--- Take a Quick Test ---")
    user_answers = []
    for q in questions:
        ans = input(f"{q} (1=Never, 5=Very Often): ")
        user_answers.append(int(ans))
    
    prediction = model.predict([user_answers])[0]
    print(f"\n🧾 Predicted Disorder: {prediction}")
