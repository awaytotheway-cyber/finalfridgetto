import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Check .env for VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export type SavedRecipe = {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  cuisine: string | null;
  prep_time_minutes: number | null;
  cook_time_minutes: number | null;
  servings: number | null;
  ingredients: string[];
  essential_ingredients: string[] | null;
  replaceable_ingredients: string[] | null;
  substitutions: { original: string; substitute: string }[] | null;
  steps: string[];
  macros: { protein: number; carbs: number; fat: number; calories: number } | null;
  source: string;
  created_at: string;
};
