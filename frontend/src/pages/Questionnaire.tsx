import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, ChevronLeft, ClipboardList, Info, HelpCircle } from 'lucide-react'
import { useAssessment } from '../context/AssessmentContext'

const questions = [
  {
    id: 1,
    category: 'Attention & Focus',
    text: 'Do you often have trouble paying attention to details or make careless mistakes?',
    tooltip: 'Consider errors in work, school assignments, or other activities that require sustained attention.',
  },
  {
    id: 2,
    category: 'Attention & Focus',
    text: 'Do you often find it hard to stay focused on tasks or activities?',
    tooltip: 'Difficulty maintaining focus during lectures, conversations, or lengthy reading.',
  },
  {
    id: 3,
    category: 'Attention & Focus',
    text: 'Do you often avoid tasks that require sustained mental effort?',
    tooltip: 'Procrastination or avoidance of tasks requiring prolonged cognitive engagement.',
  },
  {
    id: 4,
    category: 'Organization',
    text: 'Do you frequently lose things needed for tasks (e.g., keys, notes)?',
    tooltip: 'Frequent misplacement of essential items like wallets, phones, documents.',
  },
  {
    id: 5,
    category: 'Attention & Focus',
    text: 'Are you easily distracted by external stimuli?',
    tooltip: 'External sounds, movements, or unrelated thoughts frequently break concentration.',
  },
  {
    id: 6,
    category: 'Hyperactivity',
    text: 'Do you often feel restless or fidgety?',
    tooltip: 'Physical restlessness, difficulty sitting still, need to move around.',
  },
  {
    id: 7,
    category: 'Hyperactivity',
    text: 'Do you have difficulty staying seated when expected?',
    tooltip: 'Leaving seat in situations where remaining seated is expected (meetings, classes).',
  },
  {
    id: 8,
    category: 'Hyperactivity',
    text: 'Do you often feel driven by a motor or always on the go?',
    tooltip: 'Feeling internally driven to be constantly active or productive.',
  },
  {
    id: 9,
    category: 'Impulsivity',
    text: 'Do you talk excessively or interrupt others?',
    tooltip: 'Difficulty controlling speech, frequently interrupting or finishing others\' sentences.',
  },
  {
    id: 10,
    category: 'Impulsivity',
    text: 'Do you struggle to wait for your turn in activities?',
    tooltip: 'Impatience in queues, during conversations, or in turn-taking situations.',
  },
  {
    id: 11,
    category: 'Organization',
    text: 'Do you often have difficulty organizing tasks or activities?',
    tooltip: 'Challenges with planning, sequencing, and organizing work or personal tasks.',
  },
  {
    id: 12,
    category: 'Impulsivity',
    text: 'Do you frequently start tasks without reading instructions?',
    tooltip: 'Acting impulsively without proper preparation or understanding requirements.',
  },
  {
    id: 13,
    category: 'Attention & Focus',
    text: 'Do you lose focus during conversations?',
    tooltip: 'Mind wandering or difficulty maintaining attention during verbal exchanges.',
  },
  {
    id: 14,
    category: 'Memory & Organization',
    text: 'Do you forget daily activities or appointments?',
    tooltip: 'Frequent forgetfulness affecting daily responsibilities and commitments.',
  },
  {
    id: 15,
    category: 'Attention & Focus',
    text: 'Do you often feel mentally overactive or distracted?',
    tooltip: 'Racing thoughts or constant mental activity that interferes with focus.',
  },
  {
    id: 16,
    category: 'Hyperactivity',
    text: 'Do you have trouble relaxing quietly?',
    tooltip: 'Difficulty engaging in quiet leisure activities or feeling uncomfortable being still.',
  },
  {
    id: 17,
    category: 'Impulsivity',
    text: 'Do you act before thinking about consequences?',
    tooltip: 'Impulsive decision-making without considering potential outcomes or risks.',
  },
  {
    id: 18,
    category: 'Attention & Focus',
    text: 'Do you find it hard to listen when others are talking?',
    tooltip: 'Difficulty maintaining attention during conversations or appearing not to listen.',
  },
  {
    id: 19,
    category: 'Task Completion',
    text: 'Do you have difficulty finishing tasks?',
    tooltip: 'Starting multiple tasks but struggling to complete them to conclusion.',
  },
  {
    id: 20,
    category: 'Task Completion',
    text: 'Do you struggle to follow through on instructions?',
    tooltip: 'Difficulty completing multi-step instructions or following through on commitments.',
  },
  {
    id: 21,
    category: 'Organization',
    text: 'Do you often misplace school/work materials?',
    tooltip: 'Frequently losing or misplacing important work-related items or documents.',
  },
  {
    id: 22,
    category: 'Impulsivity',
    text: 'Do you find yourself blurting out answers before questions are completed?',
    tooltip: 'Difficulty waiting to respond, interrupting others with premature answers.',
  },
  {
    id: 23,
    category: 'Attention & Focus',
    text: 'Do you have difficulty maintaining focus on boring tasks?',
    tooltip: 'Particular struggle with sustaining attention on repetitive or uninteresting activities.',
  },
  {
    id: 24,
    category: 'Impulsivity',
    text: 'Do you often make impulsive decisions?',
    tooltip: 'Making quick decisions without adequate thought or consideration of alternatives.',
  },
  {
    id: 25,
    category: 'Time Management',
    text: 'Do you struggle to manage time effectively?',
    tooltip: 'Difficulty estimating time, meeting deadlines, or managing schedule efficiently.',
  },
  {
    id: 26,
    category: 'Emotional Regulation',
    text: 'Do you feel emotionally impulsive or frustrated easily?',
    tooltip: 'Quick emotional reactions, low frustration tolerance, or difficulty controlling emotions.',
  },
  {
    id: 27,
    category: 'Task Completion',
    text: 'Do you often switch between tasks without completing them?',
    tooltip: 'Tendency to jump from one activity to another without finishing the first.',
  },
  {
    id: 28,
    category: 'Time Management',
    text: 'Do you procrastinate frequently?',
    tooltip: 'Chronic delay of tasks, especially those requiring sustained effort or planning.',
  },
  {
    id: 29,
    category: 'Organization',
    text: 'Do you have difficulty prioritizing tasks?',
    tooltip: 'Challenges determining which tasks are most important or urgent.',
  },
  {
    id: 30,
    category: 'Attention & Focus',
    text: 'Do you feel that your mind frequently wanders?',
    tooltip: 'Difficulty maintaining mental focus, with thoughts drifting to unrelated topics.',
  },
]

