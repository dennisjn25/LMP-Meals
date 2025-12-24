# Square Web Payments SDK - Setup Guide

## ✅ What Changed

Your checkout page now allows customers to enter their credit/debit card information **directly on your website** instead of being redirected to Square's payment page.

## 🔧 Setup Required

### Step 1: Get Your Square Application ID

1. Go to [Square Developer Dashboard](https://developer.squareup.com/apps)
2. Select your application (or create one if you haven't)
3. Click on "Credentials" in the left sidebar
4. Copy your **Application ID** (starts with `sq0idp-` for production or `sandbox-sq0idb-` for sandbox)

### Step 2: Update Environment Variables

Add these to your `.env.local` file:

```env
# Square Web Payments SDK
NEXT_PUBLIC_SQUARE_APPLICATION_ID=sq0idp-YOUR_APPLICATION_ID_HERE
NEXT_PUBLIC_SQUARE_LOCATION_ID=LKZ7A9JGG7V0M

# Existing Square credentials (keep these)
SQUARE_ACCESS_TOKEN=EAAAlxzfIXDlEfwOyW4y99fYICOd1y-SWV5QKXHbxExTErcV94T-KWhdifra6vUn
SQUARE_ENV=production
SQUARE_LOCATION_ID=LKZ7A9JGG7V0M
SQUARE_WEBHOOK_SECRET=jvIM_QsdJCC1pHdG6rxq9g
```

**Important**: 
- `NEXT_PUBLIC_SQUARE_APPLICATION_ID` must start with `NEXT_PUBLIC_` to be accessible in the browser
- Use production Application ID (starts with `sq0idp-`) for live payments
- Use sandbox Application ID (starts with `sandbox-sq0idb-`) for testing

### Step 3: Update Vercel Environment Variables

Add the same variables to your Vercel project:

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to Settings → Environment Variables
4. Add:
   - `NEXT_PUBLIC_SQUARE_APPLICATION_ID` = `sq0idp-YOUR_APPLICATION_ID`
   - `NEXT_PUBLIC_SQUARE_LOCATION_ID` = `LKZ7A9JGG7V0M`

## 🎯 How It Works Now

### New Checkout Flow

1. **Step 1: Customer Information**
   - Customer fills out contact and delivery information
   - Clicks "CONTINUE TO PAYMENT →"
   - Order is created with status `PENDING`

2. **Step 2: Payment**
   - Square payment form loads directly on your site
   - Customer enters card information (Card Number, Expiry, CVV, ZIP)
   - Clicks "PAY $XXX.XX"
   - Card is tokenized securely by Square
   - Payment is processed via your API

3. **Step 3: Confirmation**
   - Order status updated to `PAID`
   - Confirmation email sent
   - Success page displayed

### Security Features

✅ **Card data never touches your server** - Square tokenizes it in the browser
✅ **PCI Compliance** - Square handles all PCI requirements
✅ **Secure tokenization** - Card details are converted to a one-time token
✅ **Server-side validation** - All payment processing happens on your server

## 📁 New Files Created

1. **`src/components/SquarePaymentForm.tsx`**
   - React component that loads Square Web Payments SDK
   - Renders card input form
   - Handles tokenization and payment submission

2. **`src/app/api/create-pending-order/route.ts`**
   - Creates order with `PENDING` status
   - Validates delivery radius and minimum order
   - Returns order ID for payment

3. **`src/app/api/process-payment/route.ts`**
   - Processes payment using Square Payments API
   - Takes tokenized card data
   - Returns payment result

4. **`src/app/api/confirm-payment/route.ts`**
   - Updates order status to `PAID`
   - Sends confirmation email
   - Triggers QuickBooks sync

## 🧪 Testing

### Test Cards (Sandbox Mode)

If using sandbox Application ID:

- **Success**: `4111 1111 1111 1111`
- **Decline**: `4000 0000 0000 0002`
- **CVV**: Any 3 digits
- **Expiry**: Any future date
- **ZIP**: Any 5 digits

### Test Flow

1. Add 10+ meals to cart
2. Go to checkout
3. Fill out customer information
4. Click "CONTINUE TO PAYMENT"
5. Enter test card information
6. Click "PAY $XXX.XX"
7. Verify success page shows
8. Check email for confirmation

## 🎨 UI/UX Improvements

### Before (Redirect Flow)
- Customer clicks "PLACE ORDER"
- Redirected to Square's payment page
- Enters card info on Square's site
- Redirected back to your site

### After (Inline Flow)
- Customer clicks "CONTINUE TO PAYMENT"
- Payment form loads on your site
- Enters card info directly on your page
- Stays on your site the entire time

## 🔍 Troubleshooting

### "Failed to load payment form"
- Check that `NEXT_PUBLIC_SQUARE_APPLICATION_ID` is set correctly
- Verify Application ID starts with `sq0idp-` (production) or `sandbox-sq0idb-` (sandbox)
- Check browser console for errors

### "Payment failed"
- Verify `SQUARE_ACCESS_TOKEN` is valid
- Check that `SQUARE_LOCATION_ID` matches your Square account
- Review server logs for detailed error messages

### Payment form not showing
- Ensure environment variables start with `NEXT_PUBLIC_`
- Clear browser cache and reload
- Check that Square SDK script is loading (view page source)

## 📊 Monitoring

### What to Monitor

1. **Payment Success Rate**: Track successful vs failed payments
2. **Form Load Time**: Ensure Square SDK loads quickly
3. **Error Messages**: Monitor for common payment errors
4. **Order Status**: Check for stuck `PENDING` orders

### Logs to Check

- Browser console: Square SDK loading and tokenization
- Server logs: Payment processing and API errors
- Email delivery: Confirmation emails sent successfully

## 🚀 Deployment

1. **Commit changes**:
   ```bash
   git add .
   git commit -m "feat: add inline Square payment form"
   git push origin main
   ```

2. **Update Vercel environment variables** (see Step 3 above)

3. **Deploy**: Vercel will automatically deploy on push

4. **Test on production**: Use real card or Square test cards

## 🎉 Benefits

✅ **Better UX**: Customers stay on your site
✅ **Higher Conversion**: No redirect friction
✅ **Professional**: Looks more polished
✅ **Secure**: Same PCI compliance as before
✅ **Flexible**: Easy to customize styling

## ⚠️ Important Notes

- **Application ID is public**: It's safe to expose in the browser (starts with `NEXT_PUBLIC_`)
- **Access Token is private**: Never expose this in the browser (no `NEXT_PUBLIC_` prefix)
- **Test thoroughly**: Use sandbox mode first before going live
- **Monitor errors**: Set up error tracking for payment failures

## 📞 Support

If you encounter issues:

1. Check browser console for errors
2. Review server logs
3. Verify all environment variables are set
4. Test with Square test cards first
5. Contact Square support if payment processing fails
