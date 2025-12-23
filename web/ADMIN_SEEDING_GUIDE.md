# Admin User Seeding Setup

## ✅ What's Been Configured

I've updated the seeding data files to include **both admin users** with secure passwords:

### Admin Users in `scripts/seed-data/customers.json`:

1. **Justin Dowd (Owner & CEO)**
   - Email: `admin@lmpmeals.com`
   - Password: `LMP2024Admin!`
   - Role: ADMIN

2. **Josh Dennis (COO)**
   - Email: `josh@lmpmeals.com`
   - Password: `LMP2024COO!`
   - Role: ADMIN

### Employee Records in `scripts/seed-data/employees.json`:

Both admin users have also been added as employees with their respective positions:
- Justin Dowd: Owner & CEO (Kitchen, Delivery)
- Josh Dennis: COO (Kitchen, Delivery)

## 🔧 How to Seed the Database

### Option 1: Seed Only Admin Users
```bash
npm run seed-customers
```

This will:
- Create both admin user accounts
- Hash the passwords securely using bcrypt
- Set their roles to ADMIN
- Display the credentials after seeding

### Option 2: Seed Admin Users + Employees
```bash
npm run seed-customers
npm run seed-employees
```

This will:
- Create the user accounts (first command)
- Create the employee records (second command)
- Link the users to their employee profiles

### Option 3: Seed Everything
```bash
npm run seed-all
```

This seeds all data including customers, employees, meals, etc.

## ⚠️ Database Connection Issue

The seeding script encountered a database authentication error:
```
Authentication failed against database server at aws-1-us-west-1.pooler.supabase.com
```

### To Fix This:

1. **Check your `.env.local` file** and ensure you have valid Supabase credentials:
   ```env
   DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@aws-1-us-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
   DIRECT_URL="postgresql://postgres:[YOUR-PASSWORD]@aws-1-us-west-1.pooler.supabase.com:5432/postgres"
   ```

2. **Get the correct password** from your Supabase project:
   - Go to https://supabase.com/dashboard
   - Select your project
   - Go to Settings → Database
   - Copy the connection string with the correct password

3. **Update the `.env.local` file** with the correct credentials

4. **Run the seed command again**:
   ```bash
   npm run seed-customers
   ```

## 🔐 Admin Login Credentials

After successful seeding, you can log in with:

**Justin Dowd (Owner/CEO):**
- Email: `admin@lmpmeals.com`
- Password: `LMP2024Admin!`

**Josh Dennis (COO):**
- Email: `josh@lmpmeals.com`
- Password: `LMP2024COO!`

## 🛡️ Security Recommendations

1. **Change passwords after first login** - These are default passwords for seeding
2. **Use strong, unique passwords** in production
3. **Enable 2FA** if available
4. **Rotate credentials regularly**

## 📝 What Changed

### Files Modified:
1. `scripts/seed-data/customers.json` - Added Josh Dennis as admin, updated Justin's email
2. `scripts/seed-data/employees.json` - Added Josh Dennis as COO employee, updated Justin's email

### Password Hashing:
The `seed-customers.ts` script automatically hashes passwords using bcrypt with 10 salt rounds before storing them in the database.

## 🔍 Verification

After seeding, you can verify the admin users were created:

```bash
npm run validate-db
```

This will check:
- ✅ Admin users exist
- ✅ Database connection is working
- ✅ All required tables are present

## 💡 Next Steps

1. Fix the database connection credentials in `.env.local`
2. Run `npm run seed-customers` to create both admin accounts
3. Run `npm run seed-employees` to create employee records
4. Log in with either admin account
5. Change the default passwords
6. Start managing your meal prep business!
