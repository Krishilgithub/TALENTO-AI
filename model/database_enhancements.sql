-- Enhanced Assessment Tracking Schema
-- This extends the existing assessment_results table with detailed tracking capabilities

-- Create assessment_attempts table for detailed question-by-question tracking
CREATE TABLE IF NOT EXISTS assessment_attempts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    assessment_type TEXT NOT NULL,
    job_role TEXT,
    difficulty_level TEXT DEFAULT 'medium',
    question_number INTEGER NOT NULL,
    question_text TEXT NOT NULL,
    question_options JSONB,
    user_answer TEXT NOT NULL,
    correct_answer TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL,
    time_taken INTEGER, -- in seconds
    question_category TEXT,
    attempt_session_id UUID NOT NULL, -- groups questions from same attempt
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create assessment_sessions table to group attempts
CREATE TABLE IF NOT EXISTS assessment_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    assessment_type TEXT NOT NULL,
    job_role TEXT,
    difficulty_level TEXT DEFAULT 'medium',
    total_questions INTEGER NOT NULL,
    correct_answers INTEGER NOT NULL,
    score DECIMAL(5,2) NOT NULL,
    level TEXT,
    total_time_taken INTEGER, -- in seconds
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_assessment_attempts_user_id ON assessment_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_assessment_attempts_session_id ON assessment_attempts(attempt_session_id);
CREATE INDEX IF NOT EXISTS idx_assessment_sessions_user_id ON assessment_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_assessment_sessions_type ON assessment_sessions(assessment_type);

-- Enable RLS (Row Level Security)
ALTER TABLE assessment_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_sessions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own assessment attempts" ON assessment_attempts
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own assessment attempts" ON assessment_attempts
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own assessment sessions" ON assessment_sessions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own assessment sessions" ON assessment_sessions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own assessment sessions" ON assessment_sessions
    FOR UPDATE USING (auth.uid() = user_id);