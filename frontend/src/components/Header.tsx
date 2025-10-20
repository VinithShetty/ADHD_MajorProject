import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Brain, ShieldCheck } from 'lucide-react'
import { motion } from 'framer-motion'

const Header: React.FC = () => {
  const location = useLocation()
  const isHomePage = location.pathname === '/'

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
              <span className="text-sm">HIPAA Compliant</span>
            </div>
            
            {!isHomePage && (
              <Link
                to="/"
                className="text-sm hover:text-medical-light-blue transition"
              >
                Exit Assessment
              </Link>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  )
}

export default Header
