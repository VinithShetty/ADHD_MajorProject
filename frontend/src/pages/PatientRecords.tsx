import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Users,
  Search,
  ChevronLeft,
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle,
  FileText,
  Calendar,
  BarChart3,
  Loader,
  RefreshCw,
} from 'lucide-react'
import { getAssessments, getAssessmentStats, AssessmentRecord, AssessmentStatsResponse } from '../services/api'

const PatientRecords: React.FC = () => {
  const navigate = useNavigate()
  const [assessments, setAssessments] = useState<AssessmentRecord[]>([])
  const [stats, setStats] = useState<AssessmentStatsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterPrediction, setFilterPrediction] = useState<string>('all')
  const [error, setError] = useState('')

  const fetchData = async () => {
    setLoading(true)
    setError('')
    try {
      const [assessmentData, statsData] = await Promise.all([
        getAssessments(),
        getAssessmentStats(),
      ])
      setAssessments(assessmentData.assessments)
      setStats(statsData)
    } catch (err: any) {
      setError(err.message || 'Failed to fetch data from database')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const filteredAssessments = assessments.filter((a) => {
    const matchesSearch =
      a.patient_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (a.gender && a.gender.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesFilter =
      filterPrediction === 'all' || a.prediction === filterPrediction
    return matchesSearch && matchesFilter
  })

  const getRiskIcon = (riskLevel: string) => {
    switch (riskLevel) {
      case 'high':
        return <XCircle className="w-5 h-5 text-red-500" />
      case 'moderate':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />
      case 'low':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      default:
        return <Activity className="w-5 h-5 text-gray-400" />
    }
  }

  const getRiskBadge = (riskLevel: string) => {
    const colors: Record<string, string> = {
      high: 'bg-red-100 text-red-700 border-red-200',
      moderate: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      low: 'bg-green-100 text-green-700 border-green-200',
    }
    return colors[riskLevel] || 'bg-gray-100 text-gray-700 border-gray-200'
  }

  const getPredictionBadge = (prediction: string) => {
    const colors: Record<string, string> = {
      ADHD: 'bg-red-50 text-red-700 border-red-200',
      ODD: 'bg-orange-50 text-orange-700 border-orange-200',
      ASD: 'bg-purple-50 text-purple-700 border-purple-200',
      Dyslexia: 'bg-blue-50 text-blue-700 border-blue-200',
      Healthy: 'bg-green-50 text-green-700 border-green-200',
    }
    return colors[prediction] || 'bg-gray-50 text-gray-700 border-gray-200'
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-7xl mx-auto space-y-6"
    >
      {/* Header */}
      <div className="card">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-medical-blue bg-opacity-10 p-3 rounded-lg">
              <Users className="w-6 h-6 text-medical-blue" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-medical-navy">
                Patient Assessment Records
              </h1>
              <p className="text-sm text-medical-slate">
                View all completed assessments stored in the database
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={fetchData}
              className="btn-secondary flex items-center space-x-2 text-sm"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
            <button
              onClick={() => navigate('/')}
              className="btn-secondary flex items-center space-x-2 text-sm"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </button>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200"
          >
            <div className="flex items-center space-x-3">
              <BarChart3 className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-sm text-blue-600 font-medium">Total Assessments</p>
                <p className="text-3xl font-bold text-blue-800">
                  {stats.total_assessments}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card bg-gradient-to-br from-red-50 to-red-100 border border-red-200"
          >
            <div className="flex items-center space-x-3">
              <XCircle className="w-8 h-8 text-red-600" />
              <div>
                <p className="text-sm text-red-600 font-medium">High Risk</p>
                <p className="text-3xl font-bold text-red-800">
                  {stats.risk_levels_breakdown?.high || 0}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200"
          >
            <div className="flex items-center space-x-3">
              <AlertTriangle className="w-8 h-8 text-yellow-600" />
              <div>
                <p className="text-sm text-yellow-600 font-medium">Moderate Risk</p>
                <p className="text-3xl font-bold text-yellow-800">
                  {stats.risk_levels_breakdown?.moderate || 0}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="card bg-gradient-to-br from-green-50 to-green-100 border border-green-200"
          >
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-sm text-green-600 font-medium">Low Risk</p>
                <p className="text-3xl font-bold text-green-800">
                  {stats.risk_levels_breakdown?.low || 0}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="card">
        <div className="flex flex-col md:flex-row items-center space-y-3 md:space-y-0 md:space-x-4">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by Patient ID or Gender..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-blue focus:border-medical-blue outline-none text-sm"
            />
          </div>
          <select
            value={filterPrediction}
            onChange={(e) => setFilterPrediction(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-blue focus:border-medical-blue outline-none text-sm bg-white"
          >
            <option value="all">All Predictions</option>
            <option value="ADHD">ADHD</option>
            <option value="ODD">ODD</option>
            <option value="ASD">ASD</option>
            <option value="Dyslexia">Dyslexia</option>
            <option value="Healthy">Healthy</option>
          </select>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="card bg-red-50 border-2 border-red-200">
          <div className="flex items-center space-x-3">
            <XCircle className="w-6 h-6 text-red-500" />
            <div>
              <p className="font-medium text-red-800">Error Loading Records</p>
              <p className="text-sm text-red-600">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="card text-center py-12">
          <Loader className="w-8 h-8 text-medical-blue animate-spin mx-auto mb-4" />
          <p className="text-medical-slate">Loading patient records from database...</p>
        </div>
      )}

      {/* Assessment Table */}
      {!loading && !error && (
        <div className="card overflow-hidden p-0">
          {filteredAssessments.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-medical-slate font-medium">No assessment records found</p>
              <p className="text-sm text-gray-400 mt-1">
                {searchTerm || filterPrediction !== 'all'
                  ? 'Try adjusting your search filters'
                  : 'Complete an assessment to see records here'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left px-6 py-4 font-semibold text-medical-navy">
                      #
                    </th>
                    <th className="text-left px-6 py-4 font-semibold text-medical-navy">
                      Patient ID
                    </th>
                    <th className="text-left px-6 py-4 font-semibold text-medical-navy">
                      Age
                    </th>
                    <th className="text-left px-6 py-4 font-semibold text-medical-navy">
                      Gender
                    </th>
                    <th className="text-left px-6 py-4 font-semibold text-medical-navy">
                      Education
                    </th>
                    <th className="text-left px-6 py-4 font-semibold text-medical-navy">
                      Prediction
                    </th>
                    <th className="text-left px-6 py-4 font-semibold text-medical-navy">
                      Risk Level
                    </th>
                    <th className="text-left px-6 py-4 font-semibold text-medical-navy">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAssessments.map((assessment, index) => (
                    <motion.tr
                      key={assessment.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-gray-100 hover:bg-blue-50 transition-colors"
                    >
                      <td className="px-6 py-4 text-gray-500">{index + 1}</td>
                      <td className="px-6 py-4">
                        <span className="font-medium text-medical-navy">
                          {assessment.patient_id}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-medical-dark-slate">
                        {assessment.age || '-'}
                      </td>
                      <td className="px-6 py-4 text-medical-dark-slate">
                        {assessment.gender || '-'}
                      </td>
                      <td className="px-6 py-4 text-medical-dark-slate">
                        {assessment.education || '-'}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${getPredictionBadge(
                            assessment.prediction
                          )}`}
                        >
                          {assessment.prediction}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          {getRiskIcon(assessment.risk_level)}
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${getRiskBadge(
                              assessment.risk_level
                            )}`}
                          >
                            {assessment.risk_level
                              ? assessment.risk_level.charAt(0).toUpperCase() +
                                assessment.risk_level.slice(1)
                              : '-'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-1 text-medical-slate">
                          <Calendar className="w-3.5 h-3.5" />
                          <span className="text-xs">
                            {formatDate(assessment.assessment_date)}
                          </span>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Results Summary */}
      {!loading && filteredAssessments.length > 0 && (
        <div className="text-center text-sm text-medical-slate">
          Showing {filteredAssessments.length} of {assessments.length} records
        </div>
      )}
    </motion.div>
  )
}

export default PatientRecords
