import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
})

// Request interceptor for adding authentication token if needed
apiClient.interceptors.request.use(
  (config) => {
    // Add any authentication headers here if needed
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for handling errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error('API Error:', error.response.data)
    } else if (error.request) {
      console.error('Network Error:', error.message)
    } else {
      console.error('Error:', error.message)
    }
    return Promise.reject(error)
  }
)

export interface EEGData {
  Fp1: number
  Fp2: number
  F3: number
  F4: number
  C3: number
  C4: number
  P3: number
  P4: number
  O1: number
  O2: number
  F7: number
  F8: number
  T7: number
  T8: number
  P7: number
  P8: number
  Fz: number
  Cz: number
  Pz: number
}

export interface MedicalHistory {
  family_adhd?: string
  family_learning_disorders?: string
  [key: string]: string | undefined
}

export interface PredictionRequest {
  eeg: EEGData
  questions: number[]
  medical_history?: MedicalHistory
  user_info?: {
    patientId: string
    age: string
    gender: string
    education: string
    occupation: string
    referringPhysician: string
  }
}

export interface PredictionResponse {
  prediction: string
  risk_level?: string
  confidence?: number
  confidence_scores?: Record<string, number>
  saved_to_database?: boolean
  error?: string
}

export interface AssessmentRecord {
  id: string
  patient_id: string
  age: string
  gender: string
  education: string
  occupation: string
  referring_physician: string
  medical_history: any
  questionnaire_responses: number[]
  eeg_data: EEGData
  prediction: string
  risk_level: string
  assessment_date: string
  created_at: string
}

export interface AssessmentsListResponse {
  assessments: AssessmentRecord[]
  count: number
}

export interface AssessmentStatsResponse {
  total_assessments: number
  predictions_breakdown: Record<string, number>
  risk_levels_breakdown: Record<string, number>
}

export const submitAssessment = async (
  data: PredictionRequest
): Promise<PredictionResponse> => {
  try {
    const response = await apiClient.post<PredictionResponse>('/predict', data)
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Failed to process assessment')
  }
}

export const getAssessments = async (): Promise<AssessmentsListResponse> => {
  try {
    const response = await apiClient.get<AssessmentsListResponse>('/assessments')
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Failed to fetch assessments')
  }
}

export const getPatientAssessments = async (
  patientId: string
): Promise<AssessmentsListResponse> => {
  try {
    const response = await apiClient.get<AssessmentsListResponse>(
      `/assessments/${patientId}`
    )
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Failed to fetch patient assessments')
  }
}

export const getAssessmentStats = async (): Promise<AssessmentStatsResponse> => {
  try {
    const response = await apiClient.get<AssessmentStatsResponse>('/assessments/stats')
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Failed to fetch assessment stats')
  }
}

export default apiClient
