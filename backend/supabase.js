const SUPABASE_URL = "https://cgwekujxfuchknkjblhs.supabase.co";
const SUPABASE_KEY = "sb_publishable_DoupEw-11nk13FQ2z5Rozg_nOPDgcoc";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

console.log("RoadLens Supabase connected:", supabaseClient);