import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Brain, Mail, Lock, Eye, EyeOff, UserPlus, LogIn, AlertCircle, CheckCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

type Tab = 'login' | 'register'

const AuthPage: React.FC = () => {
  const navigate = useNavigate()
  const { signIn, signUp } = useAuth()

  const [tab, setTab] = useState<Tab>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const resetForm = () => {
    setEmail('')
    setPassword('')
    setConfirmPassword('')
    setError(null)
    setSuccessMessage(null)
    setShowPassword(false)
    setShowConfirmPassword(false)
  }

  const switchTab = (newTab: Tab) => {
    setTab(newTab)
    resetForm()
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!email || !password) {
      setError('Please fill in all fields.')
      return
    }
    setLoading(true)
    const { error } = await signIn(email, password)
    setLoading(false)
    if (error) {
      setError(error.message)
    } else {
      navigate('/')
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!email || !password || !confirmPassword) {
      setError('Please fill in all fields.')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    setLoading(true)
    const { error } = await signUp(email, password)
    setLoading(false)
    if (error) {
      setError(error.message)
    } else {
      setSuccessMessage(
        'Account created! Please check your email to confirm your account, then log in.'
      )
      resetForm()
      setTab('login')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-medical-navy rounded-2xl shadow-lg mb-4">
            <Brain className="w-9 h-9 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-medical-navy">ADHD Detection System</h1>
          <p className="text-slate-500 text-sm mt-1">Healthcare Professional Platform</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-slate-100">
            <button
              onClick={() => switchTab('login')}
              className={`flex-1 py-4 text-sm font-semibold transition-colors ${
                tab === 'login'
                  ? 'text-medical-navy border-b-2 border-medical-navy bg-blue-50/40'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <LogIn className="inline w-4 h-4 mr-1.5 -mt-0.5" />
              Log In
            </button>
            <button
              onClick={() => switchTab('register')}
              className={`flex-1 py-4 text-sm font-semibold transition-colors ${
                tab === 'register'
                  ? 'text-medical-navy border-b-2 border-medical-navy bg-blue-50/40'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <UserPlus className="inline w-4 h-4 mr-1.5 -mt-0.5" />
              Create Account
            </button>
          </div>

          <div className="p-8">
            {/* Success banner */}
            <AnimatePresence>
              {successMessage && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-start gap-2 bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-3 mb-5 text-sm"
                >
                  <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{successMessage}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Error banner */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-3 mb-5 text-sm"
                >
                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* LOGIN FORM */}
            <AnimatePresence mode="wait">
              {tab === 'login' && (
                <motion.form
                  key="login"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                  onSubmit={handleLogin}
                  className="space-y-5"
                >
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-medical-navy/30 focus:border-medical-navy text-sm transition"
                        autoComplete="email"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-medical-navy/30 focus:border-medical-navy text-sm transition"
                        autoComplete="current-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-medical-navy text-white py-2.5 rounded-lg font-semibold text-sm hover:bg-opacity-90 active:scale-[0.98] transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                    ) : (
                      <LogIn className="w-4 h-4" />
                    )}
                    {loading ? 'Logging in…' : 'Log In'}
                  </button>

                  <p className="text-center text-xs text-slate-400">
                    Don't have an account?{' '}
                    <button
                      type="button"
                      onClick={() => switchTab('register')}
                      className="text-medical-navy font-medium hover:underline"
                    >
                      Create one
                    </button>
                  </p>
                </motion.form>
              )}

              {/* REGISTER FORM */}
              {tab === 'register' && (
                <motion.form
                  key="register"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  onSubmit={handleRegister}
                  className="space-y-5"
                >
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-medical-navy/30 focus:border-medical-navy text-sm transition"
                        autoComplete="email"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Password
                      <span className="text-slate-400 font-normal ml-1">(min. 6 characters)</span>
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-medical-navy/30 focus:border-medical-navy text-sm transition"
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-medical-navy/30 focus:border-medical-navy text-sm transition"
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-medical-navy text-white py-2.5 rounded-lg font-semibold text-sm hover:bg-opacity-90 active:scale-[0.98] transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                    ) : (
                      <UserPlus className="w-4 h-4" />
                    )}
                    {loading ? 'Creating Account…' : 'Create Account'}
                  </button>

                  <p className="text-center text-xs text-slate-400">
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => switchTab('login')}
                      className="text-medical-navy font-medium hover:underline"
                    >
                      Log in
                    </button>
                  </p>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">
          This platform is intended for healthcare professionals only.
          <br />All data is processed in accordance with HIPAA guidelines.
        </p>
      </motion.div>
    </div>
  )
}

export default AuthPage
