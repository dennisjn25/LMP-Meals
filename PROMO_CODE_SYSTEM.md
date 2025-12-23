# Promo Code Management System

## Overview

The Promo Code Management System provides administrators with comprehensive tools to create, manage, and track discount promotions for Liberty Meal Prep. The system includes advanced targeting options, usage tracking, and audit logging.

## Features

### 1. Promo Code Creation
- **Flexible Codes**: Any characters allowed (3-20 characters) - supports letters, numbers, special characters like colons, hyphens, etc.
- **Discount Types**: 
  - Percentage discounts (0-100%)
  - Fixed dollar amount discounts
- **Date Range Control**: Set start and end dates for promotions
- **Usage Limits**: Optional maximum redemption limits
- **Product/Category Targeting**: Apply discounts to specific products or categories
- **Minimum Order Requirements**: Set minimum order values for discount eligibility

### 2. Validation Rules

#### Code Format
- Must be 3-20 characters
- **Any characters allowed**: letters, numbers, special characters (colons, hyphens, etc.)
- Examples: `SAVE20`, `11:11`, `HOLIDAY-25`, `VIP:2024`
- Must be unique across all promo codes

#### Discount Values
- **Percentage**: Must be between 0 and 100
- **Fixed Amount**: Must be greater than 0

#### Date Validation
- End date must be after start date
- End date cannot be in the past
- System checks for conflicts with existing active codes

#### Business Rules
- Promo codes can be set to active/inactive
- Usage tracking prevents over-redemption
- Minimum order value enforcement
- Product/category applicability checks

### 3. Database Schema

```prisma
model PromoCode {
  id                   String    @id @default(cuid())
  code                 String    @unique
  discountType         String    // PERCENTAGE or FIXED
  discountValue        Float
  startDate            DateTime
  endDate              DateTime
  maxRedemptions       Int?
  currentRedemptions   Int       @default(0)
  applicableProducts   String?   // Comma-separated meal IDs
  applicableCategories String?   // Comma-separated categories
  minOrderValue        Float?
  isActive             Boolean   @default(true)
  description          String?
  createdBy            String?
  createdAt            DateTime  @default(now())
  updatedAt            DateTime  @updatedAt
  
  @@index([code])
  @@index([isActive])
  @@index([startDate, endDate])
}
```

**Indexes for Performance**:
- `code`: Fast lookup during checkout validation
- `isActive`: Quick filtering of active promotions
- `startDate, endDate`: Efficient date range queries

### 4. Server Actions

Located in: `src/actions/promo-codes.ts`

#### Admin Functions

**`getAllPromoCodes()`**
- Fetches all promo codes (admin only)
- Returns sorted by creation date (newest first)

**`createPromoCode(data: PromoCodeFormData)`**
- Creates a new promo code
- Validates all fields
- Checks for uniqueness and conflicts
- Creates audit log entry

**`updatePromoCode(id: string, data: Partial<PromoCodeFormData>)`**
- Updates existing promo code
- Validates changes
- Creates audit log entry

**`deletePromoCode(id: string)`**
- Deletes promo code
- Creates audit log entry
- Requires confirmation

#### Customer-Facing Functions

**`validatePromoCode(code: string, orderTotal: number, mealIds: string[])`**
- Validates promo code at checkout
- Checks:
  - Code exists and is active
  - Date range validity
  - Usage limits
  - Minimum order value
  - Product/category applicability
- Returns discount details if valid

**`incrementPromoCodeUsage(code: string)`**
- Called after successful order
- Increments redemption counter
- Prevents over-redemption

#### Helper Functions

**`getMealsForPromoCode()`**
- Returns all meals for product selection dropdown

**`getCategoriesForPromoCode()`**
- Returns unique categories for category selection

### 5. Admin Interface

Located in: `src/app/admin/promo-codes/page.tsx`

#### Features
- **Create/Edit Form**: Comprehensive form with all promo code fields
- **Promo Code Table**: Displays all promo codes with status indicators
- **Status Indicators**:
  - 🟢 **ACTIVE**: Currently valid and usable
  - 🟡 **SCHEDULED**: Not yet started
  - 🔴 **EXPIRED**: Past end date
  - 🔴 **MAXED OUT**: Reached usage limit
  - ⚫ **INACTIVE**: Manually disabled

