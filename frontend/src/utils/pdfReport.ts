import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { EEGData } from '../services/api'

interface ReportData {
  patientId: string
  age: string
  gender: string
  education: string
  occupation: string
  referringPhysician: string
  prediction: string
  riskLevel: string
  confidence: number
  confidenceScores: Record<string, number>
  eegData: EEGData | null
  questionnaireData: Record<string, number>
  medicalHistory: Record<string, any>
  recommendations: string[]
}

export function generatePDFReport(data: ReportData): void {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()
  let y = 15

  // ===== HEADER =====
  doc.setFillColor(30, 58, 138) // medical-navy
  doc.rect(0, 0, pageWidth, 45, 'F')

  doc.setTextColor(255, 255, 255)
  doc.setFontSize(22)
  doc.setFont('helvetica', 'bold')
  doc.text('ADHD Detection System', pageWidth / 2, 18, { align: 'center' })

  doc.setFontSize(11)
  doc.setFont('helvetica', 'normal')
  doc.text('AI-Powered Neurodevelopmental Assessment Report', pageWidth / 2, 27, { align: 'center' })

  doc.setFontSize(9)
  doc.text(`Report Generated: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}`, pageWidth / 2, 37, { align: 'center' })

  y = 55

  // ===== PATIENT INFORMATION =====
  doc.setTextColor(30, 58, 138)
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('Patient Information', 14, y)
  y += 3
  doc.setDrawColor(59, 130, 246)
  doc.setLineWidth(0.8)
  doc.line(14, y, pageWidth - 14, y)
  y += 8

  doc.setTextColor(51, 65, 85)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')

  const patientInfo = [
    ['Patient ID', data.patientId || 'N/A'],
    ['Age', data.age || 'N/A'],
    ['Gender', data.gender || 'N/A'],
    ['Education', data.education || 'N/A'],
    ['Occupation', data.occupation || 'N/A'],
    ['Referring Physician', data.referringPhysician || 'N/A'],
  ]

  autoTable(doc, {
    startY: y,
    head: [],
    body: patientInfo,
    theme: 'plain',
    styles: { fontSize: 10, cellPadding: 3 },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 50, textColor: [30, 58, 138] },
      1: { cellWidth: 130 },
    },
    margin: { left: 14, right: 14 },
  })

  y = (doc as any).lastAutoTable.finalY + 12

  // ===== PREDICTION RESULT =====
  doc.setTextColor(30, 58, 138)
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('Assessment Result', 14, y)
  y += 3
  doc.setDrawColor(59, 130, 246)
  doc.line(14, y, pageWidth - 14, y)
  y += 8

  // Result box
  const riskColors: Record<string, [number, number, number]> = {
    high: [254, 226, 226],
    moderate: [254, 243, 199],
    low: [209, 250, 229],
  }
  const riskTextColors: Record<string, [number, number, number]> = {
    high: [185, 28, 28],
    moderate: [146, 64, 14],
    low: [5, 150, 105],
  }

  const bgColor = riskColors[data.riskLevel] || [241, 245, 249]
  const txtColor = riskTextColors[data.riskLevel] || [51, 65, 85]

  doc.setFillColor(bgColor[0], bgColor[1], bgColor[2])
  doc.roundedRect(14, y, pageWidth - 28, 35, 3, 3, 'F')

  doc.setTextColor(txtColor[0], txtColor[1], txtColor[2])
  doc.setFontSize(18)
  doc.setFont('helvetica', 'bold')
  doc.text(`Prediction: ${data.prediction}`, pageWidth / 2, y + 14, { align: 'center' })

  doc.setFontSize(12)
  doc.setFont('helvetica', 'normal')
  doc.text(
    `Risk Level: ${data.riskLevel.charAt(0).toUpperCase() + data.riskLevel.slice(1)}  |  Confidence: ${data.confidence}%`,
    pageWidth / 2, y + 26,
    { align: 'center' }
  )

  y += 45

  // Confidence breakdown
  if (data.confidenceScores && Object.keys(data.confidenceScores).length > 0) {
    doc.setTextColor(51, 65, 85)
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.text('Confidence Breakdown:', 14, y)
    y += 6

    const confEntries = Object.entries(data.confidenceScores).map(([label, score]) => [label, `${score}%`])
    autoTable(doc, {
      startY: y,
      head: [['Class', 'Confidence']],
      body: confEntries,
      theme: 'striped',
      styles: { fontSize: 9, cellPadding: 3 },
      headStyles: { fillColor: [30, 58, 138], textColor: [255, 255, 255] },
      margin: { left: 14, right: 14 },
      tableWidth: 80,
    })
    y = (doc as any).lastAutoTable.finalY + 10
  }

  // ===== EEG DATA TABLE =====
  if (data.eegData) {
    if (y > 220) {
      doc.addPage()
      y = 20
    }

    doc.setTextColor(30, 58, 138)
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text('EEG Channel Data (19-Channel 10-20 System)', 14, y)
    y += 3
    doc.setDrawColor(59, 130, 246)
    doc.line(14, y, pageWidth - 14, y)
    y += 6

    const eegEntries = Object.entries(data.eegData).map(([ch, val]) => [ch, String(Math.round(val as number))])
    const half = Math.ceil(eegEntries.length / 2)
    const col1 = eegEntries.slice(0, half)
    const col2 = eegEntries.slice(half)
    const combined = col1.map((row, i) => [
      row[0], row[1],
      col2[i] ? col2[i][0] : '',
      col2[i] ? col2[i][1] : '',
    ])

    autoTable(doc, {
      startY: y,
      head: [['Channel', 'Value (μV)', 'Channel', 'Value (μV)']],
      body: combined,
      theme: 'striped',
      styles: { fontSize: 9, cellPadding: 2, halign: 'center' },
      headStyles: { fillColor: [30, 58, 138], textColor: [255, 255, 255] },
      margin: { left: 14, right: 14 },
    })
    y = (doc as any).lastAutoTable.finalY + 10
  }

  // ===== RECOMMENDATIONS =====
  if (y > 220) {
    doc.addPage()
    y = 20
  }

  doc.setTextColor(30, 58, 138)
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('Clinical Recommendations', 14, y)
  y += 3
  doc.setDrawColor(59, 130, 246)
  doc.line(14, y, pageWidth - 14, y)
  y += 8

  doc.setTextColor(51, 65, 85)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')

  data.recommendations.forEach((rec, i) => {
    if (y > 270) {
      doc.addPage()
      y = 20
    }
    const text = `${i + 1}. ${rec}`
    const lines = doc.splitTextToSize(text, pageWidth - 35)
    doc.text(lines, 18, y)
    y += lines.length * 5 + 3
  })

  // ===== DISCLAIMER =====
  if (y > 240) {
    doc.addPage()
    y = 20
  }
  y += 5
  doc.setFillColor(255, 251, 235) // amber-50
  doc.roundedRect(14, y, pageWidth - 28, 30, 2, 2, 'F')
  doc.setDrawColor(251, 191, 36)
  doc.roundedRect(14, y, pageWidth - 28, 30, 2, 2, 'S')

  doc.setTextColor(146, 64, 14)
  doc.setFontSize(9)
  doc.setFont('helvetica', 'bold')
  doc.text('DISCLAIMER:', 18, y + 8)
  doc.setFont('helvetica', 'normal')
  const disclaimer = 'This report is a screening tool and does not constitute a clinical diagnosis. Results should be interpreted by a qualified healthcare professional within the context of comprehensive clinical evaluation, patient history, and standardized diagnostic criteria (DSM-5, ICD-11).'
  const disclaimerLines = doc.splitTextToSize(disclaimer, pageWidth - 40)
  doc.text(disclaimerLines, 18, y + 14)

  // ===== FOOTER =====
  const totalPages = doc.getNumberOfPages()
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setTextColor(148, 163, 184)
    doc.text(
      `ADHD Detection System — Confidential Medical Report — Page ${i} of ${totalPages}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 8,
      { align: 'center' }
    )
  }

  // Save
  const filename = `ADHD_Report_${data.patientId || 'Unknown'}_${new Date().toISOString().split('T')[0]}.pdf`
  doc.save(filename)
}
