# Admin Portal Security

## Overview
The admin portal at `/admin/*` is protected by multiple layers of security to prevent unauthorized access.

## Security Layers

### 1. **Middleware Protection** (`src/middleware.ts`)
- **What it does:** Intercepts ALL requests before they reach any page
- **Location:** Runs on EVERY route (except API, static files, images)
- **Protection:** Uses NextAuth middleware to check authentication status

### 2. **Authorization Callback** (`src/auth.config.ts`)
- **What it does:** Validates user permissions for admin routes
- **Requirements for `/admin/*` access:**
  - ✅ User MUST be logged in (`isLoggedIn === true`)
  - ✅ User MUST have `role === "ADMIN"` in the database
  - ❌ If not logged in → Redirects to `/auth/login`
  - ❌ If logged in but not admin → Redirects to `/` (home page)

### 3. **Server-Side Page Protection**
Every admin page has an additional server-side check:
```typescript
const session = await auth();
if (session?.user?.role !== "ADMIN") {
    redirect("/");
}
```

### 4. **Server Action Protection**
All admin server actions verify the user's role:
```typescript
const session = await auth();
if (session?.user?.role !== "ADMIN") {
    throw new Error("Unauthorized");
}
```

## Development Bypass (SKIP_AUTH)

### ⚠️ CRITICAL SECURITY NOTE
The `SKIP_AUTH` environment variable is a development-only bypass that:
- **ONLY works when `NODE_ENV !== 'production'`**
- **NEVER works in production** (even if accidentally set)
- Logs a warning when enabled
- Should NEVER be set in Vercel or any production environment

### Production Safety
```typescript
const isDevelopment = process.env.NODE_ENV !== 'production';
const skipAuth = isDevelopment && process.env.SKIP_AUTH === 'true';
```

This ensures that even if someone tries to set `SKIP_AUTH=true` in production, it will be ignored.

## Testing Security

### Test 1: Unauthenticated Access
1. Open incognito/private window
2. Navigate to `https://www.lmpmeals.com/admin`
3. **Expected:** Redirected to `/auth/login`

### Test 2: Non-Admin User Access
1. Log in as a regular user (non-admin)
2. Try to access `https://www.lmpmeals.com/admin`
3. **Expected:** Redirected to `/` (home page)

### Test 3: Admin User Access
1. Log in as an admin user
2. Navigate to `https://www.lmpmeals.com/admin`
3. **Expected:** Admin dashboard loads successfully

## Admin User Management

### How to Create Admin Users
Admin users must have `role = "ADMIN"` in the database:

```sql
-- Update existing user to admin
UPDATE "User" 
SET role = 'ADMIN' 
WHERE email = 'admin@example.com';
```

### Current Admin Users
Check your database for users with `role = "ADMIN"`:
- Josh Dennis
- Justin Dowd

## Security Checklist

- [x] Middleware protection enabled
- [x] Authorization callback validates role
- [x] Server-side page checks implemented
- [x] Server action authorization implemented
- [x] SKIP_AUTH only works in development
- [x] Production environment has `NODE_ENV=production`
- [ ] Verify `SKIP_AUTH` is NOT set in Vercel environment variables
- [ ] Regular security audits of admin user list

## Emergency Response

If unauthorized access is suspected:
1. Check Vercel logs for suspicious activity
2. Review database `User` table for unexpected admin users
3. Rotate `AUTH_SECRET` in Vercel environment variables
4. Force logout all sessions by changing `AUTH_SECRET`

## Related Files
- `src/middleware.ts` - Main middleware
- `src/auth.config.ts` - Authorization logic
- `src/auth.ts` - NextAuth configuration
- `src/app/admin/**/page.tsx` - Admin pages with server-side checks
- `src/actions/*.ts` - Server actions with role verification
