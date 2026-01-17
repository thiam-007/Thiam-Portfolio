import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

let supabaseAdmin: ReturnType<typeof createClient> | null;

if (!supabaseUrl || !supabaseServiceKey || (supabaseUrl && supabaseUrl.includes('placeholder'))) {
    console.warn('⚠️  Supabase not configured - file upload features will be disabled');
    supabaseAdmin = null;
} else {
    supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
}

export { supabaseAdmin };
export default supabaseAdmin;
