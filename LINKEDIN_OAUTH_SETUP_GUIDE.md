# 🔗 LinkedIn OAuth Setup Guide for Talento AI

## 🚨 **Why LinkedIn Integration Isn't Working**

You're getting a "LinkedIn Client ID not configured" error because the LinkedIn OAuth credentials are missing from your environment variables.

## 📋 **Step-by-Step Setup Instructions**

### **Step 1: Create LinkedIn App**

1. **Go to LinkedIn Developer Portal**

   - Visit: https://www.linkedin.com/developers/
   - Sign in with your LinkedIn account

2. **Create a New App**

   - Click "Create App"
   - Fill in the required information:
     - **App Name**: `Talento AI` (or any name you prefer)
     - **LinkedIn Page**: You'll need to create or select a LinkedIn company page
     - **App Logo**: Upload your Talento AI logo
     - **Legal Agreement**: Check the box to agree

3. **Configure App Settings**
   - After creating the app, go to the "Auth" tab
   - Add authorized redirect URLs:
     ```
     http://localhost:3000/auth/linkedin/callback
     ```
   - Request the following scopes:
     - `r_liteprofile` (to read profile info)
     - `w_member_social` (to post content)

### **Step 2: Get Your Credentials**

1. **Copy Client Credentials**

   - From the "Auth" tab, copy:
     - **Client ID** (shown at the top)
     - **Client Secret** (click "Show" to reveal)

2. **Update Your .env File**
   - Open your `.env` file
   - Replace the empty values:
   ```env
   LINKEDIN_CLIENT_ID="your_client_id_here"
   LINKEDIN_CLIENT_SECRET="your_client_secret_here"
   LINKEDIN_REDIRECT_URI="http://localhost:3000/auth/linkedin/callback"
   ```

### **Step 3: Verify Setup**

1. **Restart Your FastAPI Server**

   ```bash
   # Stop the current server (Ctrl+C)
   # Then restart:
   cd "Models\Assessment models"
   python assessment_api.py
   ```

2. **Test LinkedIn Connection**
   - Go to your app: http://localhost:3000/dashboard?tab=linkedin-post-generator
   - Click "Connect LinkedIn Account"
   - You should be redirected to LinkedIn for authorization

## 🔧 **Common Issues & Solutions**

### **Issue 1: "Redirect URI Mismatch"**

- **Solution**: Make sure the redirect URI in your LinkedIn app matches exactly:
  ```
  http://localhost:3000/auth/linkedin/callback
  ```

### **Issue 2: "Insufficient Permissions"**

- **Solution**: Ensure your LinkedIn app has the following products enabled:
  - Sign In with LinkedIn
  - Share on LinkedIn

### **Issue 3: "App Not Verified"**

- **Solution**: For development, this is normal. For production, you'll need to verify your app with LinkedIn.

## 📱 **LinkedIn App Configuration Checklist**

- ✅ App created on LinkedIn Developer Portal
- ✅ Company page associated (required)
- ✅ Redirect URI added: `http://localhost:3000/auth/linkedin/callback`
- ✅ Scopes requested: `r_liteprofile`, `w_member_social`
- ✅ Client ID and Secret copied to .env
- ✅ FastAPI server restarted

## 🚀 **After Setup**

Once configured, you'll be able to:

1. **Connect your LinkedIn account** from the dashboard
2. **Generate AI-powered posts** using the post generator
3. **Post directly to LinkedIn** from the Talento AI interface
4. **Manage your professional content** efficiently

## 🆘 **Need Help?**

If you encounter any issues:

1. Check that all environment variables are set correctly
2. Verify your LinkedIn app configuration
3. Ensure your redirect URI matches exactly
4. Try restarting both the FastAPI server and Next.js app

## 🔒 **Security Notes**

- Never commit your LinkedIn credentials to version control
- Keep your Client Secret secure
- For production, use HTTPS redirect URIs
- Consider using environment-specific credentials

---

**📧 Contact**: If you need further assistance with LinkedIn integration, please refer to this guide first, then reach out with specific error messages.
