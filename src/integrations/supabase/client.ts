// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://xtvqbwmrqijzazvsqvzl.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh0dnFid21ycWlqemF6dnNxdnpsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc3NjgyMzQsImV4cCI6MjA2MzM0NDIzNH0.VB8dPx1psyclvTOhh9SGb8hdSeEH0QMvN9TxhnZQviE";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);