# Supabase Integration Setup Guide

## Overview
This guide will help you set up Supabase integration to fix the dashboard storage issues in your CVision Resume Analyzer.

## Problem Solved
- ✅ **Persistent Storage**: Resume analyses are now stored in Supabase PostgreSQL database
- ✅ **User Data Isolation**: Each user only sees their own analyses
- ✅ **Real-time Updates**: Dashboard updates automatically when new analyses are added
- ✅ **No Data Loss**: Data persists across user sessions and server restarts

## Setup Steps

### 1. Database Schema Setup

1. Go to your Supabase project dashboard: https://nbxpgcnkbhtkxwjeqvor.supabase.co
2. Navigate to **SQL Editor** in the left sidebar
3. Run the following SQL to create the required tables:

```sql
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
CREATE POLICY "Users can view own analyses" ON resume_analyses
    FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert own analyses" ON resume_analyses
    FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update own analyses" ON resume_analyses
    FOR UPDATE USING (auth.uid()::text = user_id);

CREATE POLICY "Users can delete own analyses" ON resume_analyses
    FOR DELETE USING (auth.uid()::text = user_id);

CREATE POLICY "Users can view own user record" ON users
    FOR SELECT USING (auth.uid()::text = id);

CREATE POLICY "Users can insert own user record" ON users
    FOR INSERT WITH CHECK (auth.uid()::text = id);

CREATE POLICY "Users can update own user record" ON users
    FOR UPDATE USING (auth.uid()::text = id);
```

### 2. Migrate Existing Data

After creating the tables, run the migration script to move existing data:

```bash
cd backend
node migrate-to-supabase.js
```

### 3. Test the Integration

1. Start your backend server:
```bash
cd backend
npm start
```

2. Start your frontend:
```bash
cd frontend
npm start
```

3. Test the dashboard:
   - Log in with your account
   - Check if your existing analyses appear
   - Create a new analysis and verify it appears in the dashboard
   - Log out and log back in to verify data persistence

## What's Changed

### Backend Changes
- ✅ **Supabase Integration**: All resume analyses are now stored in Supabase
- ✅ **Real-time Support**: Backend supports real-time updates
- ✅ **User Isolation**: Each user's data is properly isolated
- ✅ **Migration Script**: Existing data can be migrated from JSON files

### Frontend Changes
- ✅ **Real-time Dashboard**: Dashboard updates automatically when new analyses are added
- ✅ **Persistent Data**: User data persists across sessions
- ✅ **Better Performance**: Faster data loading from Supabase
- ✅ **User Experience**: No more data loss on logout/login

## Files Modified

### Backend Files
- `backend/supabase.js` - Supabase client configuration
- `backend/api/index.js` - Updated to use Supabase instead of file storage
- `backend/migrate-to-supabase.js` - Data migration script
- `backend/supabase-schema.sql` - Database schema

### Frontend Files
- `frontend/src/supabase.js` - Frontend Supabase client
- `frontend/src/pages/Dashboard.js` - Updated to use Supabase with real-time updates

## Environment Variables

The following environment variables are already configured in your Supabase project:
- **Supabase URL**: `https://nbxpgcnkbhtkxwjeqvor.supabase.co`
- **Anon Key**: Already configured in the code
- **Service Key**: Already configured in the code

## Troubleshooting

### If migration fails:
1. Check that the database tables exist
2. Verify your Supabase credentials
3. Check the console for error messages

### If dashboard doesn't show data:
1. Check browser console for errors
2. Verify Supabase connection
3. Check if RLS policies are correctly set up

### If real-time updates don't work:
1. Check if Supabase real-time is enabled in your project
2. Verify the subscription is properly set up
3. Check browser console for subscription errors

## Benefits

1. **Data Persistence**: No more data loss on logout
2. **User Isolation**: Each user only sees their own data
3. **Real-time Updates**: Dashboard updates automatically
4. **Scalability**: Can handle many users and analyses
5. **Security**: Row Level Security ensures data privacy
6. **Performance**: Faster data loading and updates

## Next Steps

After setup, your dashboard will:
- ✅ Show all user analyses persistently
- ✅ Update in real-time when new analyses are added
- ✅ Maintain data across user sessions
- ✅ Provide better user experience

The resume analyzer and job search features remain unchanged and continue to work as before.
