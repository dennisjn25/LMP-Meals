# 🚀 Quick Start Guide - Activate Checkout System

## ⚡ 3 Steps to Activate Everything

### Step 1: Configure Gmail SMTP (5 minutes)

**Get Your App Password:**
1. Go to: https://myaccount.google.com/security
2. Enable **2-Step Verification** (if not already on)
3. Go to: https://myaccount.google.com/apppasswords
4. Create password:
   - App: **Mail**
   - Device: **Other** → "Liberty Meal Prep"
5. **Copy the 16-character password**

**Update .env File:**
```bash
# Open /web/.env and add:
GMAIL_USER="your-company-email@gmail.com"
GMAIL_APP_PASSWORD="abcdefghijklmnop"
```

---

### Step 2: Update Database (1 minute)

**Stop your dev server** (Ctrl+C in terminal), then run:

```bash
cd web
npx prisma db push
```

When prompted "Are you sure?", type: **y**

This adds the new order fields (orderNumber, customerPhone, deliveryDate).

---

### Step 3: Restart Server (30 seconds)

```bash
npm run dev
```

Wait for "Ready" message, then visit: http://localhost:3000

---

## ✅ Test Everything

### Test Checkout:
1. Go to: http://localhost:3000/menu
2. Add meals to cart
3. Click "Checkout Now"
4. Fill out form
5. Submit order
6. Check your email! 📧

### Test Contact Form:
1. Go to: http://localhost:3000/contact
2. Fill out form
3. Submit
4. Check your email! 📧

---

## 🎉 You're Done!

Your Liberty Meal Prep website now has:
- ✅ Working checkout flow
- ✅ Order confirmation emails
- ✅ Contact form emails
- ✅ Order number generation
- ✅ Admin order management

---

## 📚 Need Help?

See detailed documentation:
- **GMAIL_SETUP.md** - Gmail configuration
- **CHECKOUT_IMPLEMENTATION.md** - Checkout details
- **IMPLEMENTATION_SUMMARY.md** - Complete overview

---

## 🐛 Troubleshooting

**TypeScript errors about `db.order`?**
→ Run `npx prisma db push` again

**Emails not sending?**
→ Check `.env` file has correct Gmail credentials

**Can't find .env file?**
→ Create it in `/web/.env` (same folder as package.json)

**Port 3000 in use?**
→ Server will use 3001 automatically

---

**Questions?** Check the documentation files in `/web/` folder!
