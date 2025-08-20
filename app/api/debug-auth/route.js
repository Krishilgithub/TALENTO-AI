import { NextResponse } from 'next/server';
import { createClientForServer } from '@/utils/supabase/server';

export async function GET(request) {
  try {
    const supabase = await createClientForServer();
    
    // Get current session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    // Get all cookies
    const cookies = request.cookies.getAll();
    
    return NextResponse.json({
      success: true,
      session: session ? {
        access_token: session.access_token ? 'present' : 'missing',
        refresh_token: session.refresh_token ? 'present' : 'missing',
        expires_at: session.expires_at,
        user_id: session.user?.id,
        email: session.user?.email,
        email_confirmed_at: session.user?.email_confirmed_at,
        onboarded: session.user?.user_metadata?.onboarded,
      } : null,
      user: user ? {
        id: user.id,
        email: user.email,
        email_confirmed_at: user.email_confirmed_at,
        onboarded: user.user_metadata?.onboarded,
        metadata: user.user_metadata,
      } : null,
      errors: {
        session: sessionError?.message,
        user: userError?.message,
      },
      cookies: cookies.map(cookie => ({
        name: cookie.name,
        value: cookie.value ? 'present' : 'missing',
      })),
      environment: {
        node_env: process.env.NODE_ENV,
        supabase_url: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'set' : 'missing',
        supabase_anon_key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'set' : 'missing',
      }
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack,
    }, { status: 500 });
  }
}
