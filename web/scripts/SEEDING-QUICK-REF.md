# Database Seeding - Quick Reference

## 🚀 Quick Commands

```bash
# Minimal dataset (10 customers, 30 orders)
npm run seed-comprehensive

# Small dataset (50 customers, 200 orders)
SEED_CONFIG=small npm run seed-comprehensive

# Large dataset (1000 customers, 5000 orders)
SEED_CONFIG=development npm run seed-comprehensive

# Individual entities
npm run seed-customers
npm run seed-employees
npm run seed-meals

# Basic combined (customers + employees + meals)
npm run seed-all
```

## 📊 Configuration Presets

| Preset | Customers | Employees | Orders | Deliveries | Routes | Use Case |
|--------|-----------|-----------|--------|------------|--------|----------|
| **minimal** | 10 | 5 | 30 | 20 | 5 | Quick testing |
| **small** | 50 | 10 | 200 | 120 | 20 | Integration tests |
| **development** | 1,000 | 50 | 5,000 | 3,000 | 200 | Performance testing |

## 🔒 Safety Checklist

- ✅ Automatically blocks production environments
- ✅ Requires confirmation before seeding
- ✅ Incremental seeding (no duplicates)
- ✅ Override with `ALLOW_PRODUCTION_SEED=true` (not recommended)

## 🎯 Common Workflows

### Fresh Start
```bash
npx prisma db push --force-reset
npm run seed-meals
npm run seed-comprehensive
```

### Add More Test Data
```bash
SEED_CONFIG=small npm run seed-comprehensive
```

### View Data
```bash
npx prisma studio
```

## 🐛 Quick Fixes

| Problem | Solution |
|---------|----------|
| Database connection error | Check `.env.local` DATABASE_URL |
| Unique constraint failed | Normal - script skips duplicates |
| No meals found | Run `npm run seed-meals` first |
| Out of memory | Use smaller config preset |

## 📁 What Gets Created

```
Customers (Users)
  ├── Admin account (justin@lmpmeals.com)
  └── Regular customers
      └── Orders
          ├── Order Items
          └── Deliveries
              └── Routes

Employees
  ├── Kitchen staff
  ├── Delivery drivers
  └── Admin staff

Promo Codes
  ├── Percentage discounts
  └── Fixed amount discounts

Audit Logs
  └── System activity tracking
```

## 🔑 Default Credentials

**Admin Account:**
- Email: `justin@lmpmeals.com`
- Password: `LMP2024Admin!`

**Customer Accounts:**
- Password: `Customer123!`

⚠️ **Change passwords in production!**

## 📈 Expected Times

- Minimal: ~5 seconds
- Small: ~15 seconds
- Development: ~2-3 minutes

## 💡 Pro Tips

1. **Start Small**: Use minimal config first
2. **Seed Meals First**: Required for orders
3. **Use Prisma Studio**: Best way to view data
4. **Incremental Seeding**: Run multiple times to add more data
5. **CI/CD**: Use small config for automated tests

## 📖 Full Documentation

See [SEEDING.md](./SEEDING.md) for complete documentation.

---

**Need help?** Check the troubleshooting section in SEEDING.md
