import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  CheckCircle,
  AlertTriangle,
  XCircle,
  Download,
  Home,
  FileText,
  TrendingUp,
  Brain,
  Activity,
  Info,
  Database,
  Users,
  Percent,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import { useAssessment } from '../context/AssessmentContext'
import BrainHeatmap from '../components/BrainHeatmap'
import AIRecommendations from '../components/AIRecommendations'
import AssessmentCharts from '../components/AssessmentCharts'
import EmailReport from '../components/EmailReport'
import { generatePDFReport } from '../utils/pdfReport'

interface AssessmentResult {
  prediction: string
  risk_level?: string
  confidence?: number
  confidence_scores?: Record<string, number>
  saved_to_database?: boolean
  error?: string
}

const ResultsDashboard: React.FC = () => {
  const navigate = useNavigate()
  const { userInfo, medicalHistory, questionnaireData, eegData, resetAssessment } = useAssessment()
  const [result, setResult] = useState<AssessmentResult | null>(null)
  const [showCharts, setShowCharts] = useState(false)

  useEffect(() => {
    const storedResult = sessionStorage.getItem('assessmentResult')
    if (storedResult) {
      setResult(JSON.parse(storedResult))
    } else {
      navigate('/')
    }
  }, [navigate])

  const getRiskLevel = (prediction: string) => {
    if (prediction === 'ADHD') return 'high'
    if (['ODD', 'ASD', 'Dyslexia'].includes(prediction)) return 'moderate'
    return 'low'
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-risk-high'
      case 'moderate': return 'text-risk-moderate'
      case 'low': return 'text-risk-low'
      default: return 'text-medical-slate'
    }
  }

  const getRiskBgColor = (level: string) => {
    switch (level) {
      case 'high': return 'bg-red-100 border-red-300'
      case 'moderate': return 'bg-yellow-100 border-yellow-300'
      case 'low': return 'bg-green-100 border-green-300'
      default: return 'bg-gray-100 border-gray-300'
    }
  }

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'high': return <XCircle className="w-12 h-12 text-risk-high" />
      case 'moderate': return <AlertTriangle className="w-12 h-12 text-risk-moderate" />
      case 'low': return <CheckCircle className="w-12 h-12 text-risk-low" />
      default: return null
    }
  }

  const getRecommendations = (prediction: string) => {
    const recommendations: { [key: string]: string[] } = {
      ADHD: [
        'Comprehensive diagnostic evaluation recommended with DSM-5 criteria',
        'Consider neuropsychological testing for executive function assessment',
        'Evaluate for comorbid conditions (anxiety, depression, learning disorders)',
        'Discuss evidence-based treatment options including behavioral interventions',
        'Consider pharmacological intervention with stimulant or non-stimulant medications',
        'Implement accommodations in academic or occupational settings',
        'Schedule follow-up assessment in 3-6 months',
      ],
      ODD: [
        'Behavioral assessment and family dynamics evaluation',
        'Parent management training and family therapy recommended',
        'Rule out underlying mood or anxiety disorders',
        'School-based behavioral intervention plan',
        'Monitor for progression to conduct disorder',
      ],
      ASD: [
        'Comprehensive autism diagnostic evaluation (ADOS-2, ADI-R)',
        'Speech and language assessment',
        'Occupational therapy evaluation for sensory processing',
        'Applied Behavior Analysis (ABA) therapy consideration',
        'Social skills training and intervention',
      ],
      Dyslexia: [
        'Comprehensive psychoeducational evaluation',
        'Evidence-based reading intervention (Orton-Gillingham, Wilson Reading)',
        'School accommodations and IEP/504 plan',
        'Assistive technology evaluation',
        'Regular progress monitoring',
      ],
      Healthy: [
        'No significant indicators of neurodevelopmental disorders detected',
        'Continue routine developmental monitoring',
        'Maintain healthy lifestyle and cognitive engagement',
        'Re-evaluate if symptoms emerge or worsen',
      ],
      Non_ADHD: [
        'No significant indicators of ADHD detected in this screening',
        'Continue routine developmental monitoring',
        'Maintain healthy lifestyle and cognitive engagement',
        'Re-evaluate if symptoms emerge or worsen',
      ],
    }
    return recommendations[prediction] || recommendations['Healthy'] || []
  }

  const handleDownloadPDF = () => {
    if (!result) return
    const risk = result.risk_level || getRiskLevel(result.prediction)
    generatePDFReport({
      patientId: userInfo.patientId,
      age: userInfo.age,
      gender: userInfo.gender,
      education: userInfo.education,
      occupation: userInfo.occupation,
      referringPhysician: userInfo.referringPhysician,
      prediction: result.prediction,
      riskLevel: risk,
      confidence: result.confidence || 0,
      confidenceScores: result.confidence_scores || {},
      eegData,
      questionnaireData,
      medicalHistory: medicalHistory as Record<string, any>,
      recommendations: getRecommendations(result.prediction),
    })
  }

  const handleNewAssessment = () => {
    resetAssessment()
    sessionStorage.removeItem('assessmentResult')
    navigate('/')
  }

  if (!result) return null

  const riskLevel = result.risk_level || getRiskLevel(result.prediction)
  const confidence = result.confidence || 0
  const confidenceScores = result.confidence_scores || {}

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto space-y-6"
    >
      {/* Header */}
      <div className="card">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-medical-blue bg-opacity-10 mb-4">
            <Brain className="w-10 h-10 text-medical-blue" />
          </div>
          <h1 className="text-3xl font-bold text-medical-navy">
            Assessment Results
          </h1>
          <p className="text-medical-slate">
            Comprehensive neurodevelopmental screening analysis
          </p>
          <div className="flex items-center justify-center space-x-6 pt-4 text-sm">
            <div className="flex items-center space-x-2">
              <FileText className="w-4 h-4 text-medical-slate" />
              <span className="text-medical-slate">
                Patient ID: <span className="font-medium text-medical-navy">{userInfo.patientId}</span>
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Activity className="w-4 h-4 text-medical-slate" />
              <span className="text-medical-slate">
                Assessment Date:{' '}
                <span className="font-medium text-medical-navy">
                  {new Date().toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Primary Result Card with Confidence */}
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        className={`card border-2 ${getRiskBgColor(riskLevel)}`}
      >
        <div className="text-center space-y-4">
          <div className="flex justify-center">{getRiskIcon(riskLevel)}</div>
          
          <div>
            <h2 className="text-2xl font-bold text-medical-navy mb-2">
              Predicted Condition
            </h2>
            <div className={`text-4xl font-bold ${getRiskColor(riskLevel)}`}>
              {result.prediction}
            </div>
          </div>

          <div className="flex items-center justify-center space-x-4 flex-wrap gap-2">
            <div className="inline-flex items-center space-x-2 bg-white/60 px-4 py-2 rounded-full">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm font-medium">
                Risk Level: {riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1)}
              </span>
            </div>

            {/* Confidence Score Badge */}
            {confidence > 0 && (
              <div className="inline-flex items-center space-x-2 bg-white/60 px-4 py-2 rounded-full">
                <Percent className="w-4 h-4 text-medical-blue" />
                <span className="text-sm font-medium">
                  Confidence: <span className="text-medical-blue font-bold">{confidence}%</span>
                </span>
              </div>
            )}
          </div>

          {/* Confidence Breakdown Bar */}
          {Object.keys(confidenceScores).length > 0 && (
            <div className="max-w-md mx-auto pt-2">
              <div className="flex rounded-full overflow-hidden h-4 bg-gray-200">
                {Object.entries(confidenceScores).map(([label, score]) => (
                  <div
                    key={label}
                    className="transition-all duration-500"
                    style={{
                      width: `${score}%`,
                      backgroundColor: label === 'ADHD' ? '#ef4444' : '#10b981',
                    }}
                    title={`${label}: ${score}%`}
                  />
                ))}
              </div>
              <div className="flex justify-between mt-1 text-xs text-medical-slate">
                {Object.entries(confidenceScores).map(([label, score]) => (
                  <span key={label}>
                    {label}: {score}%
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Brain Heatmap + Clinical Interpretation */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Brain Heatmap */}
        <BrainHeatmap eegData={eegData} />

        {/* Clinical Interpretation */}
        <div className="card">
          <h3 className="text-xl font-bold text-medical-navy mb-4 flex items-center">
            <Info className="w-5 h-5 mr-2 text-medical-blue" />
            Clinical Interpretation
          </h3>
          
          <div className="prose prose-sm max-w-none text-medical-dark-slate">
            {result.prediction === 'ADHD' && (
              <p>
                The assessment indicates significant markers consistent with{' '}
                <strong>Attention-Deficit/Hyperactivity Disorder (ADHD)</strong> with a 
                model confidence of <strong>{confidence}%</strong>. The
                combined analysis of EEG neurophysiological patterns and behavioral
                symptomatology suggests patterns characteristic of ADHD presentation.
                Comprehensive clinical evaluation is strongly recommended for diagnostic
                confirmation and treatment planning.
              </p>
            )}
            {(result.prediction === 'Non_ADHD' || result.prediction === 'Healthy') && (
              <p>
                The comprehensive assessment does not reveal significant markers for 
                ADHD at this time (model confidence: <strong>{confidence}%</strong> for non-ADHD classification). 
                However, clinical judgment should consider the complete patient 
                presentation and context. If symptoms persist or worsen, re-evaluation 
                may be warranted.
              </p>
            )}
            {result.prediction === 'ODD' && (
              <p>
                Assessment results suggest behavioral patterns consistent with{' '}
                <strong>Oppositional Defiant Disorder (ODD)</strong>. Clinical evaluation 
                by a child psychiatrist or psychologist is recommended to confirm diagnosis.
              </p>
            )}
            {result.prediction === 'ASD' && (
              <p>
                The screening indicates possible markers associated with{' '}
                <strong>Autism Spectrum Disorder (ASD)</strong>. Comprehensive diagnostic 
                assessment using gold-standard tools (ADOS-2, ADI-R) is recommended.
              </p>
            )}
            {result.prediction === 'Dyslexia' && (
              <p>
                Assessment suggests potential indicators of <strong>Dyslexia</strong>. 
                Comprehensive psychoeducational evaluation is recommended.
              </p>
            )}
          </div>

          {/* Model Confidence Analysis */}
          {confidence > 0 && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Percent className="w-4 h-4 text-medical-blue" />
                <span className="text-sm font-semibold text-medical-navy">
                  Model Confidence Analysis
                </span>
              </div>
              <p className="text-xs text-medical-dark-slate leading-relaxed">
                The Random Forest model analyzed 19 EEG channels using the international 10-20 system 
                and returned a <strong>{confidence}%</strong> confidence for the <strong>{result.prediction}</strong> classification. 
                {confidence >= 80
                  ? ' This is a high-confidence prediction, indicating strong alignment with training data patterns.'
                  : confidence >= 60
                  ? ' This is a moderate-confidence prediction. Clinical correlation is recommended.'
                  : ' This is a lower-confidence prediction. Additional clinical evaluation is strongly recommended.'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* AI-Powered Personalized Recommendations */}
      <div className="card">
        <AIRecommendations
          prediction={result.prediction}
          riskLevel={riskLevel}
          confidence={confidence}
          questionnaireData={questionnaireData}
        />
      </div>

      {/* Assessment History Charts (collapsible) */}
      <div className="card">
        <button
          onClick={() => setShowCharts(!showCharts)}
          className="w-full flex items-center justify-between"
        >
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-medical-blue" />
            <h3 className="text-lg font-bold text-medical-navy">
              Assessment Analytics &amp; History
            </h3>
          </div>
          {showCharts ? (
            <ChevronUp className="w-5 h-5 text-medical-slate" />
          ) : (
            <ChevronDown className="w-5 h-5 text-medical-slate" />
          )}
        </button>
        {showCharts && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-4"
          >
            <AssessmentCharts />
          </motion.div>
        )}
      </div>

      {/* Disclaimer */}
      <div className="card bg-amber-50 border-2 border-amber-200">
        <div className="flex items-start space-x-4">
          <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
          <div className="flex-1">
            <h4 className="font-bold text-medical-navy mb-2">
              Important Clinical Disclaimer
            </h4>
            <p className="text-sm text-medical-dark-slate leading-relaxed">
              This assessment constitutes a <strong>screening tool</strong> and does NOT
              represent a definitive clinical diagnosis. Results should be interpreted by
              a qualified healthcare professional within the context of comprehensive
              clinical evaluation, patient history, and standardized diagnostic criteria
              (DSM-5, ICD-11). This tool is designed to support clinical decision-making
              and should not be used as the sole basis for diagnosis or treatment
              decisions.
            </p>
          </div>
        </div>
      </div>

      {/* Database Save Status */}
      {result.saved_to_database && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="card bg-green-50 border-2 border-green-200"
        >
          <div className="flex items-center space-x-3">
            <Database className="w-6 h-6 text-green-600" />
            <div>
              <p className="font-medium text-green-800">Assessment Saved to Database</p>
              <p className="text-sm text-green-600">
                All patient details, questionnaire responses, EEG data, and prediction results
                have been securely stored in the database.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Action Buttons */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* PDF Report Download */}
        <button
          onClick={handleDownloadPDF}
          className="btn-secondary flex items-center justify-center space-x-2"
        >
          <Download className="w-5 h-5" />
          <span>Download PDF Report</span>
        </button>

        {/* Email Report */}
        <EmailReport
          patientId={userInfo.patientId}
          prediction={result.prediction}
          riskLevel={riskLevel}
          confidence={confidence}
          recommendations={getRecommendations(result.prediction)}
        />

        <button
          onClick={() => navigate('/patient-records')}
          className="btn-secondary flex items-center justify-center space-x-2"
        >
          <Users className="w-5 h-5" />
          <span>View All Records</span>
        </button>
        
        <button
          onClick={handleNewAssessment}
          className="btn-primary flex items-center justify-center space-x-2"
        >
          <Home className="w-5 h-5" />
          <span>New Assessment</span>
        </button>
      </div>
    </motion.div>
  )
}

export default ResultsDashboard
