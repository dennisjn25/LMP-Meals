# Gmail Email Setup Guide

This guide will help you configure Gmail SMTP for sending emails from the Liberty Meal Prep website.

## 📧 Required Environment Variables

Add these variables to your `.env` file in the `/web` directory:

```env
GMAIL_USER="your-company-email@gmail.com"
GMAIL_APP_PASSWORD="your-16-character-app-password"
```

## 🔐 How to Get a Gmail App Password

**IMPORTANT:** You CANNOT use your regular Gmail password. You must create an App Password.

### Step-by-Step Instructions:

1. **Enable 2-Step Verification** (if not already enabled)
   - Go to: https://myaccount.google.com/security
   - Find "2-Step Verification" and turn it ON
   - Follow the prompts to set it up

2. **Create an App Password**
   - Go to: https://myaccount.google.com/apppasswords
   - You may need to sign in again
   - Select app: **Mail**
   - Select device: **Other (Custom name)**
   - Enter a name like: "Liberty Meal Prep Website"
   - Click **Generate**

3. **Copy the 16-Character Password**
   - Google will show you a 16-character password (e.g., `abcd efgh ijkl mnop`)
   - Copy this password (you can remove the spaces)
   - Paste it into your `.env` file as `GMAIL_APP_PASSWORD`

4. **Update Your .env File**
   ```env
   GMAIL_USER="justin@lmpmeals.com"
   GMAIL_APP_PASSWORD="abcdefghijklmnop"
   ```

## 📝 Example .env File

Your complete `.env` file should look like this:

```env
# Database
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Gmail SMTP Configuration
GMAIL_USER="justin@lmpmeals.com"
GMAIL_APP_PASSWORD="abcdefghijklmnop"
```

## ✅ Testing the Email System

After setting up your environment variables:

1. Restart your development server:
   ```bash
   npm run dev
   ```

2. Visit the contact page: http://localhost:3000/contact

3. Fill out and submit the contact form

4. Check your Gmail inbox for the message

## 🔧 Troubleshooting

### "Invalid login" error
- Make sure you're using an App Password, not your regular password
- Verify 2-Step Verification is enabled on your Google account
- Check that there are no extra spaces in your App Password

### "Connection timeout" error
- Check your internet connection
- Verify the Gmail SMTP service is not blocked by your firewall
- Try using a different network

### Emails not arriving
- Check your spam/junk folder
- Verify the `GMAIL_USER` email address is correct
- Make sure the App Password hasn't been revoked

## 📨 Email Features Implemented

### Contact Form
- Sends customer inquiries to your Gmail inbox
- Includes customer name, email, and message
- Reply-to is set to customer's email for easy responses
- Professional HTML email template

### Order Confirmations (Ready for future use)
- Sends order confirmation to customers
- Includes order number, details, and delivery information
- Professional branded email template

## 🔒 Security Notes

- Never commit your `.env` file to Git (it's already in `.gitignore`)
- Keep your App Password secure
- You can revoke App Passwords at any time from your Google Account settings
- Each App Password is unique to one application

## 📞 Support

If you encounter issues, check the server console for detailed error messages.
