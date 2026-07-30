/** @type {import('@supabase/supabase-js')} */
const supabase = window.supabase;

export const createClient = supabase.createClient;
export default supabase;
