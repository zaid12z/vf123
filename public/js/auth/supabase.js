import { createClient } from '@supabase/supabase-js';

// Get environment variables from meta tags
const supabaseUrl = document.querySelector('meta[name="supabase-url"]').content;
const supabaseKey = document.querySelector('meta[name="supabase-key"]').content;

export const supabase = createClient(supabaseUrl, supabaseKey);