import React, { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDropzone } from 'react-dropzone'
import { motion } from 'framer-motion'
import {
  Upload,
  ChevronLeft,
  AlertCircle,
  CheckCircle,
  FileText,
  Zap,
  Loader,
} from 'lucide-react'
import { useAssessment } from '../context/AssessmentContext'
import { submitAssessment, EEGData } from '../services/api'

const EEGUpload: React.FC = () => {
  const navigate = useNavigate()
  const { userInfo, medicalHistory, questionnaireData, setEegData } = useAssessment()
  const [file, setFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0])
      setUploadStatus('success')
      setErrorMessage('')
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/json': ['.json'],
    },
    maxFiles: 1,
    multiple: false,
  })

  const parseEEGFile = async (file: File): Promise<EEGData | null> => {
    return new Promise((resolve) => {
      const reader = new FileReader()
      
      reader.onload = (e) => {
        try {
          const text = e.target?.result as string
          let eegData: EEGData
          
          if (file.name.endsWith('.json')) {
            eegData = JSON.parse(text)
          } else if (file.name.endsWith('.csv')) {
            // Parse CSV (assuming first data row contains values)
            const lines = text.split('\n')
            const headers = lines[0].split(',').map(h => h.trim())
            const values = lines[1].split(',').map(v => parseFloat(v.trim()))
            
            eegData = {} as EEGData
            headers.forEach((header, index) => {
              eegData[header as keyof EEGData] = values[index]
            })
          } else {
            resolve(null)
            return
          }
          
          // Validate EEG data has all required channels
          const requiredChannels = [
            'Fp1', 'Fp2', 'F3', 'F4', 'C3', 'C4', 'P3', 'P4',
            'O1', 'O2', 'F7', 'F8', 'T7', 'T8', 'P7', 'P8',
            'Fz', 'Cz', 'Pz'
          ]
          
          const hasAllChannels = requiredChannels.every(
            channel => channel in eegData
          )
          
          if (hasAllChannels) {
            resolve(eegData)
          } else {
            resolve(null)
          }
        } catch (error) {
          resolve(null)
        }
      }
      
      reader.readAsText(file)
    })
  }

  const handleSubmit = async () => {
    if (!file) {
      setUploadStatus('error')
      setErrorMessage('Please upload an EEG data file')
      return
    }

    setIsProcessing(true)
    setErrorMessage('')

    try {
      const eegData = await parseEEGFile(file)
      
      if (!eegData) {
        throw new Error('Invalid EEG data format or missing required channels')
      }

      setEegData(eegData)

      // Prepare questionnaire answers array
      const questionAnswers = Array.from({ length: 30 }, (_, i) =>
        questionnaireData[i + 1] || 3
      )

      // Submit to backend (includes user_info for database storage)
      const result = await submitAssessment({
        eeg: eegData,
        questions: questionAnswers,
        medical_history: medicalHistory as any,
        user_info: {
          patientId: userInfo.patientId,
          age: userInfo.age,
          gender: userInfo.gender,
          education: userInfo.education,
          occupation: userInfo.occupation,
          referringPhysician: userInfo.referringPhysician,
        },
      })

      // Store result and navigate
      sessionStorage.setItem('assessmentResult', JSON.stringify(result))
      
      setTimeout(() => {
        navigate('/results')
      }, 1500)
    } catch (error: any) {
      setUploadStatus('error')
      setErrorMessage(
        error.message || 'Failed to process assessment. Please verify EEG data format.'
      )
      setIsProcessing(false)
    }
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
            <Zap className="w-6 h-6 text-medical-blue" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-medical-navy">
              EEG Data Upload
            </h2>
            <p className="text-sm text-medical-slate">
              Upload neurophysiological data for comprehensive analysis
            </p>
          </div>
        </div>

        {/* EEG Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start space-x-3">
            <FileText className="w-5 h-5 text-medical-blue flex-shrink-0 mt-0.5" />
            <div className="text-sm text-medical-dark-slate">
              <p className="font-medium mb-2">Required EEG Channel Configuration</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs font-mono bg-white p-3 rounded">
                {['Fp1', 'Fp2', 'F3', 'F4', 'C3', 'C4', 'P3', 'P4', 'O1', 'O2', 
                  'F7', 'F8', 'T7', 'T8', 'P7', 'P8', 'Fz', 'Cz', 'Pz'].map(channel => (
                  <span key={channel} className="text-medical-navy">{channel}</span>
                ))}
              </div>
              <p className="mt-3">
                Upload CSV or JSON file containing 19-channel EEG data following the
                10-20 international system. File should include numerical values for all
                specified channels.
              </p>
            </div>
          </div>
        </div>

        {/* File Upload Area */}
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all ${
            isDragActive
              ? 'border-medical-blue bg-medical-blue bg-opacity-5'
              : uploadStatus === 'success'
              ? 'border-green-500 bg-green-50'
              : uploadStatus === 'error'
              ? 'border-red-500 bg-red-50'
              : 'border-gray-300 hover:border-medical-blue hover:bg-gray-50'
          }`}
        >
          <input {...getInputProps()} />
          
          <div className="flex flex-col items-center space-y-4">
            {uploadStatus === 'success' ? (
              <CheckCircle className="w-16 h-16 text-green-500" />
            ) : uploadStatus === 'error' ? (
              <AlertCircle className="w-16 h-16 text-red-500" />
            ) : (
              <Upload className="w-16 h-16 text-medical-slate" />
            )}

            {file ? (
              <div className="space-y-2">
                <p className="text-lg font-semibold text-medical-navy">{file.name}</p>
                <p className="text-sm text-medical-slate">
                  {(file.size / 1024).toFixed(2)} KB
                </p>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    setFile(null)
                    setUploadStatus('idle')
                  }}
                  className="text-sm text-medical-blue hover:underline"
                >
                  Remove file
                </button>
              </div>
            ) : (
              <>
                <p className="text-lg font-semibold text-medical-navy">
                  {isDragActive
                    ? 'Drop EEG file here'
                    : 'Drag & drop EEG file or click to browse'}
                </p>
                <p className="text-sm text-medical-slate">
                  Supported formats: CSV, JSON (Max 10MB)
                </p>
              </>
            )}
          </div>
        </div>

        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4"
          >
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-red-900">Upload Error</p>
                <p className="text-sm text-red-700 mt-1">{errorMessage}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Sample Data Info */}
        <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <p className="text-sm font-medium text-medical-navy mb-2">
            EEG Data Acquisition Guidelines
          </p>
          <ul className="text-sm text-medical-slate space-y-1 list-disc list-inside">
            <li>Standard 10-20 electrode placement system</li>
            <li>Minimum 2-minute resting state recording recommended</li>
            <li>Sampling rate: 250-500 Hz preferred</li>
            <li>Pre-processed data with artifact removal recommended</li>
            <li>Reference: Linked mastoids or average reference</li>
          </ul>
        </div>

        {/* Navigation */}
        <div className="flex justify-between space-x-4 pt-6 mt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={() => navigate('/questionnaire')}
            className="btn-secondary flex items-center space-x-2"
            disabled={isProcessing}
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Back to Questionnaire</span>
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={!file || isProcessing}
            className="btn-primary flex items-center space-x-2"
          >
            {isProcessing ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                <span>Processing Assessment...</span>
              </>
            ) : (
              <>
                <span>Complete Assessment</span>
                <CheckCircle className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export default EEGUpload
