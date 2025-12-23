# Database (PostgreSQL)
# Format: postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public
# Example (Vercel/Supabase): postgresql://postgres:password@db.project.supabase.co:5432/postgres
DATABASE_URL="postgresql://user:password@localhost:5432/libertymealprep"

# NextAuth Configuration
NEXTAUTH_SECRET="your-secret-key-here-generate-with-openssl-rand-base64-32"
NEXTAUTH_URL="http://localhost:3000"

# Email Configuration (Gmail)
# To get a Gmail App Password:
# 1. Go to your Google Account settings
# 2. Enable 2-Step Verification
# 3. Go to Security > 2-Step Verification > App passwords
# 4. Generate a new app password for "Mail"
GMAIL_USER="your-email@gmail.com"
GMAIL_APP_PASSWORD="your-app-password-here"

# Development Only - Skip Authentication (NEVER use in production!)
# Uncomment the line below to bypass admin authentication for testing
# SKIP_AUTH=true
