# Testing Admin Backend Without Login

## Overview
You can now test the admin backend without logging in by using the `SKIP_AUTH` environment variable.

## How to Enable

1. **Create or edit your `.env.local` file** in the `web` directory:
   ```bash
   SKIP_AUTH=true
   ```

2. **Restart your development server** for the changes to take effect:
   - Stop the current server (Ctrl+C)
   - Run `npm run dev` again

3. **Access admin pages directly**:
   - http://localhost:3000/admin - Main admin dashboard
   - http://localhost:3000/admin/meals - Meal management
   - http://localhost:3000/admin/orders - Order management

## What This Does

When `SKIP_AUTH=true` is set:
- ✅ All admin pages are accessible without login
- ✅ All admin API actions (create/update/delete meals, manage orders, etc.) work without authentication
- ✅ No redirects to login page
- ✅ Full admin functionality for testing

## Important Security Notes

⚠️ **WARNING**: This bypass is for **DEVELOPMENT AND TESTING ONLY**

- **NEVER** set `SKIP_AUTH=true` in production
- **NEVER** commit `.env.local` with `SKIP_AUTH=true` to version control
- This feature checks `process.env.SKIP_AUTH === 'true'` (exact string match)
- Remove or set to `false` before deploying

## To Disable

Simply remove the line from `.env.local` or set it to:
```bash
SKIP_AUTH=false
```

Then restart your development server.

## Files Modified

The following files now include the `SKIP_AUTH` bypass:
- `src/auth.config.ts` - Auth middleware bypass
- `src/app/admin/page.tsx` - Admin dashboard
- `src/app/admin/meals/page.tsx` - Meals page
- `src/app/admin/orders/page.tsx` - Orders page
- `src/actions/admin.ts` - Admin actions
- `src/actions/meals.ts` - Meal management actions
- `src/actions/orders.ts` - Order management actions
