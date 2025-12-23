# Comprehensive Database Seeding System

A production-ready database seeding system for Liberty Meal Prep that generates realistic test data for all entities including customers, employees, orders, deliveries, routes, and more.

## 🎯 Features

- ✅ **Realistic Data Generation**: Creates authentic-looking test data with proper relationships
- ✅ **Configurable Volumes**: Multiple presets (minimal, small, development) for different testing needs
- ✅ **Production Safety**: Automatic detection and prevention of accidental production seeding
- ✅ **Incremental Seeding**: Won't duplicate existing records, supports adding more data
- ✅ **Referential Integrity**: Maintains all foreign key relationships correctly
- ✅ **Batch Processing**: Efficient memory usage even with large datasets
- ✅ **Progress Tracking**: Beautiful console output with progress bars
- ✅ **Comprehensive Coverage**: Seeds all major entities in the system

## 📦 What Gets Seeded

| Entity | Description | Relationships |
|--------|-------------|---------------|
| **Customers** | User accounts (admin + regular users) | → Orders |
| **Employees** | Staff members across departments | → Deliveries (drivers) |
| **Promo Codes** | Discount codes with various rules | → Orders (optional) |
| **Orders** | Customer orders with items | → Users, Meals, Deliveries |
| **Deliveries** | Delivery records with tracking | → Orders, Drivers, Routes |
| **Routes** | Optimized delivery routes | → Deliveries, Drivers |
| **Audit Logs** | System activity tracking | → Users, Entities |

## 🚀 Quick Start

### Basic Usage (Minimal Dataset)

```bash
cd web
npm run seed-comprehensive
```

This will seed:
- 10 customers
- 5 employees
- 30 orders
- 20 deliveries
- 5 routes
- Plus promo codes and audit logs

### Small Dataset (Quick Testing)

```bash
SEED_CONFIG=small npm run seed-comprehensive
```

This will seed:
- 50 customers
- 10 employees
- 200 orders
- 120 deliveries
- 20 routes

### Large Dataset (Performance Testing)

```bash
SEED_CONFIG=development npm run seed-comprehensive
```

This will seed:
- 1,000 customers
- 50 employees
- 5,000 orders
- 3,000 deliveries
- 200 routes

## 📋 Configuration Options

### Available Presets

Edit `scripts/seed-config.ts` to customize or create new presets:

```typescript
export const myCustomConfig: SeedConfig = {
  volumes: {
    customers: 100,
    employees: 20,
    orders: 500,
    // ... etc
  },
  dateRange: {
    startDate: new Date('2024-01-01'),
    endDate: new Date(),
  },
  // ... more options
};
```

### Environment Variables

```bash
# Choose configuration preset
SEED_CONFIG=minimal|small|development

# Allow seeding in production (NOT RECOMMENDED)
ALLOW_PRODUCTION_SEED=true

# Skip confirmation prompt
# (Set requireConfirmation: false in config)
```

## 🔒 Production Safety

The seeding system includes multiple safety mechanisms:

### 1. Environment Detection
Automatically detects production environments by checking:
- `NODE_ENV=production`
- Database URL contains "prod" or "production"

### 2. Confirmation Prompts
Requires user confirmation before seeding (configurable)

### 3. Manual Override Required
Production seeding requires explicit environment variable:
```bash
ALLOW_PRODUCTION_SEED=true npm run seed-comprehensive
```

### 4. Incremental Seeding
Uses `skipDuplicates` to avoid creating duplicate records

## 📊 Data Characteristics

### Realistic Distributions

The seeding system generates data with realistic distributions:

- **Order Status**: 80% paid, 70% completed
- **Delivery Status**: 75% delivered, 15% in progress
- **Email Verification**: 80% verified
- **Promo Code Types**: 66% percentage-based, 33% fixed amount
- **Order Items**: 1-8 items per order
- **Route Optimization**: 70% optimized

### Temporal Data

- Orders distributed across configured date range
- Deliveries occur after order creation
- Routes scheduled appropriately
- Realistic hire dates for employees

### Geographical Data

- Realistic US addresses
- Valid zip codes
- GPS coordinates for deliveries
- City names from common US cities

## 🛠️ Individual Seeding Scripts

You can also seed entities individually:

```bash
# Seed only customers
npm run seed-customers

# Seed only employees
npm run seed-employees

# Seed only meals
npm run seed-meals

# Seed all basic entities (customers, employees, meals)
npm run seed-all
```

## 📁 File Structure

```
scripts/
├── seed-config.ts           # Configuration presets
├── seed-utils.ts            # Utility functions for data generation
├── seed-generators.ts       # Entity-specific seeding functions
├── seed-comprehensive.ts    # Main comprehensive seeding script
├── seed-customers.ts        # Individual customer seeding
├── seed-employees.ts        # Individual employee seeding
├── seed-meals.ts           # Individual meal seeding
├── seed-all.ts             # Basic combined seeding
└── seed-data/
    ├── customers.json      # Predefined customer data
    └── employees.json      # Predefined employee data
```

