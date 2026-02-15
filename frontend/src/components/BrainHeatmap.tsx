import React from 'react'
import { motion } from 'framer-motion'
import { EEGData } from '../services/api'

interface BrainHeatmapProps {
  eegData: EEGData | null
  className?: string
}

// Electrode positions mapped to approximate brain locations (SVG coordinates)
const electrodePositions: { [key: string]: { x: number; y: number; region: string } } = {
  Fp1: { x: 155, y: 60, region: 'Prefrontal' },
  Fp2: { x: 245, y: 60, region: 'Prefrontal' },
  F7:  { x: 85, y: 130, region: 'Frontal' },
  F3:  { x: 155, y: 130, region: 'Frontal' },
  Fz:  { x: 200, y: 115, region: 'Frontal' },
  F4:  { x: 245, y: 130, region: 'Frontal' },
  F8:  { x: 315, y: 130, region: 'Frontal' },
  T7:  { x: 60, y: 200, region: 'Temporal' },
  C3:  { x: 140, y: 200, region: 'Central' },
  Cz:  { x: 200, y: 195, region: 'Central' },
  C4:  { x: 260, y: 200, region: 'Central' },
  T8:  { x: 340, y: 200, region: 'Temporal' },
  P7:  { x: 85, y: 275, region: 'Parietal' },
  P3:  { x: 155, y: 270, region: 'Parietal' },
  Pz:  { x: 200, y: 275, region: 'Parietal' },
  P4:  { x: 245, y: 270, region: 'Parietal' },
  P8:  { x: 315, y: 275, region: 'Parietal' },
  O1:  { x: 165, y: 340, region: 'Occipital' },
  O2:  { x: 235, y: 340, region: 'Occipital' },
}

function getHeatColor(value: number, min: number, max: number): string {
  if (max === min) return 'rgb(255, 255, 0)'
  const normalized = (value - min) / (max - min)
  // Blue (low) -> Green (mid) -> Yellow -> Red (high)
  if (normalized < 0.25) {
    const t = normalized / 0.25
    return `rgb(0, ${Math.round(t * 255)}, ${Math.round(255 - t * 128)})`
  } else if (normalized < 0.5) {
    const t = (normalized - 0.25) / 0.25
    return `rgb(${Math.round(t * 128)}, 255, ${Math.round(127 - t * 127)})`
  } else if (normalized < 0.75) {
    const t = (normalized - 0.5) / 0.25
    return `rgb(${Math.round(128 + t * 127)}, ${Math.round(255 - t * 80)}, 0)`
  } else {
    const t = (normalized - 0.75) / 0.25
    return `rgb(255, ${Math.round(175 - t * 175)}, 0)`
  }
}

