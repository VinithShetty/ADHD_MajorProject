import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, Area, AreaChart
} from 'recharts'
import { BarChart3, Loader, TrendingUp } from 'lucide-react'
import { getAssessments, AssessmentRecord } from '../services/api'

const RISK_COLORS: Record<string, string> = {
  high: '#ef4444',
  moderate: '#f59e0b',
  low: '#10b981',
}

const PREDICTION_COLORS: Record<string, string> = {
  ADHD: '#ef4444',
  Non_ADHD: '#10b981',
  Healthy: '#10b981',
  ODD: '#f59e0b',
  ASD: '#8b5cf6',
  Dyslexia: '#3b82f6',
}

const AssessmentCharts: React.FC = () => {
  const [assessments, setAssessments] = useState<AssessmentRecord[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAssessments()
        setAssessments(data.assessments)
      } catch {
        // silently fail — charts are supplementary
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader className="w-6 h-6 animate-spin text-medical-blue" />
        <span className="ml-2 text-medical-slate">Loading analytics...</span>
      </div>
    )
  }

  if (assessments.length === 0) {
    return (
      <div className="text-center py-8 text-medical-slate">
        <BarChart3 className="w-10 h-10 mx-auto mb-2 opacity-40" />
        <p className="text-sm">No assessment data available for charts yet.</p>
      </div>
    )
  }

  // === Data for Prediction Pie Chart ===
  const predictionCounts: Record<string, number> = {}
  assessments.forEach(a => {
    const p = a.prediction || 'Unknown'
    predictionCounts[p] = (predictionCounts[p] || 0) + 1
  })
  const pieData = Object.entries(predictionCounts).map(([name, value]) => ({ name, value }))

  // === Data for Risk Level Bar Chart ===
  const riskCounts: Record<string, number> = { high: 0, moderate: 0, low: 0 }
  assessments.forEach(a => {
    const r = a.risk_level || 'low'
    riskCounts[r] = (riskCounts[r] || 0) + 1
  })
  const barData = Object.entries(riskCounts).map(([name, count]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    count,
    fill: RISK_COLORS[name] || '#94a3b8',
  }))

  // === Data for Assessments Over Time (area chart) ===
  const dateCounts: Record<string, { total: number; adhd: number; nonAdhd: number }> = {}
  assessments.forEach(a => {
    const date = a.assessment_date ? a.assessment_date.split('T')[0] : 'Unknown'
    if (!dateCounts[date]) dateCounts[date] = { total: 0, adhd: 0, nonAdhd: 0 }
    dateCounts[date].total++
    if (a.prediction === 'ADHD') dateCounts[date].adhd++
    else dateCounts[date].nonAdhd++
  })
  const timeData = Object.entries(dateCounts)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-14) // last 14 days
    .map(([date, data]) => ({
      date: date.length > 5 ? date.slice(5) : date, // MM-DD
      Total: data.total,
      ADHD: data.adhd,
      'Non-ADHD': data.nonAdhd,
    }))

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center space-x-2 mb-2">
        <div className="bg-gradient-to-r from-indigo-500 to-cyan-500 p-2 rounded-lg">
          <TrendingUp className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-lg font-bold text-medical-navy">
          Assessment Analytics Dashboard
        </h3>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Prediction Distribution Pie */}
        <div className="bg-white rounded-xl shadow-clinical p-4 border border-gray-200">
          <h4 className="text-sm font-semibold text-medical-navy mb-3 text-center">
            Prediction Distribution
          </h4>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {pieData.map((entry, index) => (
                  <Cell key={index} fill={PREDICTION_COLORS[entry.name] || '#94a3b8'} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Risk Level Bar Chart */}
        <div className="bg-white rounded-xl shadow-clinical p-4 border border-gray-200">
          <h4 className="text-sm font-semibold text-medical-navy mb-3 text-center">
            Risk Level Distribution
          </h4>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {barData.map((entry, index) => (
                  <Cell key={index} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Assessments Over Time */}
      {timeData.length > 1 && (
        <div className="bg-white rounded-xl shadow-clinical p-4 border border-gray-200">
          <h4 className="text-sm font-semibold text-medical-navy mb-3 text-center">
            Assessments Over Time
          </h4>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={timeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="ADHD" stackId="1" stroke="#ef4444" fill="#fca5a5" />
              <Area type="monotone" dataKey="Non-ADHD" stackId="1" stroke="#10b981" fill="#6ee7b7" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Summary Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white rounded-lg p-3 border border-gray-200 text-center">
          <p className="text-2xl font-bold text-medical-blue">{assessments.length}</p>
          <p className="text-xs text-medical-slate">Total Assessments</p>
        </div>
        <div className="bg-white rounded-lg p-3 border border-gray-200 text-center">
          <p className="text-2xl font-bold text-red-500">{riskCounts.high}</p>
          <p className="text-xs text-medical-slate">High Risk</p>
        </div>
        <div className="bg-white rounded-lg p-3 border border-gray-200 text-center">
          <p className="text-2xl font-bold text-yellow-500">{riskCounts.moderate}</p>
          <p className="text-xs text-medical-slate">Moderate Risk</p>
        </div>
        <div className="bg-white rounded-lg p-3 border border-gray-200 text-center">
          <p className="text-2xl font-bold text-green-500">{riskCounts.low}</p>
          <p className="text-xs text-medical-slate">Low Risk</p>
        </div>
      </div>
    </motion.div>
  )
}

export default AssessmentCharts
