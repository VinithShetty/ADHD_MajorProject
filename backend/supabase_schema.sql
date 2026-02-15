-- =============================================
-- Supabase Table Schema for ADHD Detection System
-- Run this SQL in Supabase SQL Editor (Dashboard > SQL Editor)
-- =============================================

-- Table: patient_assessments
-- Stores all patient assessment details including user info, medical history,
-- questionnaire responses, EEG data, and prediction results.

CREATE TABLE IF NOT EXISTS patient_assessments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Patient Information
    patient_id TEXT NOT NULL,
    age TEXT,
    gender TEXT,
    education TEXT,
    occupation TEXT,
    referring_physician TEXT,
    
    -- Medical History (stored as JSONB for flexibility)
    medical_history JSONB DEFAULT '{}'::jsonb,
    
    -- Questionnaire Responses (array of 30 scores)
    questionnaire_responses JSONB DEFAULT '[]'::jsonb,
    
    -- EEG Data (19 channels)
    eeg_data JSONB DEFAULT '{}'::jsonb,
    
    -- Prediction Results
    prediction TEXT NOT NULL,
    risk_level TEXT,
    confidence_score FLOAT,
    
    -- Metadata
    assessment_date TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE patient_assessments ENABLE ROW LEVEL SECURITY;

-- Policy: Allow insert for anonymous users (for the app to write data)
CREATE POLICY "Allow anonymous insert" ON patient_assessments
    FOR INSERT
    WITH CHECK (true);

-- Policy: Allow select for anonymous users (for the app to read data)
CREATE POLICY "Allow anonymous select" ON patient_assessments
    FOR SELECT
    USING (true);

-- Policy: Allow update for anonymous users
CREATE POLICY "Allow anonymous update" ON patient_assessments
    FOR UPDATE
    USING (true)
    WITH CHECK (true);

-- Index for faster lookups
CREATE INDEX idx_patient_id ON patient_assessments(patient_id);
CREATE INDEX idx_assessment_date ON patient_assessments(assessment_date DESC);
CREATE INDEX idx_prediction ON patient_assessments(prediction);
