# Scripts Directory

This directory contains all database seeding, maintenance, and utility scripts for Liberty Meal Prep.

## 📁 Directory Structure

```
scripts/
├── 🌱 SEEDING SYSTEM
│   ├── seed-config.ts              # Configuration presets
│   ├── seed-utils.ts               # Data generation utilities
│   ├── seed-generators.ts          # Entity-specific seeders
│   ├── seed-comprehensive.ts       # Main comprehensive seeder
│   ├── seed-customers.ts           # Customer-only seeder
│   ├── seed-employees.ts           # Employee-only seeder
│   ├── seed-meals.ts               # Meal-only seeder
│   ├── seed-all.ts                 # Basic combined seeder
│   ├── validate-database.ts        # Database integrity validator
│   └── seed-data/
│       ├── customers.json          # Predefined customer data
│       └── employees.json          # Predefined employee data
│
├── 📚 DOCUMENTATION
│   ├── SEEDING.md                  # Complete seeding guide
│   ├── SEEDING-QUICK-REF.md        # Quick reference
│   ├── SEEDING-SUMMARY.md          # Implementation summary
│   └── SEEDING-ARCHITECTURE.md     # System architecture
│
├── 👤 USER MANAGEMENT
│   ├── create-admin.ts             # Create admin user
│   ├── create-admin-prod.ts        # Production admin creation
│   └── list-users.ts               # List all users
│
├── 🍽️ MEAL MANAGEMENT
│   ├── meals-data.json             # Meal seed data
│   ├── meals-files.json            # Meal file mappings
│   ├── dump_meals.ts               # Export meal data
│   ├── set-monthly-menu.ts         # Set featured meals
│   ├── check-meals-data.ts         # Validate meal data
│   └── update-*.ts                 # Various meal update scripts
│
├── 🎟️ PROMO CODE MANAGEMENT
│   ├── test-flexible-promo.ts      # Test promo codes
│   └── verify-promo-codes.ts       # Verify promo functionality
│
├── 📦 SUPABASE/STORAGE
│   ├── upload-assets.ts            # Upload assets to Supabase
│   ├── upload-images-and-update-db.ts
│   ├── create-bucket.ts            # Create storage bucket
│   ├── check-supabase-storage.ts   # Verify storage
│   └── link-existing-images.ts     # Link images to records
│
└── 🔧 UTILITIES
    └── check-square.ts             # Check Square integration
```

## 🚀 Quick Start

### First Time Setup
```bash
# 1. Push database schema
npx prisma db push

# 2. Seed meals
npm run seed-meals

# 3. Seed everything else
npm run seed-comprehensive
```

### Common Commands
```bash
# Seeding
npm run seed-comprehensive          # Comprehensive seeding (recommended)
npm run seed-customers              # Customers only
npm run seed-employees              # Employees only
npm run seed-all                    # Basic entities

# Validation
npm run validate-db                 # Check database integrity

# Admin Management
npm run create-admin                # Create admin user

# Meal Management
npm run seed-meals                  # Seed meals
npm run monthly-menu                # Set monthly featured meals
```

## 📖 Documentation

- **[SEEDING.md](./SEEDING.md)** - Complete seeding documentation
- **[SEEDING-QUICK-REF.md](./SEEDING-QUICK-REF.md)** - Quick reference guide
- **[SEEDING-SUMMARY.md](./SEEDING-SUMMARY.md)** - Implementation summary
- **[SEEDING-ARCHITECTURE.md](./SEEDING-ARCHITECTURE.md)** - System architecture

## 🎯 Most Used Scripts

### 1. Comprehensive Database Seeding
```bash
npm run seed-comprehensive
```
Seeds all entities with realistic test data. Supports multiple configuration presets.

### 2. Database Validation
```bash
npm run validate-db
```
Validates database integrity and checks for common issues.

### 3. Create Admin User
```bash
npm run create-admin
```
Creates or updates the admin user account.

### 4. Seed Meals
```bash
npm run seed-meals
```
Seeds meals from `meals-data.json`. Required before creating orders.

## 🔒 Production Safety

All seeding scripts include production safety checks:
- ✅ Automatic environment detection
- ✅ Confirmation prompts
- ✅ Manual override required for production
- ✅ Incremental seeding (no duplicates)

See [SEEDING.md](./SEEDING.md) for details.

## 🛠️ Development Workflow

### Adding New Seed Data
1. Edit JSON files in `seed-data/`
2. Run appropriate seed script
3. Validate with `npm run validate-db`

### Creating New Seeder
1. Add function to `seed-generators.ts`
2. Call from `seed-comprehensive.ts`
3. Update documentation

### Testing Changes
```bash
# Test with minimal data
npm run seed-comprehensive

# Validate
npm run validate-db

# View in Prisma Studio
npx prisma studio
```

## 📊 Configuration Presets

| Preset | Use Case | Command |
|--------|----------|---------|
| **minimal** | Quick testing | `npm run seed-comprehensive` |
| **small** | Integration tests | `SEED_CONFIG=small npm run seed-comprehensive` |
| **development** | Performance testing | `SEED_CONFIG=development npm run seed-comprehensive` |

## 🐛 Troubleshooting

### Database Connection Issues
Check `.env.local` for correct `DATABASE_URL`

### Missing Dependencies
Run `npm install` in the `web` directory

### Schema Mismatch
Run `npx prisma generate` to regenerate Prisma client

### Seeding Errors
1. Check database connection
2. Ensure schema is up to date
3. Run `npm run validate-db` for details

## 📝 Script Categories

### Seeding Scripts
- Create test data
- Support multiple configurations
- Include safety checks
- Provide progress tracking

### Validation Scripts
- Check data integrity
- Verify relationships
- Identify issues
- Generate reports

### Management Scripts
- User administration
- Meal management
- Promo code testing
- Asset uploads

### Utility Scripts
- Integration checks
- Data exports
- File operations
- Storage management

## 🎓 Best Practices

1. **Always seed meals first** - Required for orders
2. **Use appropriate preset** - Match your testing needs
3. **Validate after seeding** - Ensure data integrity
4. **Document changes** - Update relevant docs
5. **Test before production** - Never skip testing

## 🔗 Related Documentation

- [Main README](../README.md) - Project overview
- [Prisma Schema](../prisma/schema.prisma) - Database schema
- [Environment Setup](../.env.example) - Configuration

## 💡 Tips

- Use `npx prisma studio` to view seeded data
- Run `npm run validate-db` after major changes
- Keep seed data files in version control
- Use minimal preset for quick iterations
- Document any custom seed data

## 📞 Need Help?

1. Check the documentation in this directory
2. Run `npm run validate-db` for diagnostics
3. Review error messages carefully
4. Contact the development team

---

**Happy Scripting! 🚀**
