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
      // Try to get the user's email and email_confirmed_at from the session
      let email = null;
      let emailConfirmedAt = null;
      let onboarded = false;
      if (data && data.session && data.session.user) {
        email = data.session.user.email;
        emailConfirmedAt = data.session.user.email_confirmed_at;
        onboarded = data.session.user.user_metadata?.onboarded === true;
      }
      const forwardedHost = request.headers.get('x-forwarded-host');
      const isLocalEnv = process.env.NODE_ENV === 'development';
      let redirectUrl;
      // If a safe "next" path is provided, honor it to control post-login redirect
      const safeNext = typeof next === 'string' && next.startsWith('/') ? next : null;
      if (safeNext) {
        redirectUrl = safeNext;
      } else if (emailConfirmedAt) {
        // Social login or already verified user
        redirectUrl = onboarded ? '/dashboard' : '/onboarding';
      } else {
        // Needs OTP verification
        redirectUrl = email ? `/verify-otp?email=${encodeURIComponent(email)}` : '/verify-otp';
      }
      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${redirectUrl}`);
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${redirectUrl}`);
      } else {
        return NextResponse.redirect(`${origin}${redirectUrl}`);
      }
    }
  }

  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
