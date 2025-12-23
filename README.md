# Liberty Meal Prep System

This repository contains the complete software suite for Liberty Meal Prep.

## 📂 Project Structure

- **`/web`**: Next.js 14 Application containing:
  - Customer-facing E-commerce site (Home, Menu, Ordering)
  - Admin Backend Dashboard (Order Management, Analytics)
- **`/mobile`**: React Native (Expo) Application for:
  - Drivers (Delivery tracking)
  - Admins (On-the-go management)

## 🚀 Getting Started

### Web Application
1. Navigate to the web directory:
   ```bash
   cd web
   ```
2. Install dependencies (if not already done):
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000)

### Mobile Application
1. Navigate to the mobile directory:
   ```bash
   cd mobile
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Expo server:
   ```bash
   npx expo start
   ```
4. Scan the QR code with your phone (Expo Go app) or press `w` for web preview.

## 🔑 Demo Accounts
- **User Portal**: Just click "Start Order" or login as user.
- **Admin Portal**: On the login page, check "Demo: Login as Admin".

## 🛠 Features Implemented

### ✅ Customer Features
- **Premium UI/UX**: Modern glassmorphism design with animated logo backgrounds
- **Menu System**: Filterable weekly menu with meal cards
- **Shopping Cart**: Sidebar cart with quantity controls
- **Checkout Flow**: Multi-step checkout with order confirmation
- **Email Notifications**: Automated order confirmation emails
- **Contact Form**: Functional contact form with email integration

### ✅ Admin Features
- **Admin Dashboard**: Real-time stats and order management
- **Meal Manager**: Add, edit, and manage menu items
- **Order Management**: View and update order statuses
- **Authentication**: Secure admin login system

### ✅ Technical Features
- **Gmail SMTP Integration**: Send emails via company Gmail account
- **Order Number Generation**: Unique order identifiers (LMP-XXX)
- **Database**: SQLite with Prisma ORM
- **Authentication**: NextAuth.js for secure login
- **Responsive Design**: Mobile-friendly across all pages

## 📧 Email System Setup

**IMPORTANT**: Before using the contact form or checkout, configure Gmail SMTP:

1. See detailed instructions in `/web/GMAIL_SETUP.md`
2. Add to your `/web/.env` file:
   ```env
   GMAIL_USER="your-company-email@gmail.com"
   GMAIL_APP_PASSWORD="your-16-char-app-password"
   ```
3. Get App Password from: https://myaccount.google.com/apppasswords

## 🛒 Checkout System

The checkout flow is fully implemented! See `/web/CHECKOUT_IMPLEMENTATION.md` for details.

**To activate:**
```bash
cd web
npx prisma db push  # Apply database schema changes
npm run dev         # Restart server
```

## 📚 Documentation

- **`/web/GMAIL_SETUP.md`** - Gmail SMTP configuration guide
- **`/web/EMAIL_IMPLEMENTATION.md`** - Email system overview
- **`/web/CHECKOUT_IMPLEMENTATION.md`** - Checkout flow documentation
- **`/web/README.md`** - Web app specific instructions

