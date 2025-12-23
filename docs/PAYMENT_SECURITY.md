# Payment Security Implementation

## Current Payment Flow

### 1. Checkout Process (`/checkout`)
- Customer fills out delivery and contact information
- System validates:
  - Minimum 10 meals requirement
  - Delivery address within 25-mile radius of Scottsdale
  - ReCAPTCHA verification (if configured)
- **Order is created with `PENDING` status**
- Square Payment Link is generated
- Customer is redirected to Square's secure payment page

### 2. Square Payment Page (External)
- Customer enters credit/debit card information on Square's PCI-compliant platform
- Payment is processed by Square
- Customer is redirected back to `/checkout/success?order_id=xxx`

### 3. Payment Confirmation (Webhook)
- Square sends webhook to `/api/webhooks/square`
- Webhook verifies signature for security
- On `payment.updated` with status `COMPLETED`:
  - Order status is updated from `PENDING` to `PAID`
  - Confirmation email is sent to customer
  - QuickBooks sync is triggered

### 4. Success Page (`/checkout/success`)
- Displays order confirmation
- Shows order details (but NOT payment details until webhook confirms)
- Cart is cleared

## Security Measures in Place

### ✅ Payment Processing
1. **No Direct Card Handling**: Card information never touches your server
2. **PCI Compliance**: Square handles all PCI compliance requirements
3. **Production Environment**: `SQUARE_ENV=production` ensures real payments

### ✅ Order Status Workflow
1. Orders start as `PENDING` (line 92 in `orders.ts`)
2. Only webhooks can mark orders as `PAID` (line 67 in `webhooks/square/route.ts`)
3. Webhook signature verification prevents spoofing (lines 19-32)

### ✅ Validation Layers
1. **Client-side**: Form validation, minimum order check
2. **Server-side**: Delivery radius, minimum quantity, ReCAPTCHA
3. **Payment-side**: Square processes actual payment

## Potential Vulnerabilities & Fixes

### ⚠️ Issue 1: Success Page Accessible Without Payment
**Problem**: Users can access `/checkout/success?order_id=xxx` directly without completing payment.

**Current Behavior**: 
- Success page shows order details
- Cart is cleared
- But order remains `PENDING` if payment wasn't completed

**Fix Needed**: Verify order status before showing success message.

### ⚠️ Issue 2: No Payment Status Check on Success Page
**Problem**: Success page doesn't verify if payment was actually completed.

**Fix**: Add order status check in `success/page.tsx`

## Recommended Improvements

### 1. Add Payment Status Verification
Update `/checkout/success/page.tsx` to check order status:

```typescript
if (order.status !== 'PAID') {
  return (
    <div>
      <h1>Payment Pending</h1>
      <p>We're still processing your payment. Please check your email for confirmation.</p>
    </div>
  );
}
```

### 2. Add Order Timeout
Automatically cancel `PENDING` orders after 30 minutes:

```typescript
// In a cron job or scheduled task
const expiredOrders = await db.order.updateMany({
  where: {
    status: 'PENDING',
    createdAt: { lt: new Date(Date.now() - 30 * 60 * 1000) }
  },
  data: { status: 'CANCELLED' }
});
```

### 3. Add Admin Dashboard Alert
Show pending orders that are older than 10 minutes in admin dashboard.

### 4. Implement Webhook Retry Logic
Ensure webhooks are processed even if server is temporarily down.

## Testing Payment Flow

### Test in Production
1. Create test order with real card (use Square test card numbers)
2. Verify order starts as `PENDING`
3. Complete payment on Square
4. Verify webhook updates order to `PAID`
5. Verify confirmation email is sent
6. Check admin dashboard shows correct status

### Square Test Cards
- **Success**: 4111 1111 1111 1111
- **Decline**: 4000 0000 0000 0002
- **CVV**: Any 3 digits
- **Expiry**: Any future date
- **ZIP**: Any 5 digits

## Environment Variables Required

```env
SQUARE_ACCESS_TOKEN=EAAAlxzfIXDlEfwOyW4y99fYICOd1y-SWV5QKXHbxExTErcV94T-KWhdifra6vUn
SQUARE_ENV=production
SQUARE_LOCATION_ID=LKZ7A9JGG7V0M
SQUARE_WEBHOOK_SECRET=jvIM_QsdJCC1pHdG6rxq9g
NEXT_PUBLIC_APP_URL=https://lmpmeals.com
```

## Webhook Configuration

### Square Dashboard Setup
1. Go to Square Developer Dashboard
2. Navigate to Webhooks
3. Add webhook URL: `https://lmpmeals.com/api/webhooks/square`
4. Subscribe to: `payment.updated`
5. Copy webhook signature key to `SQUARE_WEBHOOK_SECRET`

## Monitoring & Alerts

### What to Monitor
1. **Pending Orders**: Orders stuck in PENDING status
2. **Webhook Failures**: Check logs for signature mismatches
3. **Payment Declines**: Track failed payment attempts
4. **Email Delivery**: Ensure confirmation emails are sent

### Log Files
- Webhook events: Check server logs for "SquareWebhook" entries
- Payment errors: Check for "Square session creation failed"
- Email errors: Check for "Failed to send order confirmation email"

## Customer Support Scenarios

### "I paid but didn't get confirmation"
1. Check order status in admin dashboard
2. If `PENDING`: Payment may have failed - check Square dashboard
3. If `PAID`: Resend confirmation email manually
4. Check spam folder

### "Payment was declined"
1. Customer will see error on Square payment page
2. Order remains `PENDING` in database
3. Customer can retry payment with different card
4. After 30 minutes, order should be auto-cancelled

### "I was charged but order shows pending"
1. Check Square dashboard for payment status
2. Webhook may have failed - manually update order status
3. Trigger email confirmation manually
4. Check webhook logs for errors

## Production Checklist

- [x] Square configured for production environment
- [x] Webhook endpoint is publicly accessible
- [x] Webhook signature verification enabled
- [x] Orders start as PENDING
- [x] Only webhooks can mark orders as PAID
- [ ] Success page verifies payment status
- [ ] Auto-cancel expired pending orders
- [ ] Admin dashboard shows payment status
- [ ] Monitoring alerts configured
