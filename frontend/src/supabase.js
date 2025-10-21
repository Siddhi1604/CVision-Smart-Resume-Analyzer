import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = 'https://nbxpgcnkbhtkxwjeqvor.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ieHBnY25rYmh0a3h3amVxdm9yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEwNDk1NjksImV4cCI6MjA3NjYyNTU2OX0.FTXqMoMVEfDkZPM_NWjDDliWADa2-QoxuYPHhpGSVsA';

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper function to get user analyses with real-time updates
export const getUserAnalyses = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('resume_analyses')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching user analyses:', error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Failed to fetch user analyses:', error);
    throw error;
  }
};

// Helper function to subscribe to real-time updates
export const subscribeToUserAnalyses = (userId, callback) => {
  const subscription = supabase
    .channel('resume_analyses_changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'resume_analyses',
        filter: `user_id=eq.${userId}`
      },
      (payload) => {
        console.log('🔄 Real-time update received:', payload);
        callback(payload);
      }
    )
    .subscribe();

  return subscription;
};

export default supabase;
