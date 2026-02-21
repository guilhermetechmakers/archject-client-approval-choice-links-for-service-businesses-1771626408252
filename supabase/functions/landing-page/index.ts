import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

interface LandingPageConfig {
  title: string
  description?: string
  status: string
}

const DEFAULT_CONFIG: LandingPageConfig = {
  title: 'Archject',
  description: 'Client approvals, simplified',
  status: 'active',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''

    if (!supabaseUrl || !supabaseServiceKey) {
      return new Response(JSON.stringify(DEFAULT_CONFIG), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const { data: rows, error } = await supabase
      .from('landing_page')
      .select('title, description, status')
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(1)

    if (error || !rows?.length) {
      return new Response(JSON.stringify(DEFAULT_CONFIG), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const row = rows[0]
    const config: LandingPageConfig = {
      title: row.title ?? DEFAULT_CONFIG.title,
      description: row.description ?? DEFAULT_CONFIG.description,
      status: row.status ?? DEFAULT_CONFIG.status,
    }

    return new Response(JSON.stringify(config), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(
      JSON.stringify(DEFAULT_CONFIG),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
