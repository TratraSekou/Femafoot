import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Fallback to placeholder values if env variables are missing (e.g., during build time on Vercel)
// to prevent createClient from throwing a fatal "supabaseUrl is required" error.
const activeUrl = supabaseUrl || 'https://placeholder-url.supabase.co';
const activeKey = supabaseAnonKey || 'placeholder-key';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase credentials missing in environment variables! Using placeholder for build time.");
}

export const supabase = createClient<Database>(activeUrl, activeKey);
