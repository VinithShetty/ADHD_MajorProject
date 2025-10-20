# 🏗️ System Architecture - ADHD Detection System

## 📐 Application Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER BROWSER                              │
│                     http://localhost:3000                        │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       │ HTTPS / REST API
                       │
┌──────────────────────▼──────────────────────────────────────────┐
│                   REACT FRONTEND                                 │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Landing Page (/)                                          │ │
│  │  - Professional branding                                   │ │
│  │  - Feature showcase                                        │ │
│  │  - Begin Assessment CTA                                    │ │
│  └────────────────────────────────────────────────────────────┘ │
│                            ↓                                     │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  User Information (/user-information)                      │ │
│  │  - Patient ID, demographics                                │ │
│  │  - Form validation                                         │ │
│  │  - Privacy notices                                         │ │
│  └────────────────────────────────────────────────────────────┘ │
│                            ↓                                     │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Medical History (/medical-history)                        │ │
│  │  - Family history                                          │ │
│  │  - Previous diagnoses                                      │ │
│  │  - Medications & clinical data                             │ │
│  └────────────────────────────────────────────────────────────┘ │
│                            ↓                                     │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Questionnaire (/questionnaire)                            │ │
│  │  - 20 clinical questions                                   │ │
│  │  - 5-point Likert scale                                    │ │
│  │  - Progress tracking                                       │ │
│  │  - 4 paginated sections                                    │ │
│  └────────────────────────────────────────────────────────────┘ │
│                            ↓                                     │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  EEG Upload (/eeg-upload)                                  │ │
│  │  - Drag-and-drop interface                                 │ │
│  │  - 19-channel validation                                   │ │
│  │  - CSV/JSON parsing                                        │ │
│  │  - API submission                                          │ │
│  └────────────────────────────────────────────────────────────┘ │
│                            ↓                                     │
│                    POST /predict                                 │
│                            ↓                                     │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       │ JSON Request
                       │ {
                       │   "eeg": {...},
                       │   "questions": [...],
                       │   "medical_history": {...}
                       │ }
                       │
┌──────────────────────▼──────────────────────────────────────────┐
│                   FLASK BACKEND                                  │
│                 http://localhost:5000                            │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  API Endpoint: POST /predict                               │ │
│  │  - Receive assessment data                                 │ │
│  │  - Validate inputs                                         │ │
│  │  - Process requests                                        │ │
│  └────────────────────────────────────────────────────────────┘ │
│                            ↓                                     │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Data Processing                                           │ │
│  │  - Parse EEG channels                                      │ │
│  │  - Normalize questionnaire                                 │ │
│  │  - Integrate medical history                               │ │
│  └────────────────────────────────────────────────────────────┘ │
│                            ↓                                     │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  ML Model Inference                                        │ │
│  │  - EEG feature extraction                                  │ │
│  │  - Questionnaire scoring                                   │ │
│  │  - Multi-modal fusion                                      │ │
│  │  - Disorder classification                                 │ │
│  └────────────────────────────────────────────────────────────┘ │
│                            ↓                                     │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Trained Models                                            │ │
│  │  - eeg_only_model.pkl                                      │ │
│  │  - eeg_scaler.pkl                                          │ │
│  │  - questionnaire_model.pkl                                 │ │
│  └────────────────────────────────────────────────────────────┘ │
│                            ↓                                     │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Heuristic Analysis                                        │ │
│  │  - ODD pattern detection                                   │ │
│  │  - Dyslexia indicators                                     │ │
│  │  - ASD characteristics                                     │ │
│  │  - Medical history weighting                               │ │
│  └────────────────────────────────────────────────────────────┘ │
│                            ↓                                     │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Response Generation                                       │ │
│  │  - Prediction: ADHD / ODD / ASD / Dyslexia / Healthy      │ │
│  │  - Error handling                                          │ │
│  └────────────────────────────────────────────────────────────┘ │
│                            ↓                                     │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       │ JSON Response
                       │ {
                       │   "prediction": "ADHD"
                       │ }
                       │
┌──────────────────────▼──────────────────────────────────────────┐
│                   REACT FRONTEND                                 │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Results Dashboard (/results)                              │ │
│  │  - Display prediction                                      │ │
│  │  - Risk stratification                                     │ │
│  │  - Clinical interpretation                                 │ │
│  │  - Evidence-based recommendations                          │ │
│  │  - Download report                                         │ │
│  │  - Professional disclaimers                                │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

## 🔄 Data Flow

### 1. Assessment Collection
```
User Input → React State → Context Provider → Local Storage (session)
```

### 2. API Communication
```
Frontend → Axios → POST /predict → Flask Backend → ML Models → Response
```

### 3. Result Display
```
Backend Response → Session Storage → Results Page → Visual Dashboard
```

## 📦 Component Hierarchy

```
App.tsx
├── Router
│   └── AssessmentProvider (Context)
│       └── Layout
│           ├── Header
│           ├── ProgressIndicator (conditional)
│           └── Routes
│               ├── LandingPage (/)
│               ├── UserInformation (/user-information)
│               ├── MedicalHistory (/medical-history)
│               ├── Questionnaire (/questionnaire)
│               ├── EEGUpload (/eeg-upload)
│               └── ResultsDashboard (/results)
```

## 🗄️ State Management

### Global State (Context)
```typescript
AssessmentContext {
  userInfo: {
    patientId, age, gender, education, ...
  },
  medicalHistory: {
    family_adhd, family_learning_disorders, ...
  },
  questionnaireData: {
    1: 3, 2: 4, 3: 2, ... (20 questions)
  },
  eegData: {
    Fp1, Fp2, F3, F4, ... (19 channels)
  },
  currentStep: number
}
```

