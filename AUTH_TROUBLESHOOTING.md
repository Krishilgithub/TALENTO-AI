# Authentication Troubleshooting Guide

## Issue: Google/GitHub login redirects to homepage instead of dashboard

### Root Cause
The issue is likely caused by one or more of the following:
1. Session cookies not being properly set after OAuth callback
2. Middleware interfering with authentication flow
3. Supabase configuration issues
4. Environment variable configuration problems

### Solutions Applied

#### 1. Updated Auth Callback Route (`/app/auth/callback/route.js`)
- Simplified session handling
- Removed manual cookie setting that could interfere with Supabase's built-in session management
- Added proper error handling and redirect logic

#### 2. Updated Middleware (`/middleware.js`)
- Added skip routes for auth-related paths to prevent redirect loops
- Improved session validation logic
- Added automatic redirect from homepage to dashboard for authenticated users

#### 3. Updated Supabase Client Configuration
- Added proper auth configuration options
- Enabled PKCE flow for better security
- Added session persistence and auto-refresh

#### 4. Created Debug Tools
- `/api/debug-auth` - API endpoint to check authentication status
- `/test-auth` - Test page to verify authentication flow

### Required Environment Variables

Make sure these environment variables are set in your `.env.local` file:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000  # for local development
```

### Supabase Dashboard Configuration

1. **Authentication > URL Configuration**
   - Site URL: `http://localhost:3000` (for local development)
   - Redirect URLs: 
     - `http://localhost:3000/auth/callback`
     - `http://localhost:3000/auth/callback?next=/dashboard`
     - Your production domain equivalents

2. **Authentication > Providers**
   - Google: Ensure OAuth client ID and secret are configured
   - GitHub: Ensure OAuth app client ID and secret are configured

### Testing Steps

1. **Test Authentication Flow**
   - Visit `/test-auth` to test the authentication flow
   - Check `/api/debug-auth` to see current authentication status

2. **Check Browser Console**
   - Look for any JavaScript errors during authentication
   - Check Network tab for failed requests

3. **Check Cookies**
   - Verify that Supabase session cookies are being set
   - Look for `sb-access-token` and `sb-refresh-token` cookies

### Common Issues and Fixes

#### Issue: Session not persisting
- **Fix**: Ensure `persistSession: true` is set in Supabase client config
- **Fix**: Check that cookies are being set with proper domain and path

#### Issue: Redirect loops
- **Fix**: Ensure middleware skips auth-related routes
- **Fix**: Check that redirect URLs are properly configured in Supabase

#### Issue: OAuth providers not working
- **Fix**: Verify OAuth credentials in Supabase dashboard
- **Fix**: Check redirect URLs match exactly (including query parameters)

### Debug Commands

```bash
# Check environment variables
echo $NEXT_PUBLIC_SUPABASE_URL
echo $NEXT_PUBLIC_SUPABASE_ANON_KEY

# Test API endpoint
curl http://localhost:3000/api/debug-auth

# Check for any build errors
npm run build
```

### Additional Notes

- The authentication flow now uses PKCE (Proof Key for Code Exchange) for better security
- Session cookies are automatically managed by Supabase
- Middleware automatically redirects authenticated users from homepage to dashboard
- OAuth callbacks include the `next=/dashboard` parameter to ensure proper redirects

If issues persist, check the browser console and network tab for specific error messages, and verify that all environment variables are properly set.
