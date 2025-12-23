# 🌱 Complete Database Seeding Guide for Liberty Meal Prep

## ✅ Required Data for Website to Function

For the Liberty Meal Prep website to function correctly, you need the following data seeded:

### 1. **Meals** (CRITICAL - Required for orders)
- **Status:** ✅ Already configured in `scripts/meals-data.json`
- **Count:** 22 meals
- **Why needed:** Customers cannot place orders without meals
- **Command:** `npm run seed-meals`

### 2. **Admin Users** (CRITICAL - Required for admin panel)
- **Status:** ✅ Already configured in `scripts/seed-data/customers.json`
- **Count:** 2 admin users (Justin Dowd, Josh Dennis)
- **Why needed:** To access admin panel and manage the system
- **Command:** `npm run seed-customers`

### 3. **Employees** (IMPORTANT - Required for employee management)
- **Status:** ✅ Already configured in `scripts/seed-data/employees.json`
- **Count:** 6 employees (including 2 admins)
- **Why needed:** For employee management and delivery driver assignment
- **Command:** `npm run seed-employees`

### 4. **Test Customers** (OPTIONAL - For testing)
- **Status:** ✅ Included in `scripts/seed-data/customers.json`
- **Count:** 4 regular users
- **Why needed:** To test customer ordering flow
- **Command:** Already included in `npm run seed-customers`

### 5. **Sample Orders** (OPTIONAL - For testing)
- **Status:** ⚠️ Generated dynamically
- **Why needed:** To test order management, deliveries, and reporting
- **Command:** `npm run seed-comprehensive`

### 6. **Promo Codes** (OPTIONAL - For marketing)
- **Status:** ⚠️ Generated dynamically
- **Why needed:** To test discount functionality
- **Command:** `npm run seed-comprehensive` or create via admin panel

---

## 🚀 Quick Start - Minimum Required Seeding

To get the website functioning with the bare minimum:

```bash
# Step 1: Seed meals (REQUIRED)
npm run seed-meals

# Step 2: Seed admin users and customers (REQUIRED)
npm run seed-customers

# Step 3: Seed employees (IMPORTANT)
npm run seed-employees
```

**That's it!** Your website is now functional with:
- ✅ 22 meals available for ordering
- ✅ 2 admin accounts for management
- ✅ 6 employees in the system
- ✅ 4 test customer accounts

---

## 🎯 Recommended Seeding (Production-Ready)

For a production-ready setup with test data:

```bash
# Step 1: Seed meals
npm run seed-meals

# Step 2: Seed all basic data (customers + employees)
npm run seed-all

# Step 3: Validate everything is working
npm run validate-db
```

---

## 📦 Full Seeding (Development/Testing)

For a complete development environment with sample orders, deliveries, and routes:

```bash
# Step 1: Seed meals first
npm run seed-meals

# Step 2: Run comprehensive seeding (minimal config)
npm run seed-comprehensive

# Step 3: Validate
npm run validate-db
```

This will create:
- ✅ 10 customers (including 2 admins)
- ✅ 5 employees
- ✅ 22 meals
- ✅ 30 sample orders
- ✅ 20 deliveries
- ✅ 5 routes
- ✅ Promo codes
- ✅ Audit logs

---

## 📋 Seeding Order (Important!)

**Always seed in this order to maintain referential integrity:**

1. **Meals** - No dependencies
2. **Customers/Users** - No dependencies
3. **Employees** - No dependencies
4. **Promo Codes** - No dependencies
5. **Orders** - Depends on Users and Meals
6. **Deliveries** - Depends on Orders
7. **Routes** - Depends on Deliveries and Drivers
8. **Audit Logs** - Depends on Users and Entities

---

## 🔐 Default Credentials

### Admin Accounts

**Justin Dowd (Owner & CEO)**
- Email: `admin@lmpmeals.com`
- Password: `LMP2024Admin!`

**Josh Dennis (COO)**
- Email: `josh@lmpmeals.com`
- Password: `LMP2024COO!`

### Test Customer Accounts

All test customers use password: `Customer123!`
- sarah.johnson@example.com
- michael.chen@example.com
- emily.rodriguez@example.com
- david.thompson@example.com

⚠️ **IMPORTANT:** Change all default passwords after first login!

---

## ✅ Validation Checklist

After seeding, verify everything is working:

