# Database Seeding Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    SEEDING SYSTEM ARCHITECTURE                  │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────┐
│  User Commands   │
└────────┬─────────┘
         │
         ├─── npm run seed-comprehensive ──────┐
         ├─── npm run seed-customers ──────────┤
         ├─── npm run seed-employees ──────────┤
         ├─── npm run seed-all ────────────────┤
         └─── npm run validate-db ─────────────┤
                                                │
                                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      CONFIGURATION LAYER                        │
├─────────────────────────────────────────────────────────────────┤
│  seed-config.ts                                                 │
│  ├─ Environment Safety Check                                   │
│  ├─ Configuration Presets (minimal/small/development)          │
│  └─ Volume Settings                                            │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      UTILITY LAYER                              │
├─────────────────────────────────────────────────────────────────┤
│  seed-utils.ts                                                  │
│  ├─ Data Generators (names, addresses, phones, etc.)           │
│  ├─ Random Helpers (dates, numbers, booleans)                  │
│  ├─ Progress Tracking                                          │
│  └─ Batch Processing                                           │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    GENERATOR LAYER                              │
├─────────────────────────────────────────────────────────────────┤
│  seed-generators.ts                                             │
│  ├─ seedCustomers()      → Creates users with auth             │
│  ├─ seedEmployees()      → Creates staff records               │
│  ├─ seedPromoCodes()     → Creates discount codes              │
│  ├─ seedOrders()         → Creates orders + items              │
│  ├─ seedDeliveries()     → Creates delivery records            │
│  ├─ seedRoutes()         → Creates delivery routes             │
│  └─ seedAuditLogs()      → Creates activity logs               │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    ORCHESTRATION LAYER                          │
├─────────────────────────────────────────────────────────────────┤
│  seed-comprehensive.ts                                          │
│  ├─ 1. Safety Checks                                           │
│  ├─ 2. User Confirmation                                       │
│  ├─ 3. Execute Seeders in Order                                │
│  ├─ 4. Track Progress                                          │
│  └─ 5. Show Statistics                                         │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      DATABASE LAYER                             │
├─────────────────────────────────────────────────────────────────┤
│  PostgreSQL (via Prisma)                                        │
│  ├─ Users                                                       │
│  ├─ Employees                                                   │
│  ├─ Orders → OrderItems                                        │
│  ├─ Deliveries                                                  │
│  ├─ Routes                                                      │
│  ├─ PromoCodes                                                  │
│  └─ AuditLogs                                                   │
└─────────────────────────────────────────────────────────────────┘
```

## Seeding Flow

```
START
  │
  ├─ Check Environment Safety
  │  ├─ Is Production? ──── YES ──→ Require ALLOW_PRODUCTION_SEED=true
  │  └─ Is Development? ─── YES ──→ Continue
  │
  ├─ Load Configuration
  │  ├─ SEED_CONFIG=minimal ──→ Small dataset
  │  ├─ SEED_CONFIG=small ───→ Medium dataset
  │  └─ SEED_CONFIG=dev ─────→ Large dataset
  │
  ├─ Show Configuration Summary
  │  └─ Display volumes, date ranges, settings
  │
  ├─ Request Confirmation (if required)
  │  ├─ User says NO ──→ EXIT
  │  └─ User says YES ──→ Continue
  │
  ├─ Get Initial Database Stats
  │
  ├─ SEED PHASE 1: Independent Entities
  │  ├─ Seed Customers (Users)
  │  │  ├─ Generate realistic names
  │  │  ├─ Hash passwords
  │  │  ├─ Create in batches
  │  │  └─ Show progress
  │  │
  │  ├─ Seed Employees
  │  │  ├─ Assign to departments
  │  │  ├─ Set positions
  │  │  ├─ Create in batches
  │  │  └─ Show progress
  │  │
  │  └─ Seed Promo Codes
  │     ├─ Generate codes
  │     ├─ Set discounts
  │     └─ Create in batches
  │
  ├─ SEED PHASE 2: Dependent Entities
  │  ├─ Seed Orders
  │  │  ├─ Link to users
  │  │  ├─ Create order items
  │  │  ├─ Link to meals
  │  │  ├─ Calculate totals
  │  │  └─ Show progress
  │  │
  │  ├─ Seed Deliveries
  │  │  ├─ Link to orders
  │  │  ├─ Assign drivers
  │  │  ├─ Add proof of delivery
  │  │  └─ Show progress
  │  │
  │  └─ Seed Routes
  │     ├─ Link to deliveries
  │     ├─ Assign drivers
  │     ├─ Optimize routes
  │     └─ Show progress
  │
  ├─ SEED PHASE 3: Audit Trail
  │  └─ Seed Audit Logs
  │     ├─ Link to entities
  │     ├─ Track actions
  │     └─ Show progress
  │
  ├─ Get Final Database Stats
  │
  ├─ Calculate Differences
  │
  ├─ Display Summary
  │  ├─ Before/After counts
  │  ├─ Records added
  │  ├─ Time taken
  │  └─ Success/Failure status
  │
  └─ EXIT
