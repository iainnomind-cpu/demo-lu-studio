import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

const isValidUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
};

if (!isValidUrl(supabaseUrl)) {
  console.warn('⚠️ La URL de Supabase es inválida o falta en .env.local. Usando un cliente falso para evitar crasheos.');
}

// Provide a dummy URL if invalid to prevent the entire app from crashing,
// it will fail on network requests instead of app initialization.
export const supabase = createClient(
  isValidUrl(supabaseUrl) ? supabaseUrl : 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder'
);
