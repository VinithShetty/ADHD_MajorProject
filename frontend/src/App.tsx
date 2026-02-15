import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AssessmentProvider } from './context/AssessmentContext'
import LandingPage from './pages/LandingPage'
import UserInformation from './pages/UserInformation'
import MedicalHistory from './pages/MedicalHistory'
import Questionnaire from './pages/Questionnaire'
import EEGUpload from './pages/EEGUpload'
import ResultsDashboard from './pages/ResultsDashboard'
import PatientRecords from './pages/PatientRecords'
import Layout from './components/Layout'

function App() {
  return (
    <Router>
      <AssessmentProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/user-information" element={<UserInformation />} />
            <Route path="/medical-history" element={<MedicalHistory />} />
            <Route path="/questionnaire" element={<Questionnaire />} />
            <Route path="/eeg-upload" element={<EEGUpload />} />
            <Route path="/results" element={<ResultsDashboard />} />
            <Route path="/patient-records" element={<PatientRecords />} />
          </Routes>
        </Layout>
      </AssessmentProvider>
    </Router>
  )
}

export default App
