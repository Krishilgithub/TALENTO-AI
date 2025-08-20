import { NextResponse } from 'next/server';
import { createClientForServer } from '@/utils/supabase/server';

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/dashboard';

  console.log('🔐 Auth callback triggered with code:', code ? 'present' : 'missing');

  if (code) {
    try {
      const supabase = await createClientForServer();
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);

      if (error) {
        console.error('❌ Auth callback error:', error);
        return NextResponse.redirect(`${origin}/auth/auth-code-error?error=${encodeURIComponent(error.message)}`);
      }

      if (data?.session) {
        // Get user information from the session
        const user = data.session.user;
        const emailConfirmedAt = user.email_confirmed_at;
        const onboarded = user.user_metadata?.onboarded === true;

        console.log('✅ User authenticated:', {
          id: user.id,
          email: user.email,
          emailConfirmed: !!emailConfirmedAt,
          onboarded: onboarded
        });

        // Determine redirect URL based on user status
        let redirectUrl;
        if (emailConfirmedAt) {
          // Social login or already verified user
          redirectUrl = onboarded ? '/dashboard' : '/onboarding';
        } else {
          // Needs OTP verification
          redirectUrl = user.email ? `/verify-otp?email=${encodeURIComponent(user.email)}` : '/verify-otp';
        }

        console.log('🎯 Redirecting to:', redirectUrl);

        // Handle different environments
        const forwardedHost = request.headers.get('x-forwarded-host');
        const isLocalEnv = process.env.NODE_ENV === 'development';
        
        let finalRedirectUrl;
        if (isLocalEnv) {
          finalRedirectUrl = `${origin}${redirectUrl}`;
        } else if (forwardedHost) {
          finalRedirectUrl = `https://${forwardedHost}${redirectUrl}`;
        } else {
          finalRedirectUrl = `${origin}${redirectUrl}`;
        }

        // Create response with redirect
        const response = NextResponse.redirect(finalRedirectUrl);
        
        // Ensure Supabase session cookies are properly set
        if (data.session.access_token) {
          response.cookies.set('sb-access-token', data.session.access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: '/',
          });
        }
        
        if (data.session.refresh_token) {
          response.cookies.set('sb-refresh-token', data.session.refresh_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 30, // 30 days
            path: '/',
          });
        }

        return response;
      } else {
        console.error('❌ No session data received');
        return NextResponse.redirect(`${origin}/auth/auth-code-error?error=no_session`);
      }
    } catch (error) {
      console.error('❌ Auth callback exception:', error);
      return NextResponse.redirect(`${origin}/auth/auth-code-error?error=${encodeURIComponent(error.message)}`);
    }
  }

  console.error('❌ No authorization code received');
  return NextResponse.redirect(`${origin}/auth/auth-code-error?error=no_code`);
}
