import React from 'react'
import { useLocation } from 'react-router-dom'
import { useAssessment } from '../context/AssessmentContext'
import { Check } from 'lucide-react'
import { motion } from 'framer-motion'

const steps = [
  { id: 1, name: 'Patient Information', path: '/user-information' },
  { id: 2, name: 'Medical History', path: '/medical-history' },
  { id: 3, name: 'Assessment', path: '/questionnaire' },
  { id: 4, name: 'EEG Data', path: '/eeg-upload' },
]

const ProgressIndicator: React.FC = () => {
  const location = useLocation()
  const { currentStep } = useAssessment()

  const getCurrentStepIndex = () => {
    const index = steps.findIndex((step) => step.path === location.pathname)
    return index !== -1 ? index : currentStep
  }

  const activeStep = getCurrentStepIndex()

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          {steps.map((step, index) => (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center flex-1">
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                    index < activeStep
                      ? 'bg-green-500 text-white'
                      : index === activeStep
                      ? 'bg-medical-blue text-white ring-4 ring-medical-light-blue ring-opacity-30'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {index < activeStep ? <Check className="w-5 h-5" /> : step.id}
                </motion.div>
                <span
                  className={`text-xs mt-2 font-medium ${
                    index <= activeStep ? 'text-medical-navy' : 'text-gray-400'
                  }`}
                >
                  {step.name}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`h-1 flex-1 mx-2 mt-[-20px] transition-all ${
                    index < activeStep ? 'bg-green-500' : 'bg-gray-200'
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ProgressIndicator
