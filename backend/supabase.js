const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = 'https://nbxpgcnkbhtkxwjeqvor.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ieHBnY25rYmh0a3h3amVxdm9yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEwNDk1NjksImV4cCI6MjA3NjYyNTU2OX0.FTXqMoMVEfDkZPM_NWjDDliWADa2-QoxuYPHhpGSVsA';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ieHBnY25rYmh0a3h3amVxdm9yIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTA0OTU2OSwiZXhwIjoyMDc2NjI1NTY5fQ.fOOyX3lWOKeTyAXi7Z-EBv_1A0Pq8_kWanwH9RpnRGU';

// Create Supabase client for server-side operations (uses service key)
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Create Supabase client for client-side operations (uses anon key)
const supabaseAnon = createClient(supabaseUrl, supabaseAnonKey);

module.exports = {
  supabase,
  supabaseAnon,
  supabaseUrl,
  supabaseAnonKey
};