### Session Storage
```javascript
sessionStorage.setItem('assessmentResult', JSON.stringify({
  prediction: "ADHD",
  ...
}))
```

## 🎨 Styling Architecture

### Tailwind Configuration
```javascript
theme: {
  colors: {
    medical: {
      navy: '#1e3a8a',
      blue: '#3b82f6',
      slate: '#64748b',
      ...
    },
    risk: {
      low: '#10b981',
      moderate: '#f59e0b',
      high: '#ef4444',
      ...
    }
  }
}
```

### Component Classes
```css
.btn-primary      → Primary action buttons
.btn-secondary    → Secondary actions
.card            → Content containers
.input-field     → Form inputs
.label-text      → Form labels
.error-text      → Error messages
```

## 🔐 Security Flow

```
User Input
  ↓
Client-Side Validation (React Hook Form)
  ↓
Data Sanitization
  ↓
Encryption (HTTPS)
  ↓
Backend Validation
  ↓
Processing
  ↓
Response Encryption (HTTPS)
  ↓
Result Display
  ↓
Session-Only Storage (No persistence)
```

## 📊 Assessment Scoring Logic

### Frontend Processing
```javascript
1. Collect user information
2. Gather medical history
3. Record questionnaire answers (1-5 scale)
4. Parse EEG file (CSV/JSON)
5. Validate all data
6. Submit to backend
```

### Backend Processing
```python
1. Receive POST request
2. Extract EEG features (19 channels)
3. Normalize questionnaire (scale to 0-1)
4. Scale EEG data (using trained scaler)
5. Combine features
6. Run through ML model
7. Apply heuristic rules
8. Generate prediction
9. Return result
```

## 🧠 ML Model Pipeline

```
Input Features (29 total)
├── EEG Channels (19)
│   └── Fp1, Fp2, F3, F4, C3, C4, P3, P4, O1, O2,
│       F7, F8, T7, T8, P7, P8, Fz, Cz, Pz
└── Questionnaire (10 ADHD-specific)
    └── Q1-Q10 (normalized 0-1)

         ↓
    
Preprocessing
├── EEG Scaler (StandardScaler)
└── Question Normalization ((value - 1) / 4)

         ↓

ML Model (RandomForest / SVM)
├── Primary prediction: ADHD vs Non-ADHD
└── Confidence scores

         ↓

Heuristic Layer
├── If ADHD → Return "ADHD"
├── Else check ODD patterns (Q11-13)
├── Else check Dyslexia patterns (Q14-16)
├── Else check ASD patterns (Q17-20)
└── Default → "Healthy"

         ↓

Output: Disorder Classification
```

## 🌐 API Contract

### Request Schema
```typescript
interface PredictionRequest {
  eeg: {
    Fp1: number, Fp2: number, F3: number, F4: number,
    C3: number, C4: number, P3: number, P4: number,
    O1: number, O2: number, F7: number, F8: number,
    T7: number, T8: number, P7: number, P8: number,
    Fz: number, Cz: number, Pz: number
  },
  questions: number[],  // Array of 20 values (1-5)
  medical_history?: {
    family_adhd?: string,
    family_learning_disorders?: string,
    ...
  }
}
```

### Response Schema
```typescript
interface PredictionResponse {
  prediction: "ADHD" | "ODD" | "ASD" | "Dyslexia" | "Healthy",
  error?: string
}
```

## 🎯 Disorder Classification Matrix

```
┌─────────────┬──────────────┬────────────────────┬──────────────┐
│  Disorder   │  Questions   │    EEG Pattern     │   Priority   │
├─────────────┼──────────────┼────────────────────┼──────────────┤
│   ADHD      │   Q1-Q10     │  ML Model Primary  │      1       │
│   ODD       │   Q11-Q13    │  Heuristic (>0.5)  │      2       │
│   Dyslexia  │   Q14-Q16    │  Heuristic (>0.5)  │      3       │
│   ASD       │   Q17-Q20    │  Heuristic (>0.5)  │      4       │
│   Healthy   │   All Low    │  No Indicators     │      5       │
└─────────────┴──────────────┴────────────────────┴──────────────┘
```

## 📈 Performance Optimization

### Frontend
- **Code Splitting**: React lazy loading
- **Asset Optimization**: Vite build optimization
- **State Management**: Context API (efficient)
- **Animations**: GPU-accelerated (Framer Motion)
- **Forms**: React Hook Form (minimal re-renders)

### Backend
- **Model Caching**: Pre-loaded models
- **Data Processing**: NumPy vectorization
- **API Response**: Minimal payload
- **Error Handling**: Fast failure paths

## 🔧 Development Tools

### Frontend Stack
```
Vite          → Build tool & dev server
TypeScript    → Type safety
ESLint        → Code linting
Prettier      → Code formatting (optional)
```

### Backend Stack
```
Flask         → Web framework
NumPy         → Numerical computing
Pandas        → Data manipulation
Scikit-learn  → ML models
Joblib        → Model serialization
```

---

## 🎓 Understanding the System

This architecture provides:

✅ **Separation of Concerns**: Frontend (UI) + Backend (ML)
✅ **Scalability**: Each layer can be scaled independently
✅ **Maintainability**: Clear component boundaries
✅ **Security**: Encrypted communication, validation at both ends
✅ **Professional**: Medical-grade design and workflow
✅ **Extensibility**: Easy to add new features or models

---

**Professional medical architecture for healthcare excellence** 🏥
