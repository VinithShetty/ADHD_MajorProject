import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Brain, ShieldCheck, LogOut, User, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'

const Header: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const isHomePage = location.pathname === '/'
  const { user, signOut } = useAuth()
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const handleSignOut = async () => {
    setDropdownOpen(false)
    await signOut()
    navigate('/login')
  }

  // Truncate email for display
  const displayEmail = user?.email
    ? user.email.length > 22
      ? user.email.slice(0, 20) + '…'
      : user.email
    : ''

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="bg-medical-navy text-white shadow-lg sticky top-0 z-50"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition">
            <Brain className="w-8 h-8" />
            <div>
              <h1 className="text-xl font-bold">ADHD Detection System</h1>
              <p className="text-xs text-medical-light-blue">
                Healthcare Professional Platform
              </p>
            </div>
          </Link>

          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-green-400" />
              <span className="text-sm hidden md:inline">HIPAA Compliant</span>
            </div>

            {!isHomePage && (
              <Link
                to="/"
                className="text-sm hover:text-medical-light-blue transition hidden sm:inline"
              >
                Exit Assessment
              </Link>
            )}

            {/* User dropdown */}
            {user && (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 bg-white/10 hover:bg-white/20 transition rounded-lg px-3 py-1.5 text-sm"
                >
                  <User className="w-4 h-4" />
                  <span className="hidden md:inline max-w-[140px] truncate">{displayEmail}</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-50"
                    >
                      <div className="px-4 py-3 border-b border-slate-100">
                        <p className="text-xs text-slate-400">Signed in as</p>
                        <p className="text-sm font-medium text-slate-700 truncate">{user.email}</p>
                      </div>
                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Click-outside overlay */}
                {dropdownOpen && (
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setDropdownOpen(false)}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  )
}

export default Header
