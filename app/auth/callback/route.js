import { NextResponse } from 'next/server';
import { createClientForServer } from '@/utils/supabase/server';

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/dashboard';

  if (code) {
    const supabase = await createClientForServer();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Try to get the user's email from the session
      let email = null;
      if (data && data.session && data.session.user && data.session.user.email) {
        email = data.session.user.email;
      }
      const forwardedHost = request.headers.get('x-forwarded-host');
      const isLocalEnv = process.env.NODE_ENV === 'development';
      const verifyOtpUrl = email ? `/verify-otp?email=${encodeURIComponent(email)}` : '/verify-otp';

      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${verifyOtpUrl}`);
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${verifyOtpUrl}`);
      } else {
        return NextResponse.redirect(`${origin}${verifyOtpUrl}`);
      }
    }
  }

  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