const Questionnaire: React.FC = () => {
  const navigate = useNavigate()
  const { questionnaireData, setQuestionnaireData, setCurrentStep } = useAssessment()
  const [answers, setAnswers] = useState<{ [key: number]: number }>(questionnaireData)
  const [showTooltip, setShowTooltip] = useState<number | null>(null)
  const [currentPage, setCurrentPage] = useState(0)
  const questionsPerPage = 5
  
  const totalPages = Math.ceil(questions.length / questionsPerPage)
  const currentQuestions = questions.slice(
    currentPage * questionsPerPage,
    (currentPage + 1) * questionsPerPage
  )

  const handleAnswer = (questionId: number, value: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))
  }

  const getAnsweredCount = () => {
    return Object.keys(answers).length
  }

  const isPageComplete = () => {
    return currentQuestions.every((q) => answers[q.id] !== undefined)
  }

  const handleContinue = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage((prev) => prev + 1)
    } else {
      // All questions answered
      setQuestionnaireData(answers)
      setCurrentStep(3)
      navigate('/eeg-upload')
    }
  }

  const scaleLabels = [
    { value: 1, label: 'Never', color: 'text-green-600' },
    { value: 2, label: 'Rarely', color: 'text-green-500' },
    { value: 3, label: 'Sometimes', color: 'text-yellow-500' },
    { value: 4, label: 'Often', color: 'text-orange-500' },
    { value: 5, label: 'Very Often', color: 'text-red-500' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto"
    >
      <div className="card">
        <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="bg-medical-blue bg-opacity-10 p-3 rounded-lg">
              <ClipboardList className="w-6 h-6 text-medical-blue" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-medical-navy">
                Clinical Assessment Questionnaire
              </h2>
              <p className="text-sm text-medical-slate">
                Evidence-based screening tool for neurodevelopmental disorders
              </p>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-2xl font-bold text-medical-blue">
              {getAnsweredCount()}/{questions.length}
            </div>
            <div className="text-xs text-medical-slate">Questions Completed</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-xs text-medical-slate mb-2">
            <span>Progress</span>
            <span>{Math.round((getAnsweredCount() / questions.length) * 100)}%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{
                width: `${(getAnsweredCount() / questions.length) * 100}%`,
              }}
              className="h-full bg-gradient-to-r from-medical-blue to-medical-light-blue"
            />
          </div>
        </div>

        {/* Page Indicator */}
        <div className="flex justify-center space-x-2 mb-6">
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentPage
                  ? 'bg-medical-blue w-8'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start space-x-3">
            <Info className="w-5 h-5 text-medical-blue flex-shrink-0 mt-0.5" />
            <div className="text-sm text-medical-dark-slate">
              <p className="font-medium mb-1">Assessment Instructions</p>
              <p>
                Rate each statement based on frequency of occurrence over the past 6
                months. Use the 5-point scale where 1 = Never and 5 = Very Often. Hover
                over the help icon for clinical context for each question.
              </p>
            </div>
          </div>
        </div>

        {/* Questions */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            {currentQuestions.map((question) => (
              <div
                key={question.id}
                className="p-6 border-2 border-gray-200 rounded-lg hover:border-medical-light-blue transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-start space-x-3">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-medical-blue bg-opacity-10 text-medical-blue font-bold text-sm flex-shrink-0">
                        {question.id}
                      </span>
                      <div className="flex-1">
                        <div className="inline-block px-2 py-1 bg-gray-100 rounded text-xs font-medium text-medical-slate mb-2">
                          {question.category}
                        </div>
                        <p className="text-medical-navy font-medium">
                          {question.text}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    type="button"
                    className="relative ml-2"
                    onMouseEnter={() => setShowTooltip(question.id)}
                    onMouseLeave={() => setShowTooltip(null)}
                  >
                    <HelpCircle className="w-5 h-5 text-medical-slate hover:text-medical-blue transition-colors" />
                    {showTooltip === question.id && (
                      <div className="absolute right-0 top-6 w-64 bg-medical-navy text-white text-xs p-3 rounded-lg shadow-lg z-10">
                        {question.tooltip}
                        <div className="absolute top-[-6px] right-4 w-3 h-3 bg-medical-navy transform rotate-45" />
                      </div>
                    )}
                  </button>
                </div>

                <div className="grid grid-cols-5 gap-2">
                  {scaleLabels.map((scale) => (
                    <button
                      key={scale.value}
                      type="button"
                      onClick={() => handleAnswer(question.id, scale.value)}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        answers[question.id] === scale.value
                          ? 'border-medical-blue bg-medical-blue text-white shadow-md transform scale-105'
                          : 'border-gray-200 hover:border-medical-light-blue bg-white'
                      }`}
                    >
                      <div className="text-center">
                        <div className="text-2xl font-bold mb-1">{scale.value}</div>
                        <div
                          className={`text-xs font-medium ${
                            answers[question.id] === scale.value
                              ? 'text-white'
                              : scale.color
                          }`}
                        >
                          {scale.label}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between items-center space-x-4 pt-8 mt-8 border-t border-gray-200">
          <button
            type="button"
            onClick={() => {
              if (currentPage > 0) {
                setCurrentPage((prev) => prev - 1)
              } else {
                navigate('/medical-history')
              }
            }}
            className="btn-secondary flex items-center space-x-2"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>{currentPage === 0 ? 'Back to Medical History' : 'Previous'}</span>
          </button>

          <div className="text-sm text-medical-slate">
            Page {currentPage + 1} of {totalPages}
          </div>

          <button
            type="button"
            onClick={handleContinue}
            disabled={!isPageComplete()}
            className="btn-primary flex items-center space-x-2"
          >
            <span>
              {currentPage < totalPages - 1 ? 'Next Page' : 'Continue to EEG Upload'}
            </span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export default Questionnaire
