/** @type {import('@supabase/supabase-js')} */
const supabase = globalThis.supabase;

export const createClient = supabase.createClient;
export default supabase;
