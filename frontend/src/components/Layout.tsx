import React, { ReactNode } from 'react'
import Header from './Header'
import ProgressIndicator from './ProgressIndicator'
import { useLocation } from 'react-router-dom'

interface LayoutProps {
  children: ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation()
  const showProgress = location.pathname !== '/' && location.pathname !== '/results'

  return (
    <div className="min-h-screen bg-gradient-to-br from-medical-clinical via-blue-50 to-medical-clinical">
      <Header />
      {showProgress && <ProgressIndicator />}
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {children}
      </main>
      <footer className="bg-medical-navy text-white py-6 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">
            © 2025 ADHD Detection System | Healthcare Professional Platform
          </p>
          <p className="text-xs mt-2 text-gray-300">
            HIPAA Compliant | End-to-End Encrypted | For Healthcare Professional Use Only
          </p>
        </div>
      </footer>
    </div>
  )
}

export default Layout
