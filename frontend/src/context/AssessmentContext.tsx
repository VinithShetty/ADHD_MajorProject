import React, { createContext, useContext, useState, ReactNode } from 'react'
import { EEGData, MedicalHistory } from '../services/api'

interface UserInformation {
  patientId: string
  age: string
  gender: string
  education: string
  occupation: string
  referringPhysician: string
}

interface QuestionnaireData {
  [key: string]: number
}

interface AssessmentContextType {
  userInfo: UserInformation
  setUserInfo: (info: UserInformation) => void
  medicalHistory: MedicalHistory
  setMedicalHistory: (history: MedicalHistory) => void
  questionnaireData: QuestionnaireData
  setQuestionnaireData: (data: QuestionnaireData) => void
  eegData: EEGData | null
  setEegData: (data: EEGData | null) => void
  currentStep: number
  setCurrentStep: (step: number) => void
  resetAssessment: () => void
}

const AssessmentContext = createContext<AssessmentContextType | undefined>(undefined)

export const useAssessment = () => {
  const context = useContext(AssessmentContext)
  if (!context) {
    throw new Error('useAssessment must be used within AssessmentProvider')
  }
  return context
}

interface AssessmentProviderProps {
  children: ReactNode
}

export const AssessmentProvider: React.FC<AssessmentProviderProps> = ({ children }) => {
  const [userInfo, setUserInfo] = useState<UserInformation>({
    patientId: '',
    age: '',
    gender: '',
    education: '',
    occupation: '',
    referringPhysician: '',
  })

  const [medicalHistory, setMedicalHistory] = useState<MedicalHistory>({})
  const [questionnaireData, setQuestionnaireData] = useState<QuestionnaireData>({})
  const [eegData, setEegData] = useState<EEGData | null>(null)
  const [currentStep, setCurrentStep] = useState(0)

  const resetAssessment = () => {
    setUserInfo({
      patientId: '',
      age: '',
      gender: '',
      education: '',
      occupation: '',
      referringPhysician: '',
    })
    setMedicalHistory({})
    setQuestionnaireData({})
    setEegData(null)
    setCurrentStep(0)
  }

  return (
    <AssessmentContext.Provider
      value={{
        userInfo,
        setUserInfo,
        medicalHistory,
        setMedicalHistory,
        questionnaireData,
        setQuestionnaireData,
        eegData,
        setEegData,
        currentStep,
        setCurrentStep,
        resetAssessment,
      }}
    >
      {children}
    </AssessmentContext.Provider>
  )
}
