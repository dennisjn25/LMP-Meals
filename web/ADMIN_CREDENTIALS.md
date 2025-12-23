# 🔐 Admin Credentials - Quick Reference

## Admin User Accounts

### Justin Dowd (Owner & CEO)
- **Email:** `admin@lmpmeals.com`
- **Password:** `LMP2024Admin!`
- **Role:** ADMIN
- **Position:** Owner & CEO
- **Department:** Kitchen, Delivery

### Josh Dennis (COO)
- **Email:** `josh@lmpmeals.com`
- **Password:** `LMP2024COO!`
- **Role:** ADMIN
- **Position:** COO
- **Department:** Kitchen, Delivery

---

## ⚡ Quick Commands

### Seed Admin Users
```bash
npm run seed-customers
```

### Seed Employee Records
```bash
npm run seed-employees
```

### Seed Everything
```bash
npm run seed-all
```

### Validate Database
```bash
npm run validate-db
```

---

## ⚠️ Important Notes

1. **Database Connection Required:** Ensure your `.env.local` has valid Supabase credentials
2. **Change Passwords:** These are default passwords - change them after first login
3. **Secure Storage:** Never commit `.env.local` to version control
4. **Password Hashing:** Passwords are automatically hashed with bcrypt during seeding

---

## 🔧 Troubleshooting

If seeding fails with authentication error:
1. Check `.env.local` for correct `DATABASE_URL` and `DIRECT_URL`
2. Verify Supabase project is active
3. Ensure database password is correct
4. Try regenerating database credentials in Supabase dashboard

For detailed instructions, see: `ADMIN_SEEDING_GUIDE.md`
