// This is a placeholder for server-side Supabase client (e.g. using @supabase/ssr)
// For now, it exports a skeleton as the user might need to install additional pkgs if using SSR client.

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export const supabaseServer = createClient(supabaseUrl, supabaseServiceKey);
