import React from 'react'
import { motion } from 'framer-motion'
import {
  Lightbulb,
  BookOpen,
  Heart,
  Clock,
  Users,
  Brain,
  Activity,
  Shield,
} from 'lucide-react'

interface AIRecommendationsProps {
  prediction: string
  riskLevel: string
  confidence: number
  questionnaireData: Record<string, number>
}

interface Recommendation {
  icon: React.ReactNode
  title: string
  description: string
  category: 'therapy' | 'lifestyle' | 'medical' | 'education'
}

const categoryColors = {
  therapy: 'bg-purple-50 border-purple-200',
  lifestyle: 'bg-green-50 border-green-200',
  medical: 'bg-red-50 border-red-200',
  education: 'bg-blue-50 border-blue-200',
}

const categoryLabels = {
  therapy: 'Behavioral Therapy',
  lifestyle: 'Lifestyle & Wellness',
  medical: 'Medical Follow-up',
  education: 'Educational Support',
}

const categoryIconColors = {
  therapy: 'text-purple-600',
  lifestyle: 'text-green-600',
  medical: 'text-red-600',
  education: 'text-blue-600',
}

function getSmartRecommendations(
  prediction: string,
  _riskLevel: string,
  confidence: number,
  questionnaireData: Record<string, number>
): Recommendation[] {
  const recs: Recommendation[] = []

  // Calculate questionnaire sub-scores
  const inattentionQs = [1, 2, 3, 5, 11, 13, 14, 15, 19, 23]
  const hyperactivityQs = [6, 7, 8, 9, 10, 16, 22, 24, 27, 30]
  const executiveQs = [4, 12, 20, 21, 25, 28, 29]
  const emotionalQs = [17, 18, 26]

  const getSubScore = (qs: number[]) => {
    const vals = qs.map(q => questionnaireData[q] || 3)
    return vals.reduce((a, b) => a + b, 0) / (vals.length * 5)
  }

  const inattentionScore = getSubScore(inattentionQs)
  const hyperactivityScore = getSubScore(hyperactivityQs)
  const executiveScore = getSubScore(executiveQs)
  const emotionalScore = getSubScore(emotionalQs)

  if (prediction === 'ADHD') {
    // Base ADHD recommendations
    recs.push({
      icon: <Brain className="w-5 h-5" />,
      title: 'Cognitive Behavioral Therapy (CBT)',
      description: 'Evidence-based CBT targeting ADHD-specific thought patterns and executive function deficits. Focus on organizational skills, time management, and emotion regulation strategies.',
      category: 'therapy',
    })

    recs.push({
      icon: <Shield className="w-5 h-5" />,
      title: 'Comprehensive Clinical Evaluation',
      description: `With ${confidence}% model confidence, a formal DSM-5 diagnostic evaluation is recommended to confirm ADHD diagnosis and assess for comorbid conditions.`,
      category: 'medical',
    })

    // Inattention-specific
    if (inattentionScore > 0.6) {
      recs.push({
        icon: <Lightbulb className="w-5 h-5" />,
        title: 'Attention Training Program',
        description: 'High inattention markers detected. Consider computerized attention training (e.g., CogMed) combined with mindfulness-based cognitive therapy (MBCT) for attention improvement.',
        category: 'therapy',
      })
    }

    // Hyperactivity-specific
    if (hyperactivityScore > 0.6) {
      recs.push({
        icon: <Activity className="w-5 h-5" />,
        title: 'Structured Physical Activity',
        description: 'Elevated hyperactivity indicators. Regular aerobic exercise (30+ min daily) has shown significant benefits. Consider martial arts, swimming, or team sports for structured energy channeling.',
        category: 'lifestyle',
      })
    }

    // Executive function
    if (executiveScore > 0.5) {
      recs.push({
        icon: <BookOpen className="w-5 h-5" />,
        title: 'Executive Function Coaching',
        description: 'Executive function challenges identified. Implement external organizational systems: digital planners, reminder apps, task-breaking strategies, and Pomodoro technique for focus management.',
        category: 'education',
      })
    }

    // Emotional regulation
    if (emotionalScore > 0.6) {
      recs.push({
        icon: <Heart className="w-5 h-5" />,
        title: 'Emotional Regulation Support',
        description: 'Emotional dysregulation markers elevated. Dialectical behavior therapy (DBT) skills training, particularly distress tolerance and emotion regulation modules.',
        category: 'therapy',
      })
    }

    recs.push({
      icon: <Clock className="w-5 h-5" />,
      title: 'Sleep Hygiene Optimization',
      description: 'ADHD frequently co-occurs with sleep disturbances. Establish consistent sleep schedule, limit screen time before bed, and consider sleep study if insomnia persists.',
      category: 'lifestyle',
    })

    recs.push({
      icon: <Users className="w-5 h-5" />,
      title: 'Support Group & Psychoeducation',
      description: 'Connect with ADHD support communities. Family psychoeducation about ADHD can improve understanding, reduce stigma, and enhance treatment compliance.',
      category: 'education',
    })

  } else if (prediction === 'Non_ADHD' || prediction === 'Healthy') {
    recs.push({
      icon: <Shield className="w-5 h-5" />,
      title: 'Routine Developmental Monitoring',
      description: 'No significant ADHD indicators detected in this screening. Continue routine check-ups and monitor for any emerging symptoms over time.',
      category: 'medical',
    })

    recs.push({
      icon: <Activity className="w-5 h-5" />,
      title: 'Maintain Healthy Lifestyle',
      description: 'Continue regular physical activity, balanced nutrition, adequate sleep (7-9 hours), and stress management practices to support optimal cognitive function.',
      category: 'lifestyle',
    })

    recs.push({
      icon: <Brain className="w-5 h-5" />,
      title: 'Cognitive Wellness Activities',
      description: 'Engage in brain-healthy activities: reading, puzzles, learning new skills, social interaction, and regular exercise to maintain cognitive sharpness.',
      category: 'lifestyle',
    })

    if (inattentionScore > 0.5 || executiveScore > 0.5) {
      recs.push({
        icon: <Lightbulb className="w-5 h-5" />,
        title: 'Mild Attention Enhancement',
        description: 'Some attention/executive function questionnaire responses suggest minor challenges. Consider mindfulness meditation apps (Headspace, Calm) and organizational tools.',
        category: 'education',
      })
    }

    recs.push({
      icon: <Clock className="w-5 h-5" />,
      title: 'Follow-up if Symptoms Arise',
      description: 'Re-evaluate if attention, hyperactivity, or impulsivity symptoms develop or worsen. Early detection enables more effective interventions.',
      category: 'medical',
    })
  }

  return recs
}

