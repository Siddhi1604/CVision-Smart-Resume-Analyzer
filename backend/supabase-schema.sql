-- Create the resume_analyses table
CREATE TABLE IF NOT EXISTS resume_analyses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    resume_name TEXT NOT NULL,
    job_category TEXT NOT NULL,
    job_role TEXT NOT NULL,
    analysis_type TEXT NOT NULL CHECK (analysis_type IN ('standard', 'ai')),
    analysis_result JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    file_name TEXT,
    file_path TEXT,
    file_mime TEXT
);

-- Create the users table for better user management
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE,
    display_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_resume_analyses_user_id ON resume_analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_resume_analyses_created_at ON resume_analyses(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_resume_analyses_analysis_type ON resume_analyses(analysis_type);

-- Enable Row Level Security (RLS)
ALTER TABLE resume_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can only see their own analyses
CREATE POLICY "Users can view own analyses" ON resume_analyses
    FOR SELECT USING (auth.uid()::text = user_id);

-- Users can insert their own analyses
CREATE POLICY "Users can insert own analyses" ON resume_analyses
    FOR INSERT WITH CHECK (auth.uid()::text = user_id);

-- Users can update their own analyses
CREATE POLICY "Users can update own analyses" ON resume_analyses
    FOR UPDATE USING (auth.uid()::text = user_id);

-- Users can delete their own analyses
CREATE POLICY "Users can delete own analyses" ON resume_analyses
    FOR DELETE USING (auth.uid()::text = user_id);

-- Users can view their own user record
CREATE POLICY "Users can view own user record" ON users
    FOR SELECT USING (auth.uid()::text = id);

-- Users can insert their own user record
CREATE POLICY "Users can insert own user record" ON users
    FOR INSERT WITH CHECK (auth.uid()::text = id);

-- Users can update their own user record
CREATE POLICY "Users can update own user record" ON users
    FOR UPDATE USING (auth.uid()::text = id);

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_resume_analyses_updated_at 
    BEFORE UPDATE ON resume_analyses 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
