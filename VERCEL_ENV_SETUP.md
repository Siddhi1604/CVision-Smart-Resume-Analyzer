# Vercel Environment Variables Setup

## Required Environment Variables

Add these environment variables in your Vercel dashboard:

### Backend Environment Variables

Go to your Vercel project → Settings → Environment Variables and add:

```
SUPABASE_URL=https://nbxpgcnkbhtkxwjeqvor.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ieHBnY25rYmh0a3h3amVxdm9yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEwNDk1NjksImV4cCI6MjA3NjYyNTU2OX0.FTXqMoMVEfDkZPM_NWjDDliWADa2-QoxuYPHhpGSVsA
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ieHBnY25rYmh0a3h3amVxdm9yIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTA0OTU2OSwiZXhwIjoyMDc2NjI1NTY5fQ.fOOyX3lWOKeTyAXi7Z-EBv_1A0Pq8_kWanwH9RpnRGU
```

### Frontend Environment Variables (Optional)

If you want to use environment variables for the frontend as well:

```
REACT_APP_SUPABASE_URL=https://nbxpgcnkbhtkxwjeqvor.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ieHBnY25rYmh0a3h3amVxdm9yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEwNDk1NjksImV4cCI6MjA3NjYyNTU2OX0.FTXqMoMVEfDkZPM_NWjDDliWADa2-QoxuYPHhpGSVsA
```

## How to Add Environment Variables in Vercel

1. Go to your Vercel dashboard
2. Select your project
3. Go to **Settings** tab
4. Click on **Environment Variables** in the left sidebar
5. Add each variable with:
   - **Name**: The variable name (e.g., `SUPABASE_URL`)
   - **Value**: The variable value
   - **Environment**: Select all environments (Production, Preview, Development)

## Fallback Behavior

If Supabase environment variables are not set, the application will:
- ✅ **Still work** - All existing features continue to function
- ✅ **Use fallback storage** - Resume analyses stored in temporary files
- ✅ **No errors** - Graceful degradation without breaking the app
- ✅ **Dashboard works** - Users can still see their analyses

## Benefits of Setting Environment Variables

With environment variables properly configured:
- ✅ **Persistent Storage** - Data survives serverless function restarts
- ✅ **Real-time Updates** - Dashboard updates automatically
- ✅ **User Data Isolation** - Each user only sees their own data
- ✅ **Better Performance** - Faster data loading from Supabase

## Testing

After adding environment variables:
1. Redeploy your Vercel project
2. Test the resume analyzer
3. Test the job search
4. Check the dashboard for data persistence
5. Verify real-time updates work

The application will work with or without these environment variables, but setting them up provides the full Supabase experience.
