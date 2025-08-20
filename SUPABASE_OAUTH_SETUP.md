# Supabase OAuth Provider Setup Guide

## Issue: Google/GitHub login redirects to homepage instead of dashboard

This guide will help you configure OAuth providers in Supabase to fix the redirect issue.

## Required Supabase Dashboard Configuration

### 1. Authentication > URL Configuration

**Site URL:**
- Local Development: `http://localhost:3000`
- Production: Your production domain (e.g., `https://yourdomain.com`)

**Redirect URLs:**
Add these exact URLs to the redirect URLs list:

```
http://localhost:3000/auth/callback
http://localhost:3000/auth/callback?next=/dashboard
https://yourdomain.com/auth/callback
https://yourdomain.com/auth/callback?next=/dashboard
```

**Important:** The redirect URLs must match EXACTLY, including query parameters.

### 2. Authentication > Providers

#### Google OAuth Setup

1. **Enable Google provider**
2. **Client ID:** Your Google OAuth 2.0 Client ID
3. **Client Secret:** Your Google OAuth 2.0 Client Secret
4. **Authorized redirect URI:** `https://your-supabase-project.supabase.co/auth/v1/callback`

#### GitHub OAuth Setup

1. **Enable GitHub provider**
2. **Client ID:** Your GitHub OAuth App Client ID
3. **Client Secret:** Your GitHub OAuth App Client Secret
4. **Authorized redirect URI:** `https://your-supabase-project.supabase.co/auth/v1/callback`

## Google OAuth App Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to Credentials > Create Credentials > OAuth 2.0 Client IDs
5. Set Application type to "Web application"
6. Add authorized redirect URIs:
   - `https://your-supabase-project.supabase.co/auth/v1/callback`
7. Copy Client ID and Client Secret to Supabase

## GitHub OAuth App Setup

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Fill in application details:
   - **Application name:** TalentoAI
   - **Homepage URL:** `http://localhost:3000` (for local dev)
   - **Authorization callback URL:** `https://your-supabase-project.supabase.co/auth/v1/callback`
4. Copy Client ID and Client Secret to Supabase

## Testing the Configuration

1. **Start your development server:**
   ```bash
   npm run dev
   ```

2. **Visit the test page:**
   ```
   http://localhost:3000/test-auth
   ```

3. **Check configuration status:**
   - Verify all environment variables are set
   - Check Supabase connection
   - Verify OAuth providers are enabled

4. **Test OAuth flow:**
   - Click Google or GitHub login buttons
   - Complete the OAuth flow
   - Check if you're redirected to `/dashboard` or `/onboarding`

## Common Issues and Solutions

### Issue: "Invalid redirect URI" error
**Solution:** Ensure the redirect URI in your OAuth app matches exactly with what's in Supabase

### Issue: OAuth provider not working
**Solution:** 
- Check if provider is enabled in Supabase
- Verify Client ID and Secret are correct
- Ensure redirect URIs are properly configured

### Issue: Still redirecting to homepage
**Solution:**
- Check browser console for errors
- Verify auth callback route is working
- Check if session cookies are being set
- Ensure middleware is not interfering

## Debug Endpoints

- **Configuration Check:** `/api/check-config`
- **Authentication Debug:** `/api/debug-auth`
- **Test Page:** `/test-auth`

## Environment Variables

Ensure these are set in your `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Final Steps

1. Configure OAuth providers in Supabase dashboard
2. Set up OAuth apps in Google/GitHub
3. Test the authentication flow
4. Check browser console and network tab for errors
5. Verify redirects are working correctly

If issues persist, check the browser console for specific error messages and verify all configuration steps have been completed.
