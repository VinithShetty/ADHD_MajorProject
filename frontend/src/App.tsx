import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AssessmentProvider } from './context/AssessmentContext'
import { AuthProvider } from './context/AuthContext'
import AuthPage from './pages/AuthPage'
import LandingPage from './pages/LandingPage'
import UserInformation from './pages/UserInformation'
import MedicalHistory from './pages/MedicalHistory'
import Questionnaire from './pages/Questionnaire'
import EEGUpload from './pages/EEGUpload'
import ResultsDashboard from './pages/ResultsDashboard'
import PatientRecords from './pages/PatientRecords'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <Router>
      <AuthProvider>
        <AssessmentProvider>
          <Routes>
            {/* Public route — auth page has its own full-screen layout */}
            <Route path="/login" element={<AuthPage />} />

            {/* All other routes are protected and use the shared Layout */}
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Routes>
                      <Route path="/" element={<LandingPage />} />
                      <Route path="/user-information" element={<UserInformation />} />
                      <Route path="/medical-history" element={<MedicalHistory />} />
                      <Route path="/questionnaire" element={<Questionnaire />} />
                      <Route path="/eeg-upload" element={<EEGUpload />} />
                      <Route path="/results" element={<ResultsDashboard />} />
                      <Route path="/patient-records" element={<PatientRecords />} />
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </Layout>
                </ProtectedRoute>
              }
            />
          </Routes>
        </AssessmentProvider>
      </AuthProvider>
    </Router>
  )
}

export default App
