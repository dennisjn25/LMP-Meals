# Google OAuth Setup Guide

## Error: "Error 401: invalid_client"

This error occurs when the Google OAuth credentials are missing or incorrect.

## Solution: Set Up Google OAuth

### Step 1: Create Google OAuth Credentials

1. **Go to Google Cloud Console:**
   - Visit: https://console.cloud.google.com/

2. **Create or Select a Project:**
   - Click on the project dropdown at the top
   - Create a new project or select existing "LMP Meals" project

3. **Enable Google+ API:**
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API"
   - Click "Enable"

4. **Create OAuth Credentials:**
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - If prompted, configure the OAuth consent screen first

5. **Configure OAuth Consent Screen:**
   - User Type: External
   - App name: "LMP Meals"
   - User support email: your email
   - Developer contact: your email
   - Add scopes: email, profile, openid
   - Add test users if in testing mode

6. **Create OAuth Client ID:**
   - Application type: **Web application**
   - Name: "LMP Meals Web App"
   
   **Authorized JavaScript origins:**
   - `http://localhost:3000` (for development)
   - `https://www.lmpmeals.com` (for production)
   
   **Authorized redirect URIs:**
   - `http://localhost:3000/api/auth/callback/google` (for development)
   - `https://www.lmpmeals.com/api/auth/callback/google` (for production)

7. **Copy Credentials:**
   - You'll get a **Client ID** and **Client Secret**
   - Keep these safe!

### Step 2: Add to Environment Variables

#### **Local Development (.env.local):**
```env
GOOGLE_CLIENT_ID=your-client-id-here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret-here
```

#### **Vercel Production:**
1. Go to your Vercel project dashboard
2. Settings > Environment Variables
3. Add:
   - `GOOGLE_CLIENT_ID` = your client ID
   - `GOOGLE_CLIENT_SECRET` = your client secret
4. Make sure they're set for "Production" environment
5. Redeploy your application

### Step 3: Verify Setup

1. **Test Locally:**
   - Restart your dev server: `npm run dev`
   - Go to login page
   - Click "Sign in with Google"
   - Should redirect to Google login

2. **Test Production:**
   - After deploying to Vercel
   - Go to https://www.lmpmeals.com/auth/login
   - Click "Sign in with Google"
   - Should work without errors

## Common Issues

### Issue 1: "redirect_uri_mismatch"
**Solution:** Make sure the redirect URI in Google Console exactly matches:
- Development: `http://localhost:3000/api/auth/callback/google`
- Production: `https://www.lmpmeals.com/api/auth/callback/google`

### Issue 2: "invalid_client"
**Solution:** 
- Double-check Client ID and Client Secret are correct
- Make sure there are no extra spaces
- Verify environment variables are set in Vercel

### Issue 3: "Access blocked: This app's request is invalid"
**Solution:**
- Make sure OAuth consent screen is configured
- Add your email as a test user if app is in testing mode
- Verify authorized domains include lmpmeals.com

## Security Notes

- **Never commit** `.env.local` to git
- Keep Client Secret secure
- Rotate credentials if compromised
- Use different credentials for development and production (recommended)

## Testing

After setup, test the flow:
1. Click "Sign in with Google"
2. Select your Google account
3. Grant permissions
4. Should redirect back to your app
5. User should be logged in

## Need Help?

If you're still getting errors:
1. Check browser console for detailed error messages
2. Check Vercel deployment logs
3. Verify all redirect URIs are correct
4. Make sure OAuth consent screen is published (if needed)
