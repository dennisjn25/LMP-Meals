# 🎯 Database Seeding - Quick Start

## ⚡ One-Command Setup (RECOMMENDED)

Run this single command to seed everything your website needs:

```bash
npm run seed-master
```

This will automatically:
1. ✅ Check database connection
2. ✅ Seed 22 meals
3. ✅ Seed 6 users (2 admins + 4 test customers)
4. ✅ Seed 6 employees
5. ✅ Display admin credentials
6. ✅ Show before/after statistics

---

## 🔐 Admin Login Credentials

After seeding, log in with:

**Justin Dowd (Owner & CEO)**
- Email: `admin@lmpmeals.com`
- Password: `LMP2024Admin!`

**Josh Dennis (COO)**
- Email: `josh@lmpmeals.com`
- Password: `LMP2024COO!`

⚠️ **Change these passwords immediately after first login!**

---

## ✅ Verify Everything Works

```bash
npm run validate-db
```

This checks:
- ✅ Admin users exist
- ✅ Meals are available
- ✅ Employees are active
- ✅ Database integrity

---

## 🔧 Alternative Commands

If you prefer to seed step-by-step:

```bash
# Step 1: Seed meals
npm run seed-meals

# Step 2: Seed users
npm run seed-customers

# Step 3: Seed employees
npm run seed-employees

# Validate
npm run validate-db
```

---

## 📊 What Gets Seeded

### Meals (22 total)
- 5 Featured meals (shown on homepage)
- 17 Regular meals
- Categories: High Protein, Balanced, Low Carb
- All with images, macros, and pricing

### Users (6 total)
- **2 Admin accounts** (Justin Dowd, Josh Dennis)
- **4 Test customers** (for testing orders)

### Employees (6 total)
- Justin Dowd (Owner & CEO)
- Josh Dennis (COO)
- Maria Garcia (Head Chef)
- James Wilson (Delivery Driver)
- Lisa Anderson (Office Manager)
- Robert Martinez (Sous Chef)

---

## ⚠️ Troubleshooting

### Database Connection Error

If you see: `Authentication failed against database server`

**Fix:**
1. Check `.env.local` exists
2. Verify `DATABASE_URL` is correct
3. Get fresh credentials from Supabase
4. Ensure database is active

### Script Not Found

If you see: `Cannot find module`

**Fix:**
```bash
npm install
npx prisma generate
```

---

## 💡 Next Steps After Seeding

1. ✅ Run validation: `npm run validate-db`
2. ✅ Start dev server: `npm run dev`
3. ✅ Test admin login: http://localhost:3000/admin
4. ✅ Change default passwords
5. ✅ Test customer ordering flow
6. ✅ Configure payment gateway
7. ✅ Set up email service

---

## 📚 More Information

- **Complete Guide:** See `SEEDING_COMPLETE_GUIDE.md`
- **Admin Setup:** See `ADMIN_SEEDING_GUIDE.md`
- **Quick Reference:** See `ADMIN_CREDENTIALS.md`

---

**Ready to seed? Run:** `npm run seed-master`
