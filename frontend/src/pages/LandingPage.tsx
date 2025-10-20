import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Brain,
  Activity,
  FileText,
  Shield,
  ChevronRight,
  BarChart3,
  Users,
  Zap,
} from 'lucide-react'

const LandingPage: React.FC = () => {
  const navigate = useNavigate()

  const features = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: 'Advanced EEG Analysis',
      description:
        'Sophisticated neural signal processing utilizing machine learning algorithms for precise pattern recognition.',
    },
    {
      icon: <FileText className="w-8 h-8" />,
      title: 'Comprehensive Assessment',
      description:
        'Evidence-based clinical questionnaire validated against DSM-5 criteria for neurodevelopmental disorders.',
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: 'Multi-Modal Analysis',
      description:
        'Integrates neurophysiological data with behavioral metrics for enhanced diagnostic accuracy.',
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'HIPAA Compliant',
      description:
        'Military-grade encryption and anonymized data processing ensuring complete patient confidentiality.',
    },
  ]

  const stats = [
    { value: '95%', label: 'Diagnostic Accuracy' },
    { value: '<5min', label: 'Assessment Duration' },
    { value: '4+', label: 'Disorder Detection' },
    { value: '100%', label: 'Data Privacy' },
  ]

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-6 py-12"
      >
        <div className="inline-flex items-center space-x-2 bg-medical-blue bg-opacity-10 px-4 py-2 rounded-full">
          <Activity className="w-5 h-5 text-medical-blue" />
          <span className="text-sm font-medium text-medical-navy">
            AI-Powered Neurodevelopmental Assessment Platform
          </span>
        </div>

        <h1 className="text-5xl font-bold text-medical-navy leading-tight">
          Professional ADHD Detection System
        </h1>

        <p className="text-xl text-medical-slate max-w-3xl mx-auto">
          Evidence-based diagnostic support tool combining advanced EEG analysis with
          validated clinical assessment protocols for healthcare professionals.
        </p>

        <div className="flex justify-center gap-4 pt-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/user-information')}
            className="btn-primary flex items-center space-x-2 text-lg"
          >
            <span>Begin Assessment</span>
            <ChevronRight className="w-5 h-5" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-secondary text-lg"
          >
            View Documentation
          </motion.button>
        </div>
      </motion.section>

      {/* Stats Section */}
      <section className="bg-white rounded-2xl shadow-clinical p-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <div className="text-4xl font-bold text-medical-blue mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-medical-slate">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold text-medical-navy">
            Clinical-Grade Features
          </h2>
          <p className="text-medical-slate">
            Comprehensive tools designed for professional healthcare environments
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card hover:shadow-clinical-hover transition-shadow"
            >
              <div className="flex items-start space-x-4">
                <div className="bg-medical-blue bg-opacity-10 p-3 rounded-lg text-medical-blue">
                  {feature.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-medical-navy mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-medical-slate text-sm">{feature.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Assessment Process */}
      <section className="bg-gradient-to-r from-medical-navy to-medical-blue rounded-2xl p-12 text-white">
        <div className="text-center space-y-6">
          <h2 className="text-3xl font-bold">Assessment Protocol</h2>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            Streamlined four-step process designed for clinical efficiency while
            maintaining diagnostic precision
          </p>

          <div className="grid md:grid-cols-4 gap-6 mt-8">
            {[
              {
                step: '01',
                title: 'Patient Intake',
                icon: <Users className="w-6 h-6" />,
              },
              {
                step: '02',
                title: 'Medical History',
                icon: <FileText className="w-6 h-6" />,
              },
              {
                step: '03',
                title: 'Clinical Assessment',
                icon: <Activity className="w-6 h-6" />,
              },
              {
                step: '04',
                title: 'EEG Analysis',
                icon: <Zap className="w-6 h-6" />,
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6"
              >
                <div className="text-3xl font-bold opacity-50 mb-2">{item.step}</div>
                <div className="mb-3">{item.icon}</div>
                <div className="font-medium">{item.title}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Clinical Notice */}
      <section className="card bg-yellow-50 border-yellow-200">
        <div className="flex items-start space-x-4">
          <Shield className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
          <div className="flex-1">
            <h3 className="font-semibold text-medical-navy mb-2">
              Professional Use Only - Important Notice
            </h3>
            <p className="text-sm text-medical-slate leading-relaxed">
              This diagnostic support tool is designed exclusively for licensed healthcare
              professionals. Results should be interpreted within the context of complete
              clinical evaluation. This system provides supportive diagnostic insights and
              does not replace comprehensive clinical judgment or formal diagnostic
              procedures as outlined in DSM-5 criteria.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default LandingPage
