# Promo Code System Setup Guide

## Quick Start

The promo code management system has been successfully implemented! Follow these steps to get started:

### 1. Apply Database Schema Changes

**Option A: Restart the development server** (Recommended)
```bash
# Stop the current dev server (Ctrl+C)
# Then restart it
cd web
npm run dev
```

**Option B: Manual Prisma commands** (if server is stopped)
```bash
cd web
npx prisma generate
npx prisma db push
```

### 2. Access the Admin Interface

Once the server is running, navigate to:
```
http://localhost:3000/admin/promo-codes
```

You should see the new "Promo Codes" link in the admin sidebar.

### 3. Create Your First Promo Code

Example test promo codes:

**Example 1: Simple percentage discount**
- **Code**: WELCOME10
- **Discount Type**: Percentage
- **Discount Value**: 10
- **Start Date**: Today
- **End Date**: 30 days from now
- **Active**: Yes

**Example 2: Special time-based code**
- **Code**: 11:11
- **Discount Type**: Fixed Amount
- **Discount Value**: 11.11
- **Start Date**: Today
- **End Date**: 30 days from now
- **Active**: Yes

**Example 3: Holiday promotion**
- **Code**: HOLIDAY-25
- **Discount Type**: Percentage
- **Discount Value**: 25
- **Start Date**: Today
- **End Date**: 30 days from now
- **Active**: Yes

Click "NEW PROMO CODE" and fill in the form!

## What's Been Implemented

✅ **Database Schema**
- PromoCode model with all required fields
- Proper indexing for performance
- Audit logging support

✅ **Server Actions** (`src/actions/promo-codes.ts`)
- Create, read, update, delete operations
- Comprehensive validation logic
- Checkout integration functions
- Audit logging for all operations

✅ **Admin Interface** (`src/app/admin/promo-codes/page.tsx`)
- Responsive form with validation
- Multi-select dropdowns for products/categories
- Real-time status indicators
- Premium dark theme styling

✅ **Client Component** (`src/components/admin/AdminPromoCodesClient.tsx`)
- Full CRUD functionality
- Error handling and user feedback
- Loading states
- Confirmation dialogs

✅ **Navigation**
- Added to admin sidebar menu

✅ **Documentation**
- Comprehensive system documentation (PROMO_CODE_SYSTEM.md)
- Integration examples
- Best practices

## Features

### Promo Code Options
- **Discount Types**: Percentage (%) or Fixed Amount ($)
- **Date Ranges**: Start and end dates with validation
- **Usage Limits**: Optional maximum redemptions
- **Product Targeting**: Apply to specific meals
- **Category Targeting**: Apply to specific categories
- **Minimum Order**: Set minimum cart value
- **Active/Inactive**: Toggle availability

### Validation Rules
- Flexible codes: any characters allowed (3-20 length)
- Examples: `SAVE20`, `11:11`, `HOLIDAY-25`, `VIP:2024`
- No date conflicts
- Proper discount value ranges
- Business rule enforcement

### Status Indicators
- 🟢 **ACTIVE**: Currently valid
- 🟡 **SCHEDULED**: Not yet started
- 🔴 **EXPIRED**: Past end date
- 🔴 **MAXED OUT**: Usage limit reached
- ⚫ **INACTIVE**: Manually disabled

## Next Steps

### To Integrate with Checkout:

1. **Add promo code input to checkout form**
2. **Validate code on submission**:
```typescript
import { validatePromoCode } from "@/actions/promo-codes";

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
```

3. **Increment usage after successful payment**:
```typescript
import { incrementPromoCodeUsage } from "@/actions/promo-codes";

await incrementPromoCodeUsage(promoCode);
```

## Troubleshooting

### "Promo code page not loading"
- Ensure dev server has been restarted
- Check that Prisma schema has been generated
- Verify database has been updated with `npx prisma db push`

### "Cannot find module errors"
- Run `npm install` in the web directory
- Restart your IDE/editor

### "Database errors"
- Run `npx prisma generate`
- Run `npx prisma db push`
- Check that SQLite database file exists

## Testing Checklist

- [ ] Create a percentage discount promo code
- [ ] Create a fixed amount promo code
- [ ] Edit an existing promo code
- [ ] Delete a promo code
- [ ] Test date range validation
- [ ] Test usage limits
- [ ] Test product/category targeting
- [ ] Test minimum order value
- [ ] Toggle active/inactive status
- [ ] View audit logs

## Security Notes

- All operations require ADMIN role
- Complete audit trail maintained
- Input validation on server side
- SQL injection prevention via Prisma ORM

## Support

For detailed documentation, see: `PROMO_CODE_SYSTEM.md`
