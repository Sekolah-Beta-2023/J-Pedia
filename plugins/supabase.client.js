const { createClient } = require('@supabase/supabase-js')
const supabase = createClient(process.env.baseURL, process.env.apiKey)
export default supabase