```bash
npm run validate-db
```

This checks:
- ✅ Admin users exist
- ✅ Meals are available
- ✅ Employees are active
- ✅ Drivers are available (for deliveries)
- ✅ Orders have items
- ✅ Referential integrity is maintained

---

## 🔧 Troubleshooting

### Database Connection Error

**Error:** `Authentication failed against database server`

**Solution:**
1. Check your `.env.local` file exists
2. Verify `DATABASE_URL` and `DIRECT_URL` are correct
3. Get fresh credentials from Supabase dashboard
4. Ensure database is active and accessible

### No Meals Found

**Error:** `meals-data.json not found`

**Solution:**
```bash
# Verify the file exists
ls scripts/meals-data.json

# If missing, check the archive
ls __ARCHIVE__/unused_scripts/
```

### Unique Constraint Violation

**Error:** `Unique constraint failed on email`

**Solution:** This is normal! The seeding scripts use `skipDuplicates` or check for existing records. If you want to reseed:

```bash
# Reset database (WARNING: Deletes all data!)
npx prisma db push --force-reset

# Then reseed
npm run seed-meals
npm run seed-customers
npm run seed-employees
```

---

## 📊 What Each Seed File Contains

### `meals-data.json` (22 meals)
- Grilled chicken rice bowl ⭐ Featured
- Turkey taco bowl
- Beef and potato hash ⭐ Featured
- Chicken pesto pasta Banza
- Turkey meatballs marinara ⭐ Featured
- BBQ chicken mash ⭐ Featured
- Turkey chili cup
- Greek chicken bowl
- Beef enchilada skillet
- Chicken alfredo light
- Lemon herb chicken
- Turkey breakfast scramble
- Beef burrito bowl ⭐ Featured
- Chicken parmesan light
- Turkey bolognese
- Chicken fajita bowl
- Turkey shepherd pie
- Beef Korean bowl
- Chicken buffalo ranch
- Turkey primavera
- Mississippi Pot Roast
- Chilli Mac

### `customers.json` (6 users)
- 2 Admin users (Justin Dowd, Josh Dennis)
- 4 Regular customers (test accounts)

### `employees.json` (6 employees)
- Justin Dowd (Owner & CEO)
- Josh Dennis (COO)
- Maria Garcia (Head Chef)
- James Wilson (Delivery Driver)
- Lisa Anderson (Office Manager)
- Robert Martinez (Sous Chef)

---

## 🎯 Production Deployment Checklist

Before deploying to production:

- [ ] Seed meals: `npm run seed-meals`
- [ ] Seed admin users: `npm run seed-customers`
- [ ] Seed employees: `npm run seed-employees`
- [ ] Validate database: `npm run validate-db`
- [ ] Test admin login with both accounts
- [ ] Change default admin passwords
- [ ] Test customer registration flow
- [ ] Test order creation
- [ ] Verify meals display correctly
- [ ] Test employee management
- [ ] Set up payment gateway (Square/Stripe)
- [ ] Configure email service (Nodemailer)

---

## 💡 Pro Tips

1. **Start Small:** Use minimal seeding for initial setup
2. **Test Incrementally:** Seed and validate after each step
3. **Use Prisma Studio:** View data with `npx prisma studio`
4. **Keep Backups:** Export data before major changes
5. **Document Changes:** Update this guide if you modify seed data

---

## 🆘 Need Help?

### Common Commands

```bash
# View all available seed commands
npm run

# Check database connection
npx prisma db pull

# View data in browser
npx prisma studio

# Generate Prisma client
npx prisma generate

# Reset database (DANGER!)
npx prisma db push --force-reset
```

### Files to Check

- `.env.local` - Database credentials
- `scripts/seed-data/customers.json` - User accounts
- `scripts/seed-data/employees.json` - Employee records
- `scripts/meals-data.json` - Meal catalog
- `prisma/schema.prisma` - Database schema

---

## 📝 Summary

**Minimum to function:**
```bash
npm run seed-meals
npm run seed-customers
npm run seed-employees
```

**Recommended for production:**
```bash
npm run seed-meals
npm run seed-all
npm run validate-db
```

**Full development setup:**
```bash
npm run seed-meals
npm run seed-comprehensive
npm run validate-db
```

---

**Happy Seeding! 🌱**

*Last updated: December 23, 2025*