#### Form Fields
1. **Promo Code** (required): 6-12 alphanumeric characters
2. **Discount Type** (required): Percentage or Fixed Amount
3. **Discount Value** (required): Numeric value with validation
4. **Start Date** (required): Date picker
5. **End Date** (required): Date picker
6. **Max Redemptions** (optional): Usage limit
7. **Minimum Order Value** (optional): Minimum cart total
8. **Applicable Products** (optional): Multi-select dropdown
9. **Applicable Categories** (optional): Multi-select dropdown
10. **Description** (optional): Internal notes
11. **Active** (checkbox): Enable/disable promo code

### 6. Audit Logging

All promo code operations are logged in the `AuditLog` table:

- **CREATE_PROMO**: New promo code created
- **UPDATE_PROMO**: Promo code modified
- **DELETE_PROMO**: Promo code deleted

Each log entry includes:
- Action type
- Entity type (PROMO_CODE)
- Entity ID
- User ID and name
- Timestamp
- Details (JSON string of changes)

### 7. Security Features

1. **Admin-Only Access**: All management functions require ADMIN role
2. **Input Validation**: Server-side validation of all inputs
3. **SQL Injection Prevention**: Prisma ORM with parameterized queries
4. **Audit Trail**: Complete history of all changes
5. **Authorization Checks**: Every action verifies user permissions

### 8. Error Handling

The system provides clear error messages for:
- Invalid code format
- Duplicate codes
- Invalid discount values
- Invalid date ranges
- Date conflicts
- Unauthorized access
- Database errors

### 9. User Feedback

- **Success Messages**: Green alerts for successful operations
- **Error Messages**: Red alerts with specific error details
- **Loading States**: Disabled buttons and loading indicators
- **Confirmation Dialogs**: Delete confirmations

### 10. Integration with Checkout

To integrate promo codes into your checkout process:

```typescript
import { validatePromoCode, incrementPromoCodeUsage } from "@/actions/promo-codes";

// During checkout validation
const validation = await validatePromoCode(
  promoCode,
  orderTotal,
  cartItemIds
);

if (validation.isValid) {
  // Apply discount
  const discount = validation.discount;
  if (discount.type === "PERCENTAGE") {
    finalTotal = orderTotal * (1 - discount.value / 100);
  } else {
    finalTotal = orderTotal - discount.value;
  }
}

// After successful payment
await incrementPromoCodeUsage(promoCode);
```

## Usage Examples

### Example 1: Percentage Discount
```
Code: SAVE20
Type: Percentage
Value: 20
Start: 2025-12-21
End: 2025-12-31
Result: 20% off entire order
```

### Example 2: Fixed Amount with Minimum
```
Code: HOLIDAY25
Type: Fixed Amount
Value: 25.00
Min Order: 100.00
Start: 2025-12-24
End: 2025-12-26
Result: $25 off orders over $100
```

### Example 3: Category-Specific
```
Code: PROTEIN15
Type: Percentage
Value: 15
Categories: High Protein
Start: 2025-12-21
End: 2026-01-21
Result: 15% off all High Protein meals
```

### Example 4: Limited Redemptions
```
Code: FIRST50
Type: Fixed Amount
Value: 10.00
Max Redemptions: 50
Start: 2025-12-21
End: 2026-03-21
Result: $10 off, first 50 customers only
```

## Best Practices

1. **Code Naming**: Use clear, memorable codes (e.g., SAVE20, HOLIDAY25)
2. **Date Planning**: Set realistic date ranges with buffer time
3. **Usage Limits**: Consider setting limits for high-value discounts
4. **Testing**: Test promo codes before announcing to customers
5. **Monitoring**: Regularly check usage statistics
6. **Deactivation**: Disable codes instead of deleting for audit trail
7. **Documentation**: Use description field for internal notes

## Troubleshooting

### Promo Code Not Working
1. Check if code is active
2. Verify current date is within valid range
3. Check if usage limit has been reached
4. Verify cart meets minimum order value
5. Check product/category applicability

### Database Migration Issues
If you encounter Prisma client errors:
```bash
cd web
npx prisma generate
npx prisma db push
```

### Performance Optimization
The system includes indexes on:
- `code` for fast lookups
- `isActive` for filtering
- `startDate, endDate` for date queries

## Future Enhancements

Potential features for future development:
- Customer-specific promo codes
- One-time use codes
- Stackable discounts
- Automatic code generation
- Email integration for code distribution
- Analytics dashboard
- A/B testing capabilities
- Referral code system

## Support

For issues or questions:
1. Check audit logs for operation history
2. Review validation error messages
3. Verify database schema is up to date
4. Check server logs for detailed errors
