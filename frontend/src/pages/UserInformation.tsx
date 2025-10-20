import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import { User, ChevronRight, Info } from 'lucide-react'
import { useAssessment } from '../context/AssessmentContext'

interface UserInfoFormData {
  patientId: string
  age: string
  gender: string
  education: string
  occupation: string
  referringPhysician: string
}

const UserInformation: React.FC = () => {
  const navigate = useNavigate()
  const { userInfo, setUserInfo, setCurrentStep } = useAssessment()
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserInfoFormData>({
    defaultValues: userInfo,
  })

  const onSubmit = (data: UserInfoFormData) => {
    setUserInfo(data)
    setCurrentStep(1)
    navigate('/medical-history')
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
            <User className="w-6 h-6 text-medical-blue" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-medical-navy">
              Patient Information
            </h2>
            <p className="text-sm text-medical-slate">
              Please provide comprehensive patient demographics for clinical record
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Patient ID */}
          <div>
            <label className="label-text">
              Patient ID / Medical Record Number
              <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="text"
              className="input-field"
              placeholder="e.g., MRN-12345678"
              {...register('patientId', {
                required: 'Patient ID is required for record keeping',
                minLength: {
                  value: 3,
                  message: 'Patient ID must be at least 3 characters',
                },
              })}
            />
            {errors.patientId && (
              <p className="error-text">{errors.patientId.message}</p>
            )}
            <div className="flex items-start space-x-2 mt-2 text-xs text-medical-slate">
              <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>
                Data is processed anonymously and encrypted. Patient identifiers are
                used solely for clinical record correlation.
              </span>
            </div>
          </div>

          {/* Age */}
          <div>
            <label className="label-text">
              Age (years)
              <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="number"
              className="input-field"
              placeholder="Enter patient age"
              {...register('age', {
                required: 'Age is required',
                min: {
                  value: 6,
                  message: 'Assessment validated for ages 6 and above',
                },
                max: {
                  value: 100,
                  message: 'Please enter a valid age',
                },
              })}
            />
            {errors.age && <p className="error-text">{errors.age.message}</p>}
          </div>

          {/* Gender */}
          <div>
            <label className="label-text">
              Gender
              <span className="text-red-500 ml-1">*</span>
            </label>
            <select
              className="input-field"
              {...register('gender', { required: 'Gender selection is required' })}
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="prefer-not-to-say">Prefer not to say</option>
            </select>
            {errors.gender && <p className="error-text">{errors.gender.message}</p>}
          </div>

          {/* Education Level */}
          <div>
            <label className="label-text">
              Education Level
              <span className="text-red-500 ml-1">*</span>
            </label>
            <select
              className="input-field"
              {...register('education', {
                required: 'Education level is required',
              })}
            >
              <option value="">Select education level</option>
              <option value="elementary">Elementary School</option>
              <option value="middle-school">Middle School</option>
              <option value="high-school">High School / GED</option>
              <option value="some-college">Some College</option>
              <option value="associates">Associate's Degree</option>
              <option value="bachelors">Bachelor's Degree</option>
              <option value="masters">Master's Degree</option>
              <option value="doctorate">Doctorate / Professional Degree</option>
            </select>
            {errors.education && (
              <p className="error-text">{errors.education.message}</p>
            )}
          </div>

          {/* Occupation */}
          <div>
            <label className="label-text">
              Current Occupation / Student Status
            </label>
            <input
              type="text"
              className="input-field"
              placeholder="e.g., Student, Software Engineer, Healthcare Worker"
              {...register('occupation')}
            />
            <p className="text-xs text-medical-slate mt-1">
              Occupational context assists in functional impact assessment
            </p>
          </div>

          {/* Referring Physician */}
          <div>
            <label className="label-text">
              Referring Physician / Healthcare Provider
            </label>
            <input
              type="text"
              className="input-field"
              placeholder="Dr. John Smith, MD"
              {...register('referringPhysician')}
            />
          </div>

          {/* Privacy Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Info className="w-5 h-5 text-medical-blue flex-shrink-0 mt-0.5" />
              <div className="text-sm text-medical-dark-slate">
                <p className="font-medium mb-1">Data Privacy & Security</p>
                <p>
                  All patient information is encrypted using AES-256 encryption and
                  transmitted via secure HTTPS protocols. Data is processed in compliance
                  with HIPAA, GDPR, and applicable medical data protection regulations.
                  No personally identifiable information is retained beyond the clinical
                  session.
                </p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary flex items-center space-x-2">
              <span>Continue to Medical History</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  )
}

export default UserInformation
