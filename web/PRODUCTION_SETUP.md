# 🚀 Production Setup Guide

You are now ready to launch! This guide will help you move from your local development environment to a production-ready setup using a real database and hosting provider.

## 1. Get a Production Database (PostgreSQL)

You cannot use SQLite (current setup) in production. We recommend **Supabase** or **Vercel Postgres** (easiest if deploying to Vercel).

### Option A: Vercel Postgres (Recommended) / Supabase
1. Create a project on [Supabase](https://supabase.com) or Vercel.
2. Go to **Settings > Database** and copy the **Connection String** (URI).
   - It looks like: `postgresql://postgres:[PASSWORD]@db.xxxx.supabase.co:5432/postgres`
   - **Important**: Make sure to use the "Transaction Mode" (Port 6543) if available, or "Session Mode" (Port 5432).

## 2. Update Environment Variables

1. Open your `.env` file (locally) and update `DATABASE_URL` with your new connection string.
   ```env
   DATABASE_URL="postgresql://postgres:yourpassword@db.project.supabase.co:5432/postgres"
   ```
2. **Setup Production Environment Secrets** (on your hosting dashboard, e.g., Vercel):
   - `DATABASE_URL`
   - `NEXTAUTH_SECRET` (generate a new long random string)
   - `NEXTAUTH_URL` (set to your domain, e.g., `https://libertymealprep.com`)
   - `GMAIL_USER` & `GMAIL_APP_PASSWORD`
   - `SQUARE_ACCESS_TOKEN` & `SQUARE_LOCATION_ID`

## 3. Initialize the Database

Once your `.env` is pointing to the new Postgres database:

1. **Push the Schema**:
   This creates the tables in your new database.
   ```bash
   npx prisma db push
   ```

2. **Seed Initial Data**:
   Populate the database with your meals.
   ```bash
   npm run seed-meals
   ```
   *(Note: This uses `scripts/seed-meals.ts`. Ensure this script contains the latest meal data you want.)*

## 4. Deploy to Vercel

1. Install Vercel CLI (optional) or connect your GitHub repository to Vercel.
2. Allow Vercel to detect Next.js.
3. Add the Environment Variables in the Vercel Project Settings.
4. Deploy!

## 5. Verify

- Visit your live URL.
- Check the **Menu** page to see if meals loaded.
- Try **Logging in** (Admin account might need to be recreated manually or via seed).
- Test **Checkout** (Square Sandbox or Live mode depending on your keys).

---

## ⚠️ Important Notes

- **Admin Account**: Your local admin account is in the SQLite file. You will need to sign up again on the production site, then manually update your role to `ADMIN` in the database (via Supabase Table Editor or Prisma Studio) or add a seed script for the admin user.
- **Images**: Ensure all images referenced in your seed data are available in the `public` folder or hosted externally.
