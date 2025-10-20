import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import { Clipboard, ChevronRight, ChevronLeft, Info, AlertCircle } from 'lucide-react'
import { useAssessment } from '../context/AssessmentContext'

interface MedicalHistoryFormData {
  family_adhd: string
  family_learning_disorders: string
  family_asd: string
  previous_diagnosis: string[]
  current_medications: string
  substance_use: string
  sleep_issues: string
  head_trauma: string
  neurological_conditions: string
  psychiatric_history: string
  additional_notes: string
}

const MedicalHistory: React.FC = () => {
  const navigate = useNavigate()
  const { medicalHistory, setMedicalHistory, setCurrentStep } = useAssessment()
  const [selectedDiagnoses, setSelectedDiagnoses] = useState<string[]>(
    medicalHistory.previous_diagnosis
      ? JSON.parse(medicalHistory.previous_diagnosis as string)
      : []
  )

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MedicalHistoryFormData>({
    defaultValues: {
      ...medicalHistory,
      previous_diagnosis: selectedDiagnoses,
    } as any,
  })

  const diagnosisOptions = [
    'ADHD',
    'Anxiety Disorder',
    'Depression',
    'Bipolar Disorder',
    'OCD',
    'PTSD',
    'Learning Disability',
    'Autism Spectrum Disorder',
    'Other',
  ]

  const toggleDiagnosis = (diagnosis: string) => {
    setSelectedDiagnoses((prev) =>
      prev.includes(diagnosis)
        ? prev.filter((d) => d !== diagnosis)
        : [...prev, diagnosis]
    )
  }

  const onSubmit = (data: MedicalHistoryFormData) => {
    setMedicalHistory({
      ...data,
      previous_diagnosis: JSON.stringify(selectedDiagnoses),
    })
    setCurrentStep(2)
    navigate('/questionnaire')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto"
    >
      <div className="card">
        <div className="flex items-center space-x-3 mb-6 pb-6 border-b border-gray-200">
          <div className="bg-medical-blue bg-opacity-10 p-3 rounded-lg">
            <Clipboard className="w-6 h-6 text-medical-blue" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-medical-navy">
              Comprehensive Medical History
            </h2>
            <p className="text-sm text-medical-slate">
              Detailed clinical background for diagnostic context
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Family History - ADHD */}
          <div>
            <label className="label-text">
              Family History of ADHD
              <span className="text-red-500 ml-1">*</span>
            </label>
            <select
              className="input-field"
              {...register('family_adhd', {
                required: 'This field is required',
              })}
            >
              <option value="">Select option</option>
              <option value="yes">Yes - First Degree Relative</option>
              <option value="yes-extended">Yes - Extended Family</option>
              <option value="no">No</option>
              <option value="unknown">Unknown</option>
            </select>
            {errors.family_adhd && (
              <p className="error-text">{errors.family_adhd.message}</p>
            )}
          </div>

          {/* Family History - Learning Disorders */}
          <div>
            <label className="label-text">
              Family History of Learning Disorders
              <span className="text-red-500 ml-1">*</span>
            </label>
            <select
              className="input-field"
              {...register('family_learning_disorders', {
                required: 'This field is required',
              })}
            >
              <option value="">Select option</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
              <option value="unknown">Unknown</option>
            </select>
            {errors.family_learning_disorders && (
              <p className="error-text">{errors.family_learning_disorders.message}</p>
            )}
          </div>

          {/* Family History - ASD */}
          <div>
            <label className="label-text">
              Family History of Autism Spectrum Disorder
            </label>
            <select className="input-field" {...register('family_asd')}>
              <option value="">Select option</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
              <option value="unknown">Unknown</option>
            </select>
          </div>

          {/* Previous Diagnoses */}
          <div>
            <label className="label-text">
              Previous Psychiatric/Neurological Diagnoses
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
              {diagnosisOptions.map((diagnosis) => (
                <label
                  key={diagnosis}
                  className={`flex items-center space-x-2 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedDiagnoses.includes(diagnosis)
                      ? 'border-medical-blue bg-medical-blue bg-opacity-10'
                      : 'border-gray-200 hover:border-medical-light-blue'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedDiagnoses.includes(diagnosis)}
                    onChange={() => toggleDiagnosis(diagnosis)}
                    className="w-4 h-4 text-medical-blue"
                  />
                  <span className="text-sm font-medium">{diagnosis}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Current Medications */}
          <div>
            <label className="label-text">Current Medications</label>
            <textarea
              className="input-field min-h-[100px]"
              placeholder="List all current medications including dosage (e.g., Methylphenidate 10mg twice daily)"
              {...register('current_medications')}
            />
            <p className="text-xs text-medical-slate mt-1">
              Include psychotropic medications, supplements, and relevant prescription
              drugs
            </p>
          </div>

          {/* Substance Use */}
          <div>
            <label className="label-text">Substance Use History</label>
            <select className="input-field" {...register('substance_use')}>
              <option value="">Select option</option>
              <option value="none">No history</option>
              <option value="past">Past history (not current)</option>
              <option value="occasional">Occasional use</option>
              <option value="regular">Regular use</option>
              <option value="prefer-not-say">Prefer not to say</option>
            </select>
          </div>

          {/* Sleep Issues */}
          <div>
            <label className="label-text">Sleep Pattern Assessment</label>
            <select className="input-field" {...register('sleep_issues')}>
              <option value="">Select option</option>
              <option value="none">No significant issues</option>
              <option value="insomnia">Chronic insomnia</option>
              <option value="sleep-apnea">Sleep apnea (diagnosed)</option>
              <option value="irregular">Irregular sleep patterns</option>
              <option value="hypersomnia">Excessive daytime sleepiness</option>
            </select>
          </div>

          {/* Head Trauma */}
          <div>
            <label className="label-text">History of Head Trauma/TBI</label>
            <select className="input-field" {...register('head_trauma')}>
              <option value="">Select option</option>
              <option value="none">No history</option>
              <option value="mild">Mild (no loss of consciousness)</option>
              <option value="moderate">Moderate (brief loss of consciousness)</option>
              <option value="severe">Severe (extended loss of consciousness)</option>
            </select>
          </div>

          {/* Neurological Conditions */}
          <div>
            <label className="label-text">
              Other Neurological Conditions
            </label>
            <textarea
              className="input-field min-h-[80px]"
              placeholder="e.g., Epilepsy, migraine disorders, movement disorders"
              {...register('neurological_conditions')}
            />
          </div>

          {/* Psychiatric History */}
          <div>
            <label className="label-text">
              Additional Psychiatric History
            </label>
            <textarea
              className="input-field min-h-[80px]"
              placeholder="Previous hospitalizations, therapy history, significant life events"
              {...register('psychiatric_history')}
            />
          </div>

          {/* Additional Notes */}
          <div>
            <label className="label-text">Additional Clinical Notes</label>
            <textarea
              className="input-field min-h-[100px]"
              placeholder="Any additional relevant medical history, developmental concerns, or contextual information"
              {...register('additional_notes')}
            />
          </div>

          {/* Clinical Notice */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-medical-dark-slate">
                <p className="font-medium mb-1">Clinical Context Importance</p>
                <p>
                  Comprehensive medical history enhances diagnostic accuracy through
                  contextualization of assessment results. Information provided is
                  protected under medical confidentiality protocols.
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between space-x-4 pt-4">
            <button
              type="button"
              onClick={() => navigate('/user-information')}
              className="btn-secondary flex items-center space-x-2"
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Back</span>
            </button>
            <button type="submit" className="btn-primary flex items-center space-x-2">
              <span>Continue to Assessment</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  )
}

export default MedicalHistory
