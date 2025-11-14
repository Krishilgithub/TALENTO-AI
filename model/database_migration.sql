-- Migration Script: Run this in your Supabase SQL Editor
-- This script will safely migrate your database to the enhanced schema

BEGIN;

-- Step 1: Clean up unused tables (CAREFUL - this will delete data)
-- Comment out any tables you want to keep
DROP TABLE IF EXISTS chat_messages CASCADE;
DROP TABLE IF EXISTS chat_threads CASCADE; 
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS request_completions CASCADE;
DROP TABLE IF EXISTS saved_jobs CASCADE;
DROP TABLE IF EXISTS swap_requests CASCADE;

-- Step 2: Ensure assessment_history table exists (using existing data if available)
-- This preserves any existing assessment data
DO $$
BEGIN
    -- Check if assessment_results exists and migrate data
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'assessment_results') THEN
        -- Create assessment_history if it doesn't exist
        CREATE TABLE IF NOT EXISTS assessment_history (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
            assessment_type TEXT NOT NULL,
            score DECIMAL(5,2) NOT NULL,
            level TEXT,
            number_of_questions INTEGER,
            completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        -- Migrate data from assessment_results to assessment_history
        -- Handle missing columns gracefully
        INSERT INTO assessment_history (user_id, assessment_type, score, level, number_of_questions, completed_at, created_at)
        SELECT 
            user_id, 
            assessment_type, 
            score, 
            level, 
            number_of_questions,
            COALESCE(
                (CASE WHEN EXISTS(SELECT 1 FROM information_schema.columns WHERE table_name = 'assessment_results' AND column_name = 'completed_at') 
                 THEN completed_at ELSE NULL END),
                (CASE WHEN EXISTS(SELECT 1 FROM information_schema.columns WHERE table_name = 'assessment_results' AND column_name = 'created_at') 
                 THEN created_at ELSE NOW() END)
            ) as completed_at,
            COALESCE(
                (CASE WHEN EXISTS(SELECT 1 FROM information_schema.columns WHERE table_name = 'assessment_results' AND column_name = 'created_at') 
                 THEN created_at ELSE NOW() END)
            ) as created_at
        FROM assessment_results
        WHERE NOT EXISTS (
            SELECT 1 FROM assessment_history ah 
            WHERE ah.user_id = assessment_results.user_id 
            AND ah.assessment_type = assessment_results.assessment_type
        );
        
        RAISE NOTICE 'Data migrated from assessment_results to assessment_history';
    ELSE
        -- Create assessment_history table if assessment_results doesn't exist
        CREATE TABLE IF NOT EXISTS assessment_history (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
            assessment_type TEXT NOT NULL,
            score DECIMAL(5,2) NOT NULL,
            level TEXT,
            number_of_questions INTEGER,
            completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
    END IF;
END $$;

-- Step 3: Create enhanced assessment tables
CREATE TABLE IF NOT EXISTS assessment_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    assessment_type TEXT NOT NULL,
    job_role TEXT,
    difficulty_level TEXT DEFAULT 'medium',
    total_questions INTEGER NOT NULL,
    correct_answers INTEGER NOT NULL,
    score DECIMAL(5,2) NOT NULL,
    level TEXT,
    total_time_taken INTEGER,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS assessment_attempts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    assessment_type TEXT NOT NULL,
    job_role TEXT,
    difficulty_level TEXT DEFAULT 'medium',
    question_number INTEGER NOT NULL,
    question_text TEXT NOT NULL,
    question_options JSONB,
    user_answer TEXT NOT NULL,
    correct_answer TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL,
    time_taken INTEGER,
    question_category TEXT,
    attempt_session_id UUID REFERENCES assessment_sessions(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_progress_analytics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    assessment_type TEXT NOT NULL,
    job_role TEXT,
    total_attempts INTEGER DEFAULT 0,
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

-- Step 4: Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_assessment_history_user_id ON assessment_history(user_id);
CREATE INDEX IF NOT EXISTS idx_assessment_history_type ON assessment_history(assessment_type);
CREATE INDEX IF NOT EXISTS idx_assessment_history_completed ON assessment_history(completed_at DESC);

CREATE INDEX IF NOT EXISTS idx_assessment_sessions_user_id ON assessment_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_assessment_sessions_type ON assessment_sessions(assessment_type);
CREATE INDEX IF NOT EXISTS idx_assessment_sessions_job_role ON assessment_sessions(job_role);
CREATE INDEX IF NOT EXISTS idx_assessment_sessions_completed ON assessment_sessions(completed_at DESC);

CREATE INDEX IF NOT EXISTS idx_assessment_attempts_user_id ON assessment_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_assessment_attempts_session_id ON assessment_attempts(attempt_session_id);
CREATE INDEX IF NOT EXISTS idx_assessment_attempts_type ON assessment_attempts(assessment_type);
CREATE INDEX IF NOT EXISTS idx_assessment_attempts_category ON assessment_attempts(question_category);

CREATE INDEX IF NOT EXISTS idx_progress_analytics_user_id ON user_progress_analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_progress_analytics_type ON user_progress_analytics(assessment_type);

-- Step 5: Enable Row Level Security
ALTER TABLE assessment_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress_analytics ENABLE ROW LEVEL SECURITY;

-- Step 6: Create RLS policies
-- Assessment History Policies
DROP POLICY IF EXISTS "Users can view their own assessment history" ON assessment_history;
CREATE POLICY "Users can view their own assessment history" ON assessment_history
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own assessment history" ON assessment_history;
CREATE POLICY "Users can insert their own assessment history" ON assessment_history
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Assessment Sessions Policies
DROP POLICY IF EXISTS "Users can view their own assessment sessions" ON assessment_sessions;
CREATE POLICY "Users can view their own assessment sessions" ON assessment_sessions
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own assessment sessions" ON assessment_sessions;
CREATE POLICY "Users can insert their own assessment sessions" ON assessment_sessions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own assessment sessions" ON assessment_sessions;
CREATE POLICY "Users can update their own assessment sessions" ON assessment_sessions
    FOR UPDATE USING (auth.uid() = user_id);

-- Assessment Attempts Policies
DROP POLICY IF EXISTS "Users can view their own assessment attempts" ON assessment_attempts;
CREATE POLICY "Users can view their own assessment attempts" ON assessment_attempts
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own assessment attempts" ON assessment_attempts;
CREATE POLICY "Users can insert their own assessment attempts" ON assessment_attempts
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Progress Analytics Policies
DROP POLICY IF EXISTS "Users can view their own progress analytics" ON user_progress_analytics;
CREATE POLICY "Users can view their own progress analytics" ON user_progress_analytics
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own progress analytics" ON user_progress_analytics;
CREATE POLICY "Users can insert their own progress analytics" ON user_progress_analytics
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own progress analytics" ON user_progress_analytics;
CREATE POLICY "Users can update their own progress analytics" ON user_progress_analytics
    FOR UPDATE USING (auth.uid() = user_id);

-- Step 7: Create automatic progress update function
CREATE OR REPLACE FUNCTION update_progress_analytics()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO user_progress_analytics (
        user_id, 
        assessment_type, 
        job_role, 
        total_attempts, 
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
        NEW.correct_answers,
        NEW.score,
        NEW.score,
        NEW.completed_at,
        COALESCE(NEW.total_time_taken, 0),
        NOW()
    )
    ON CONFLICT (user_id, assessment_type, job_role)
    DO UPDATE SET
        total_attempts = user_progress_analytics.total_attempts + 1,
        total_correct = user_progress_analytics.total_correct + NEW.correct_answers,
        average_score = (user_progress_analytics.average_score * user_progress_analytics.total_attempts + NEW.score) / (user_progress_analytics.total_attempts + 1),
        best_score = GREATEST(user_progress_analytics.best_score, NEW.score),
        last_assessment_date = NEW.completed_at,
        total_time_spent = user_progress_analytics.total_time_spent + COALESCE(NEW.total_time_taken, 0),
        updated_at = NOW();
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 8: Create trigger for automatic progress updates
DROP TRIGGER IF EXISTS trigger_update_progress_analytics ON assessment_sessions;
CREATE TRIGGER trigger_update_progress_analytics
    AFTER INSERT ON assessment_sessions
    FOR EACH ROW
    EXECUTE FUNCTION update_progress_analytics();

COMMIT;

-- Success message
DO $$ 
BEGIN 
    RAISE NOTICE 'Enhanced assessment schema migration completed successfully!';
    RAISE NOTICE 'Tables created: assessment_history, assessment_sessions, assessment_attempts, user_progress_analytics';
    RAISE NOTICE 'Unused tables removed: chat_messages, chat_threads, notifications, request_completions, saved_jobs, swap_requests';
END $$;