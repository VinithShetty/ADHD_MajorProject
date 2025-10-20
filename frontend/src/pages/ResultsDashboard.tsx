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
} from 'lucide-react'
import { useAssessment } from '../context/AssessmentContext'

interface AssessmentResult {
  prediction: string
  error?: string
}

const ResultsDashboard: React.FC = () => {
  const navigate = useNavigate()
  const { userInfo, resetAssessment } = useAssessment()
  const [result, setResult] = useState<AssessmentResult | null>(null)

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
      case 'high':
        return 'text-risk-high'
      case 'moderate':
        return 'text-risk-moderate'
      case 'low':
        return 'text-risk-low'
      default:
        return 'text-medical-slate'
    }
  }

  const getRiskBgColor = (level: string) => {
    switch (level) {
      case 'high':
        return 'bg-red-100 border-red-300'
      case 'moderate':
        return 'bg-yellow-100 border-yellow-300'
      case 'low':
        return 'bg-green-100 border-green-300'
      default:
        return 'bg-gray-100 border-gray-300'
    }
  }

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'high':
        return <XCircle className="w-12 h-12 text-risk-high" />
      case 'moderate':
        return <AlertTriangle className="w-12 h-12 text-risk-moderate" />
      case 'low':
        return <CheckCircle className="w-12 h-12 text-risk-low" />
      default:
        return null
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
    }

    return recommendations[prediction] || []
  }

  const handleDownloadReport = () => {
    if (!result) return

    const reportData = {
      patientId: userInfo.patientId,
      assessmentDate: new Date().toISOString(),
      prediction: result.prediction,
      riskLevel: getRiskLevel(result.prediction),
      recommendations: getRecommendations(result.prediction),
      disclaimer:
        'This assessment is a screening tool and does not constitute a clinical diagnosis. Professional clinical evaluation is required.',
    }

    const dataStr = JSON.stringify(reportData, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr)
    const exportFileDefaultName = `ADHD_Assessment_${userInfo.patientId}_${
      new Date().toISOString().split('T')[0]
    }.json`

    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }

  const handleNewAssessment = () => {
    resetAssessment()
    sessionStorage.removeItem('assessmentResult')
    navigate('/')
  }

  if (!result) {
    return null
  }

  const riskLevel = getRiskLevel(result.prediction)

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
                Patient ID: <span className="font-medium">{userInfo.patientId}</span>
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Activity className="w-4 h-4 text-medical-slate" />
              <span className="text-medical-slate">
                Assessment Date:{' '}
                <span className="font-medium">
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

      {/* Primary Result Card */}
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

          <div className="inline-flex items-center space-x-2 bg-white bg-opacity-60 px-4 py-2 rounded-full">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm font-medium">
              Risk Level: {riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1)}
            </span>
          </div>
        </div>
      </motion.div>

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
              <strong>Attention-Deficit/Hyperactivity Disorder (ADHD)</strong>. The
              combined analysis of EEG neurophysiological patterns and behavioral
              symptomatology suggests patterns characteristic of ADHD presentation.
              Comprehensive clinical evaluation is strongly recommended for diagnostic
              confirmation and treatment planning.
            </p>
          )}
          {result.prediction === 'ODD' && (
            <p>
              Assessment results suggest behavioral patterns consistent with{' '}
              <strong>Oppositional Defiant Disorder (ODD)</strong>. The questionnaire
              responses indicate elevated markers for oppositional and defiant
              behaviors. Clinical evaluation by a child psychiatrist or psychologist is
              recommended to confirm diagnosis and develop an appropriate intervention
              strategy.
            </p>
          )}
          {result.prediction === 'ASD' && (
            <p>
              The screening indicates possible markers associated with{' '}
              <strong>Autism Spectrum Disorder (ASD)</strong>. Patterns in social
              communication and restricted/repetitive behaviors warrant further
              evaluation. Comprehensive diagnostic assessment using gold-standard tools
              (ADOS-2, ADI-R) is recommended for diagnostic clarification.
            </p>
          )}
          {result.prediction === 'Dyslexia' && (
            <p>
              Assessment suggests potential indicators of <strong>Dyslexia</strong> or
              specific learning disorder in reading. The symptom profile indicates
              challenges with reading fluency, decoding, or comprehension.
              Comprehensive psychoeducational evaluation is recommended to confirm
              diagnosis and guide educational interventions.
            </p>
          )}
          {result.prediction === 'Healthy' && (
            <p>
              The comprehensive assessment does not reveal significant markers for major
              neurodevelopmental disorders at this time. However, clinical judgment
              should consider the complete patient presentation and context. If symptoms
              persist or worsen, re-evaluation may be warranted.
            </p>
          )}
        </div>
      </div>

      {/* Clinical Recommendations */}
      <div className="card">
        <h3 className="text-xl font-bold text-medical-navy mb-4">
          Clinical Recommendations
        </h3>
        
        <div className="space-y-3">
          {getRecommendations(result.prediction).map((recommendation, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg"
            >
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-medical-blue text-white flex items-center justify-center text-sm font-bold mt-0.5">
                {index + 1}
              </div>
              <p className="text-sm text-medical-dark-slate flex-1">
                {recommendation}
              </p>
            </motion.div>
          ))}
        </div>
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

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4">
        <button
          onClick={handleDownloadReport}
          className="btn-secondary flex items-center space-x-2"
        >
          <Download className="w-5 h-5" />
          <span>Download Report</span>
        </button>
        
        <button
          onClick={handleNewAssessment}
          className="btn-primary flex items-center space-x-2"
        >
          <Home className="w-5 h-5" />
          <span>New Assessment</span>
        </button>
      </div>
    </motion.div>
  )
}

export default ResultsDashboard
