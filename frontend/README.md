# ADHD Detection System - Professional Frontend

## 🏥 Professional Medical-Grade ADHD Detection Platform

A comprehensive, React-based frontend application designed for healthcare professionals to conduct ADHD assessments and neurodevelopmental disorder screening using advanced EEG analysis and validated clinical questionnaires.

## 🎯 Features

### Core Functionality
- **Multi-Step Assessment Workflow**: Guided patient intake, medical history, clinical questionnaire, and EEG data upload
- **Professional Medical Interface**: Clean, clinical design optimized for healthcare environments
- **Real-time Progress Tracking**: Visual indicators and completion status throughout assessment
- **Comprehensive Results Dashboard**: Detailed diagnostic insights with clinical recommendations
- **HIPAA-Compliant Design**: Security-focused architecture with encrypted data handling

### Technical Highlights
- **React 18** with TypeScript for type safety
- **Tailwind CSS** for responsive, professional styling
- **Framer Motion** for subtle, professional animations
- **React Hook Form** for advanced form management
- **Axios** for secure API communication
- **React Router** for seamless navigation

## 📋 Prerequisites

- Node.js 18+ and npm/yarn
- Python backend running on `http://localhost:5000`
- Modern web browser (Chrome, Firefox, Edge, Safari)

## 🚀 Installation & Setup

### 1. Navigate to Frontend Directory
```powershell
cd "c:\Users\Vinith\Desktop\major project\major-project-final\frontend"
```

### 2. Install Dependencies
```powershell
npm install
```

### 3. Configure Environment
Create `.env` file with:
```
VITE_API_URL=http://localhost:5000
```

### 4. Start Development Server
```powershell
npm run dev
```

The application will be available at `http://localhost:3000`

## 🏗️ Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Layout.tsx       # Main layout wrapper
│   │   ├── Header.tsx       # Professional header
│   │   └── ProgressIndicator.tsx  # Assessment progress
│   ├── pages/               # Main application pages
│   │   ├── LandingPage.tsx  # Professional landing page
│   │   ├── UserInformation.tsx    # Patient intake form
│   │   ├── MedicalHistory.tsx     # Medical history assessment
│   │   ├── Questionnaire.tsx      # Clinical questionnaire
│   │   ├── EEGUpload.tsx    # EEG data upload interface
│   │   └── ResultsDashboard.tsx   # Results and recommendations
│   ├── context/             # React Context for state management
│   │   └── AssessmentContext.tsx
│   ├── services/            # API integration
│   │   └── api.ts           # Backend communication
│   ├── App.tsx              # Main app component
│   ├── main.tsx             # Application entry point
│   └── index.css            # Global styles
├── public/                  # Static assets
├── index.html               # HTML template
├── package.json             # Dependencies
├── tsconfig.json            # TypeScript configuration
├── tailwind.config.js       # Tailwind CSS configuration
└── vite.config.ts           # Vite build configuration
```

## 🔧 Backend Integration

### Expected API Endpoints

#### POST `/predict`
**Request:**
```json
{
  "eeg": {
    "Fp1": 0.5, "Fp2": 0.3, "F3": 0.7, ...
  },
  "questions": [3, 4, 2, 5, 3, ...],  // 20 values (1-5 scale)
  "medical_history": {
    "family_adhd": "yes",
    "family_learning_disorders": "no"
  }
}
```

**Response:**
```json
{
  "prediction": "ADHD"  // or "ODD", "ASD", "Dyslexia", "Healthy"
}
```

### Starting the Backend
```powershell
cd "c:\Users\Vinith\Desktop\major project\major-project-final\backend"
python app.py  # or main.py
```

## 📊 Assessment Workflow

1. **Landing Page**: Professional introduction and feature overview
2. **Patient Information**: Comprehensive demographic data collection
3. **Medical History**: Detailed clinical background assessment
4. **Clinical Questionnaire**: 20-question evidence-based screening tool
5. **EEG Upload**: Neurophysiological data upload and validation
6. **Results Dashboard**: Comprehensive diagnostic insights and recommendations

## 🎨 Design System

### Color Palette
- **Medical Navy**: Primary clinical color (#1e3a8a)
- **Clinical Blue**: Interactive elements (#3b82f6)
- **Medical Slate**: Secondary text (#64748b)
- **Risk Indicators**: Color-coded assessment results

### Typography
- **Primary Font**: Helvetica Neue, Arial
- **Professional, clean sans-serif** optimized for clinical readability

## 🔒 Security & Privacy

- **End-to-End Encryption**: All data transmission encrypted via HTTPS
- **Anonymous Processing**: Patient data anonymized for analysis
- **HIPAA Compliance**: Designed to meet healthcare data protection standards
- **Session-Based Storage**: No persistent client-side data storage
- **Secure API Communication**: Token-based authentication ready

## 📱 Responsive Design

- **Desktop First**: Optimized for clinical workstations
- **Tablet Support**: Fully responsive for professional tablets
- **Mobile Accessible**: Functional on mobile devices for flexibility

## 🧪 Testing

```powershell
# Run linter
npm run lint

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📦 Production Build

```powershell
npm run build
```

Output in `dist/` directory, ready for deployment to:
- Netlify
- Vercel
- AWS S3 + CloudFront
- Azure Static Web Apps

## 🛠️ Troubleshooting

### Port Already in Use
```powershell
# Change port in vite.config.ts or use different port
npm run dev -- --port 3001
```

### Backend Connection Issues
- Ensure backend is running on port 5000
- Check CORS configuration in backend
- Verify `.env` file configuration

### Dependencies Issues
```powershell
# Clear cache and reinstall
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
```

## 👥 Healthcare Professional Use

### Important Notes
- **Diagnostic Support Tool**: Not a replacement for clinical diagnosis
- **Professional Interpretation**: Results require healthcare professional review
- **DSM-5 Alignment**: Questionnaire based on evidence-based criteria
- **Clinical Context**: Results must be interpreted within complete patient evaluation

## 📄 License

Professional medical application for healthcare use. Ensure compliance with local medical device regulations and data protection laws.

## 📞 Support

For technical support or clinical inquiries, consult with qualified healthcare IT professionals and clinical supervisors.

---

**Built with precision for healthcare professionals** 🏥
