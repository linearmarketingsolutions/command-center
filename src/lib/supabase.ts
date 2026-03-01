import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dgacuyrjdbeackhzbhdt.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRnYWN1eXJqZGJlYWNraHpiaGR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIzMjk5ODcsImV4cCI6MjA4NzkwNTk4N30.-ibcYKrCa4SS8BuWLgx-TOwyU7JUsVfdADsS2SNaU-4'

export const supabase = createClient(supabaseUrl, supabaseKey)
