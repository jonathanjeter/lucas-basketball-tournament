import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'http://localhost:8001'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0'

console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Key:', supabaseAnonKey);

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false
  },
  global: {
    headers: {
      'X-Client-Info': 'supabase-js/2.0.0'
    }
  }
});

// Test database connection
export const testConnection = async () => {
  try {
    const { data, error } = await supabase.from('teams').select('count').limit(1);
    if (error) {
      console.error('Database connection failed:', error);
      return false;
    }
    console.log('Database connection successful');
    return true;
  } catch (err) {
    console.error('Database connection error:', err);
    return false;
  }
};

// Test storage connection
export const testStorage = async () => {
  try {
    const { data, error } = await supabase.storage.listBuckets();
    if (error) {
      console.error('Storage connection failed:', error);
      return false;
    }
    console.log('Storage buckets:', data);
    return true;
  } catch (err) {
    console.error('Storage connection error:', err);
    return false;
  }
};