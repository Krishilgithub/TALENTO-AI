-- Simple Assessment Schema for TalentoAI (Reverted)
-- Run this in your Supabase SQL Editor

BEGIN;

-- Step 1: Drop all complex tables and revert to simple structure
DROP TABLE IF EXISTS assessment_categories CASCADE;
DROP TABLE IF EXISTS job_roles CASCADE;
DROP TABLE IF EXISTS assessment_templates CASCADE;
DROP TABLE IF EXISTS user_assessment_sessions CASCADE;
DROP TABLE IF EXISTS assessment_question_responses CASCADE;
DROP TABLE IF EXISTS user_progress_analytics CASCADE;
DROP TABLE IF EXISTS user_skill_progression CASCADE;
DROP TABLE IF EXISTS assessment_history CASCADE;
DROP TABLE IF EXISTS assessment_sessions CASCADE;
DROP TABLE IF EXISTS assessment_attempts CASCADE;
DROP TABLE IF EXISTS assessment_results CASCADE;
DROP TABLE IF EXISTS chat_messages CASCADE;
DROP TABLE IF EXISTS chat_threads CASCADE; 
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS request_completions CASCADE;
DROP TABLE IF EXISTS saved_jobs CASCADE;
DROP TABLE IF EXISTS swap_requests CASCADE;

-- Step 2: Create simple assessment_results table (Main table)
CREATE TABLE assessment_results (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    assessment_type TEXT NOT NULL,
    job_role TEXT,
    score DECIMAL(5,2) NOT NULL,
    level TEXT,
    number_of_questions INTEGER,
    correct_answers INTEGER DEFAULT 0,
    time_taken INTEGER, -- in seconds
    questions_data JSONB, -- Store all questions and answers
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 3: Create user_progress table (Simple progress tracking)
CREATE TABLE user_progress (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    assessment_type TEXT NOT NULL,
    job_role TEXT,
    total_assessments INTEGER DEFAULT 0,
    total_questions INTEGER DEFAULT 0,
    total_correct INTEGER DEFAULT 0,
    average_score DECIMAL(5,2) DEFAULT 0,
    best_score DECIMAL(5,2) DEFAULT 0,
    improvement_rate DECIMAL(5,2) DEFAULT 0,
    last_assessment_date TIMESTAMP WITH TIME ZONE,
    streak_count INTEGER DEFAULT 0,
    total_time_spent INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, assessment_type, job_role)
);

-- Step 4: Create simple indexes for performance
CREATE INDEX IF NOT EXISTS idx_assessment_results_user_id ON assessment_results(user_id);
CREATE INDEX IF NOT EXISTS idx_assessment_results_type ON assessment_results(assessment_type);
CREATE INDEX IF NOT EXISTS idx_assessment_results_completed ON assessment_results(completed_at DESC);
CREATE INDEX IF NOT EXISTS idx_assessment_results_score ON assessment_results(score DESC);

CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_type ON user_progress(assessment_type);
CREATE INDEX IF NOT EXISTS idx_user_progress_updated ON user_progress(updated_at DESC);

-- Step 5: Enable Row Level Security
ALTER TABLE assessment_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- Step 6: Create simple RLS policies
-- Assessment Results Policies
CREATE POLICY "Users can view their own assessment results" ON assessment_results
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own assessment results" ON assessment_results
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- User Progress Policies
CREATE POLICY "Users can view their own progress" ON user_progress
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress" ON user_progress
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress" ON user_progress
    FOR UPDATE USING (auth.uid() = user_id);

-- Step 7: Create simple trigger for automatic progress updates
CREATE OR REPLACE FUNCTION update_user_progress()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO user_progress (
        user_id,
        assessment_type,
        job_role,
        total_assessments,
        total_questions,
        total_correct,
        average_score,
        best_score,
        last_assessment_date,
        total_time_spent,
        updated_at
    )
    VALUES (
        NEW.user_id,
        NEW.assessment_type,
        NEW.job_role,
        1,
        NEW.number_of_questions,
        NEW.correct_answers,
        NEW.score,
        NEW.score,
        NEW.completed_at,
        COALESCE(NEW.time_taken, 0),
        NOW()
    )
    ON CONFLICT (user_id, assessment_type, job_role)
    DO UPDATE SET
        total_assessments = user_progress.total_assessments + 1,
        total_questions = user_progress.total_questions + NEW.number_of_questions,
        total_correct = user_progress.total_correct + NEW.correct_answers,
        average_score = ROUND(((user_progress.average_score * user_progress.total_assessments) + NEW.score) / 
                             (user_progress.total_assessments + 1), 2),
        best_score = GREATEST(user_progress.best_score, NEW.score),
        improvement_rate = NEW.score - (
            SELECT score 
            FROM assessment_results 
            WHERE user_id = NEW.user_id 
            AND assessment_type = NEW.assessment_type 
            AND job_role = NEW.job_role 
            AND id != NEW.id
            ORDER BY completed_at DESC 
            LIMIT 1
        ),
        last_assessment_date = NEW.completed_at,
        total_time_spent = user_progress.total_time_spent + COALESCE(NEW.time_taken, 0),
        updated_at = NOW();
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 8: Create trigger for automatic progress updates
DROP TRIGGER IF EXISTS trigger_update_user_progress ON assessment_results;
CREATE TRIGGER trigger_update_user_progress
    AFTER INSERT ON assessment_results
    FOR EACH ROW
    EXECUTE FUNCTION update_user_progress();

COMMIT;

-- Success message
DO $$ 
BEGIN 
    RAISE NOTICE '=== ✅ SIMPLE ASSESSMENT SCHEMA MIGRATION COMPLETED! ===';
    RAISE NOTICE '';
    RAISE NOTICE '📊 Tables Created:';
    RAISE NOTICE '  ✓ assessment_results (Main assessment storage)';
    RAISE NOTICE '  ✓ user_progress (Progress tracking)';
    RAISE NOTICE '';
    RAISE NOTICE '🔧 Features:';
    RAISE NOTICE '  ✓ Simple assessment result storage';
    RAISE NOTICE '  ✓ Automatic progress updates';
    RAISE NOTICE '  ✓ Score tracking and improvement rate';
    RAISE NOTICE '';
    RAISE NOTICE '🛡️ Security:';
    RAISE NOTICE '  ✓ Row Level Security enabled';
    RAISE NOTICE '  ✓ User data isolation';
    RAISE NOTICE '';
    RAISE NOTICE '🎉 Your TalentoAI database is ready for simple assessment tracking!';
END $$;