## 🔍 Verification

### View Seeded Data

```bash
# Open Prisma Studio
npx prisma studio
```

### Check Counts Programmatically

```typescript
const userCount = await prisma.user.count();
const orderCount = await prisma.order.count();
console.log(`Users: ${userCount}, Orders: ${orderCount}`);
```

### Database Statistics

The comprehensive seed script automatically shows before/after statistics:

```
📊 Database Statistics:
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Entity          Before    After     Added
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Users                 1       11      +10
   Employees             0        5       +5
   Orders                0       30      +30
   ...
```

## 🐛 Troubleshooting

### "Authentication failed against database"

**Problem**: Database credentials are invalid or expired

**Solution**: 
1. Check your `.env.local` file
2. Verify `DATABASE_URL` is correct
3. Test connection: `npx prisma db pull`

### "Unique constraint failed"

**Problem**: Trying to create duplicate records

**Solution**: This is normal! The script uses `skipDuplicates` to handle this gracefully.

### "No users or meals found"

**Problem**: Dependencies are missing

**Solution**: 
1. Seed meals first: `npm run seed-meals`
2. Then run comprehensive seed

### Out of Memory

**Problem**: Seeding too much data at once

**Solution**: 
1. Use a smaller config preset
2. Reduce batch sizes in `seed-generators.ts`
3. Seed entities individually

## 🎯 Best Practices

### Development Workflow

1. **Initial Setup**
   ```bash
   npx prisma db push
   npm run seed-meals
   npm run seed-comprehensive
   ```

2. **Add More Data**
   ```bash
   SEED_CONFIG=small npm run seed-comprehensive
   ```

3. **Reset and Reseed**
   ```bash
   npx prisma db push --force-reset
   npm run seed-meals
   npm run seed-comprehensive
   ```

### Testing Workflow

1. **Unit Tests**: Use minimal config
   ```bash
   SEED_CONFIG=minimal npm run seed-comprehensive
   ```

2. **Integration Tests**: Use small config
   ```bash
   SEED_CONFIG=small npm run seed-comprehensive
   ```

3. **Performance Tests**: Use development config
   ```bash
   SEED_CONFIG=development npm run seed-comprehensive
   ```

### CI/CD Integration

```yaml
# Example GitHub Actions workflow
- name: Seed Test Database
  run: |
    SEED_CONFIG=small npm run seed-comprehensive
  env:
    DATABASE_URL: ${{ secrets.TEST_DATABASE_URL }}
```

## 📈 Performance

### Seeding Times (Approximate)

| Config | Records | Time |
|--------|---------|------|
| Minimal | ~100 | ~5s |
| Small | ~500 | ~15s |
| Development | ~10,000 | ~2-3min |

*Times vary based on database performance and network latency*

### Optimization Tips

1. **Use Batch Processing**: Already implemented in generators
2. **Reduce Batch Size**: If memory is limited
3. **Seed Incrementally**: Seed entities separately
4. **Use Local Database**: Faster than remote connections

## 🔐 Security Considerations

### Default Passwords

All seeded users have default passwords:
- **Admin**: `LMP2024Admin!`
- **Customers**: `Customer123!`

⚠️ **IMPORTANT**: 
- Change passwords immediately in production
- Never commit real passwords to version control
- Use environment variables for sensitive data

### Data Privacy

- All seeded data is **fake** and randomly generated
- No real customer information is used
- Safe for development and testing environments

## 📞 Support

### Common Issues

1. **Database Connection**: Check `.env.local`
2. **Missing Dependencies**: Run `npm install`
3. **Schema Mismatch**: Run `npx prisma generate`
4. **Permission Errors**: Check database user permissions

### Getting Help

- Check the troubleshooting section above
- Review error messages carefully
- Verify database connection and schema
- Contact development team for assistance

## 🎓 Advanced Usage

### Custom Data Generation

Edit `seed-utils.ts` to customize data generation:

```typescript
// Add custom name lists
const customNames = ['Alice', 'Bob', 'Charlie'];

// Add custom address patterns
const customAddresses = ['123 Main St', '456 Oak Ave'];
```

### Extending Seeding

Add new entity seeders in `seed-generators.ts`:

```typescript
export async function seedMyEntity(config: SeedConfig): Promise<void> {
  // Your seeding logic here
}
```

Then add to `seed-comprehensive.ts`:

```typescript
await seedMyEntity(config);
```

## 📝 Changelog

### Version 1.0.0
- Initial comprehensive seeding system
- Support for all major entities
- Multiple configuration presets
- Production safety features
- Batch processing and progress tracking

---

**Happy Seeding! 🌱**
