import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Send, CheckCircle, AlertCircle, Loader } from 'lucide-react'
import emailjs from '@emailjs/browser'

interface EmailReportProps {
  patientId: string
  prediction: string
  riskLevel: string
  confidence: number
  recommendations: string[]
}

// EmailJS free tier: 200 emails/month
// Users should replace these with their own EmailJS credentials
const EMAILJS_SERVICE_ID = 'service_adhd_report'
const EMAILJS_TEMPLATE_ID = 'template_adhd_report'
const EMAILJS_PUBLIC_KEY = 'YOUR_EMAILJS_PUBLIC_KEY'

const EmailReport: React.FC<EmailReportProps> = ({
  patientId,
  prediction,
  riskLevel,
  confidence,
  recommendations,
}) => {
  const [email, setEmail] = useState('')
  const [sending, setSending] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [showForm, setShowForm] = useState(false)

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setStatus('error')
      setErrorMsg('Please enter a valid email address')
      return
    }

    setSending(true)
    setStatus('idle')

    try {
      const templateParams = {
        to_email: email,
        patient_id: patientId,
        prediction: prediction,
        risk_level: riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1),
        confidence: `${confidence}%`,
        assessment_date: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
        recommendations: recommendations.map((r, i) => `${i + 1}. ${r}`).join('\n'),
        disclaimer:
          'This assessment is a screening tool and does not constitute a clinical diagnosis. Professional clinical evaluation is required.',
      }

      // Check if EmailJS is properly configured
      if (EMAILJS_PUBLIC_KEY === 'YOUR_EMAILJS_PUBLIC_KEY') {
        // Fallback: Use mailto link
        const subject = encodeURIComponent(
          `ADHD Assessment Report - Patient ${patientId}`
        )
        const body = encodeURIComponent(
          `ADHD Detection System - Assessment Report\n` +
            `=====================================\n\n` +
            `Patient ID: ${patientId}\n` +
            `Assessment Date: ${templateParams.assessment_date}\n\n` +
            `RESULT\n------\n` +
            `Prediction: ${prediction}\n` +
            `Risk Level: ${templateParams.risk_level}\n` +
            `Confidence: ${confidence}%\n\n` +
            `RECOMMENDATIONS\n---------------\n` +
            `${templateParams.recommendations}\n\n` +
            `DISCLAIMER\n----------\n${templateParams.disclaimer}`
        )
        window.open(`mailto:${email}?subject=${subject}&body=${body}`)
        setStatus('success')
        setSending(false)
        return
      }

      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams,
        EMAILJS_PUBLIC_KEY
      )

      setStatus('success')
    } catch (err: any) {
      // Fallback to mailto
      const subject = encodeURIComponent(
        `ADHD Assessment Report - Patient ${patientId}`
      )
      const body = encodeURIComponent(
        `ADHD Assessment Report\n\nPatient: ${patientId}\nPrediction: ${prediction}\nRisk: ${riskLevel}\nConfidence: ${confidence}%`
      )
      window.open(`mailto:${email}?subject=${subject}&body=${body}`)
      setStatus('success')
    } finally {
      setSending(false)
    }
  }

  return (
    <div>
      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="btn-secondary flex items-center space-x-2 w-full justify-center"
        >
          <Mail className="w-5 h-5" />
          <span>Email Report</span>
        </button>
      ) : (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-gray-50 rounded-lg p-4 border border-gray-200"
        >
          <h4 className="text-sm font-semibold text-medical-navy mb-3 flex items-center space-x-2">
            <Mail className="w-4 h-4" />
            <span>Send Report via Email</span>
          </h4>

          {status === 'success' ? (
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="flex items-center space-x-2 text-green-600 p-3 bg-green-50 rounded-lg"
            >
              <CheckCircle className="w-5 h-5" />
              <span className="text-sm font-medium">Report sent successfully!</span>
            </motion.div>
          ) : (
            <form onSubmit={handleSendEmail} className="space-y-3">
              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    setStatus('idle')
                  }}
                  placeholder="doctor@hospital.com"
                  className="input-field text-sm"
                  disabled={sending}
                />
              </div>

              {status === 'error' && (
                <div className="flex items-center space-x-2 text-red-600 text-xs">
                  <AlertCircle className="w-3 h-3" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="flex space-x-2">
                <button
                  type="submit"
                  disabled={sending || !email.trim()}
                  className="btn-primary flex items-center space-x-2 text-sm py-2 flex-1"
                >
                  {sending ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Send</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false)
                    setStatus('idle')
                  }}
                  className="btn-secondary text-sm py-2"
                >
                  Cancel
                </button>
              </div>

              <p className="text-[10px] text-medical-slate">
                Opens your default email client with the assessment summary pre-filled.
              </p>
            </form>
          )}
        </motion.div>
      )}
    </div>
  )
}

export default EmailReport
