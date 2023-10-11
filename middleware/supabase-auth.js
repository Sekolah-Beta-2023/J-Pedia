const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(process.env.baseURL, process.env.apiKey)

export default async function ({ redirect }) {
  const { data, error } = await supabase.auth.getSession()
  if (error) {
    console.error(error)
  }
  if (!data.session) {
    redirect('/auth/login')
  }
}