```

## Data Relationships

```
┌──────────┐
│   User   │ ◄──────────────────┐
└────┬─────┘                    │
     │                          │
     │ 1:N                      │ 0:1
     │                          │
     ▼                    ┌─────┴──────┐
┌──────────┐             │  Employee  │
│  Order   │             └────────────┘
└────┬─────┘                    │
     │                          │ N:N (via User)
     │ 1:N                      │
     │                          ▼
     ▼                    ┌──────────┐
┌──────────────┐          │ Delivery │
│  OrderItem   │          └────┬─────┘
└──────┬───────┘               │
       │                       │ N:1
       │ N:1                   │
       │                       ▼
       ▼                 ┌──────────┐
  ┌────────┐             │  Route   │
  │  Meal  │             └──────────┘
  └────────┘

┌──────────────┐
│  PromoCode   │ (Independent)
└──────────────┘

┌──────────────┐
│  AuditLog    │ (Tracks all changes)
└──────────────┘
```

## Batch Processing Flow

```
Large Dataset (e.g., 1000 customers)
         │
         ├─ Split into batches of 100
         │
         ├─ Batch 1 (1-100)
         │  ├─ Create records
         │  ├─ Update progress: [██████░░░░] 10%
         │  └─ Commit
         │
         ├─ Batch 2 (101-200)
         │  ├─ Create records
         │  ├─ Update progress: [████████░░] 20%
         │  └─ Commit
         │
         ├─ ... (continue for all batches)
         │
         └─ Batch 10 (901-1000)
            ├─ Create records
            ├─ Update progress: [██████████] 100%
            └─ Commit

Benefits:
✓ Prevents memory overflow
✓ Shows real-time progress
✓ Allows recovery from partial failures
✓ Better database performance
```

## Safety Mechanisms

```
┌─────────────────────────────────────────┐
│         SAFETY CHECK FLOW               │
└─────────────────────────────────────────┘

Environment Check
      │
      ├─ Check NODE_ENV
      │  └─ production? ──→ BLOCK
      │
      ├─ Check DATABASE_URL
      │  ├─ Contains "prod"? ──→ BLOCK
      │  └─ Contains "production"? ──→ BLOCK
      │
      ├─ ALLOW_PRODUCTION_SEED=true?
      │  ├─ NO ──→ BLOCK & EXIT
      │  └─ YES ──→ Show warning, continue
      │
      └─ Confirmation Required?
         ├─ YES ──→ Prompt user
         │         ├─ User confirms ──→ Continue
         │         └─ User declines ──→ EXIT
         └─ NO ──→ Continue

BLOCK Actions:
  1. Display error message
  2. Show override instructions
  3. Exit with error code
```

## File Dependencies

```
seed-comprehensive.ts
    │
    ├─── requires ──→ seed-config.ts
    │                      │
    │                      └─── exports ──→ getConfig()
    │                                       checkEnvironmentSafety()
    │
    ├─── requires ──→ seed-utils.ts
    │                      │
    │                      └─── exports ──→ formatDuration()
    │                                       progressBar()
    │                                       randomName()
    │                                       etc.
    │
    └─── requires ──→ seed-generators.ts
                           │
                           ├─── requires ──→ seed-utils.ts
                           │
                           └─── exports ──→ seedCustomers()
                                            seedEmployees()
                                            seedOrders()
                                            etc.
```

---

This architecture ensures:
- ✅ Separation of concerns
- ✅ Reusability of components
- ✅ Easy maintenance and extension
- ✅ Production safety
- ✅ Scalability
- ✅ Clear data flow