const BrainHeatmap: React.FC<BrainHeatmapProps> = ({ eegData, className = '' }) => {
  if (!eegData) return null

  const values = Object.values(eegData).filter(v => typeof v === 'number') as number[]
  const min = Math.min(...values)
  const max = Math.max(...values)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`bg-white rounded-xl shadow-clinical p-6 border border-gray-200 ${className}`}
    >
      <h3 className="text-lg font-bold text-medical-navy mb-4 text-center">
        EEG Brain Activity Heatmap
      </h3>

      <div className="flex justify-center">
        <svg width="400" height="400" viewBox="0 0 400 400" className="max-w-full h-auto">
          {/* Brain outline */}
          <defs>
            <radialGradient id="brainGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#e0e7ff" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#e0e7ff" stopOpacity="0" />
            </radialGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Brain shape */}
          <ellipse cx="200" cy="200" rx="165" ry="180" 
            fill="url(#brainGlow)" 
            stroke="#94a3b8" strokeWidth="2" 
            opacity="0.5"
          />
          {/* Head outline */}
          <ellipse cx="200" cy="200" rx="165" ry="180"
            fill="none" stroke="#1e3a8a" strokeWidth="2.5" opacity="0.6"
          />
          {/* Nose indicator */}
          <polygon points="200,15 190,38 210,38" fill="#1e3a8a" opacity="0.4" />
          {/* Left ear */}
          <ellipse cx="32" cy="200" rx="12" ry="30" fill="none" stroke="#1e3a8a" strokeWidth="1.5" opacity="0.4" />
          {/* Right ear */}
          <ellipse cx="368" cy="200" rx="12" ry="30" fill="none" stroke="#1e3a8a" strokeWidth="1.5" opacity="0.4" />

          {/* Midlines */}
          <line x1="200" y1="40" x2="200" y2="370" stroke="#cbd5e1" strokeWidth="0.5" strokeDasharray="4,4" />
          <line x1="45" y1="200" x2="355" y2="200" stroke="#cbd5e1" strokeWidth="0.5" strokeDasharray="4,4" />

          {/* Electrode heatmap circles (larger background glow) */}
          {Object.entries(electrodePositions).map(([channel, pos]) => {
            const value = eegData[channel as keyof EEGData]
            if (value === undefined) return null
            const color = getHeatColor(value, min, max)
            return (
              <circle
                key={`glow-${channel}`}
                cx={pos.x}
                cy={pos.y}
                r={24}
                fill={color}
                opacity={0.25}
                filter="url(#glow)"
              />
            )
          })}

          {/* Electrode dots */}
          {Object.entries(electrodePositions).map(([channel, pos], index) => {
            const value = eegData[channel as keyof EEGData]
            if (value === undefined) return null
            const color = getHeatColor(value, min, max)
            return (
              <motion.g
                key={channel}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.04 }}
              >
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={14}
                  fill={color}
                  stroke="#1e3a8a"
                  strokeWidth="1.5"
                  opacity={0.85}
                />
                <text
                  x={pos.x}
                  y={pos.y - 18}
                  textAnchor="middle"
                  className="text-[9px] font-bold fill-slate-700"
                >
                  {channel}
                </text>
                <text
                  x={pos.x}
                  y={pos.y + 4}
                  textAnchor="middle"
                  className="text-[8px] font-semibold fill-white"
                >
                  {Math.round(value)}
                </text>
              </motion.g>
            )
          })}
        </svg>
      </div>

      {/* Color scale legend */}
      <div className="mt-4 flex items-center justify-center space-x-3">
        <span className="text-xs text-medical-slate">Low ({Math.round(min)})</span>
        <div className="flex h-3 w-48 rounded-full overflow-hidden">
          <div className="flex-1" style={{ background: 'rgb(0, 0, 255)' }} />
          <div className="flex-1" style={{ background: 'rgb(0, 255, 127)' }} />
          <div className="flex-1" style={{ background: 'rgb(128, 255, 0)' }} />
          <div className="flex-1" style={{ background: 'rgb(255, 175, 0)' }} />
          <div className="flex-1" style={{ background: 'rgb(255, 0, 0)' }} />
        </div>
        <span className="text-xs text-medical-slate">High ({Math.round(max)})</span>
      </div>

      {/* Region summary */}
      <div className="mt-4 grid grid-cols-5 gap-2 text-center">
        {['Prefrontal', 'Frontal', 'Central', 'Temporal', 'Parietal'].map(region => {
          const regionChannels = Object.entries(electrodePositions)
            .filter(([, p]) => p.region === region)
            .map(([ch]) => ch)
          const regionValues = regionChannels
            .map(ch => eegData[ch as keyof EEGData])
            .filter((v): v is number => v !== undefined)
          const avg = regionValues.length > 0
            ? regionValues.reduce((a, b) => a + b, 0) / regionValues.length
            : 0
          return (
            <div key={region} className="bg-gray-50 rounded-lg p-2">
              <p className="text-[10px] font-medium text-medical-slate">{region}</p>
              <p className="text-sm font-bold text-medical-navy">{Math.round(avg)}</p>
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}

export default BrainHeatmap