const AIRecommendations: React.FC<AIRecommendationsProps> = ({
  prediction,
  riskLevel,
  confidence,
  questionnaireData,
}) => {
  const recommendations = getSmartRecommendations(prediction, riskLevel, confidence, questionnaireData)

  // Group by category
  const grouped = recommendations.reduce((acc, rec) => {
    if (!acc[rec.category]) acc[rec.category] = []
    acc[rec.category].push(rec)
    return acc
  }, {} as Record<string, Recommendation[]>)

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 mb-2">
        <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-2 rounded-lg">
          <Lightbulb className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-medical-navy">
            AI-Powered Personalized Recommendations
          </h3>
          <p className="text-xs text-medical-slate">
            Generated based on EEG prediction, questionnaire sub-scores, and risk assessment
          </p>
        </div>
      </div>

      {Object.entries(grouped).map(([category, recs], catIdx) => (
        <div key={category} className="space-y-2">
          <h4 className={`text-sm font-semibold uppercase tracking-wider ${categoryIconColors[category as keyof typeof categoryIconColors]}`}>
            {categoryLabels[category as keyof typeof categoryLabels]}
          </h4>
          {recs.map((rec, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: (catIdx * 3 + idx) * 0.08 }}
              className={`p-4 rounded-lg border ${categoryColors[rec.category]} transition-all hover:shadow-md`}
            >
              <div className="flex items-start space-x-3">
                <div className={`mt-0.5 ${categoryIconColors[rec.category]}`}>
                  {rec.icon}
                </div>
                <div className="flex-1">
                  <h5 className="font-semibold text-medical-navy text-sm">
                    {rec.title}
                  </h5>
                  <p className="text-xs text-medical-dark-slate mt-1 leading-relaxed">
                    {rec.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ))}
    </div>
  )
}

export default AIRecommendations
