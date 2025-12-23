# Backend API Quick Reference

## Server Actions

All server actions are located in `src/actions/` and can be imported and called directly from client or server components.

### Authentication (`src/actions/auth.ts`)

```typescript
import { login, register } from "@/actions/auth";

// Login
const result = await login({
  email: "user@example.com",
  password: "password123"
});

// Register
const result = await register({
  name: "John Doe",
  email: "user@example.com",
  password: "password123"
});
```

### Password Reset (`src/actions/password-reset.ts`)

```typescript
import { requestPasswordReset, resetPassword, verifyResetToken } from "@/actions/password-reset";

// Request password reset
const result = await requestPasswordReset({
  email: "user@example.com"
});

// Verify token
const result = await verifyResetToken(token);

// Reset password
const result = await resetPassword({
  token: "reset-token",
  password: "newpassword123"
});
```

### Meals (`src/actions/meals.ts`)

```typescript
import { getMeals, getAllMealsAdmin, createMeal, updateMeal, deleteMeal } from "@/actions/meals";

// Get available meals (public)
const meals = await getMeals();

// Get all meals (admin only)
const allMeals = await getAllMealsAdmin();

// Create meal (admin only)
await createMeal({
  title: "Grilled Chicken",
  description: "Delicious grilled chicken",
  image: "/uploads/chicken.jpg",
  price: 13.99,
  calories: 450,
  protein: 45,
  carbs: 35,
  fat: 12,
  tags: "High Protein,GF",
  category: "Balanced"
});

// Update meal (admin only)
await updateMeal("meal-id", {
  price: 14.99,
  available: true
});

// Delete meal (admin only)
await deleteMeal("meal-id");
```

### Orders (`src/actions/orders.ts`)

```typescript
import { createOrder, getOrdersAdmin, updateOrderStatus } from "@/actions/orders";

// Create order
const result = await createOrder({
  customerName: "John Doe",
  customerEmail: "john@example.com",
  customerPhone: "555-1234",
  shippingAddress: "123 Main St",
  city: "Scottsdale",
  zipCode: "85251",
  deliveryDate: "2024-01-15",
  items: [
    {
      id: "meal-id",
      quantity: 2,
      price: 13.99,
      title: "Grilled Chicken"
    }
  ],
  total: 27.98
});

// Get all orders (admin only)
const orders = await getOrdersAdmin();

// Update order status (admin only)
await updateOrderStatus("order-id", "DELIVERED");
```

### Contact (`src/actions/contact.ts`)

```typescript
import { submitContactForm } from "@/actions/contact";

// Submit contact form
const formData = new FormData();
formData.append("name", "John Doe");
formData.append("email", "john@example.com");
formData.append("message", "I have a question...");

const result = await submitContactForm(formData);
```

### Admin (`src/actions/admin.ts`)

```typescript
import { deleteUser, updateUserRole } from "@/actions/admin";

// Delete user (admin only)
const result = await deleteUser("user-id");

// Update user role (admin only)
const result = await updateUserRole("user-id", "ADMIN");
```

### User (`src/actions/user.ts`)

```typescript
import { getUserOrders } from "@/actions/user";

// Get current user's orders
const orders = await getUserOrders();
```

---

## API Routes

### Upload Image

**Endpoint:** `POST /api/upload`

**Content-Type:** `multipart/form-data`

**Request:**
```typescript
const formData = new FormData();
formData.append("file", fileBlob);

const response = await fetch("/api/upload", {
  method: "POST",
  body: formData
});

const data = await response.json();
// { url: "/uploads/1234567890-filename.jpg" }
```

**Response:**
```json
{
  "url": "/uploads/1234567890-filename.jpg"
}
```

**Error Response:**
```json
{
  "error": "No file uploaded"
}
```

---

## Database Models

### User
```typescript
{
  id: string;
  name: string | null;
  email: string | null;
  emailVerified: Date | null;
  image: string | null;
  password: string | null;
  role: string; // "USER" or "ADMIN"
  createdAt: Date;
  updatedAt: Date;
}
```

### Meal
```typescript
{
  id: string;
  title: string;
  description: string | null;
  image: string;
  price: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  tags: string; // Comma-separated
  category: string;
  available: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### Order
```typescript
{
  id: string;
  orderNumber: string; // "LMP-XXXXX"
  userId: string | null;
  status: string; // "PENDING" | "PAID" | "COMPLETED" | "CANCELLED" | "DELIVERED"
  total: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string | null;
  shippingAddress: string;
  city: string;
  zipCode: string;
  deliveryDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
  items: OrderItem[];
}
```

### OrderItem
```typescript
{
  id: string;
  orderId: string;
  mealId: string;
  quantity: number;
  price: number; // Snapshot at time of order
  meal: Meal;
}
```

---

## Email Functions

### Send Order Confirmation

```typescript
import { sendOrderConfirmationEmail } from "@/lib/email";

await sendOrderConfirmationEmail({
  customerEmail: "customer@example.com",
  customerName: "John Doe",
  orderNumber: "LMP-ABC123",
  orderDetails: "<html>...</html>",
  total: "$27.98"
});
```

### Send Contact Email

```typescript
import { sendContactEmail } from "@/lib/email";

await sendContactEmail({
  name: "John Doe",
  email: "john@example.com",
  message: "I have a question..."
});
```

### Send Password Reset Email

```typescript
import { sendPasswordResetEmail } from "@/lib/email";

await sendPasswordResetEmail({
  email: "user@example.com",
  resetUrl: "http://localhost:3000/auth/new-password?token=abc123"
});
```

---

## Authentication Helpers

### Get Current Session

```typescript
import { auth } from "@/auth";

const session = await auth();
// {
//   user: {
//     id: string;
//     name: string;
//     email: string;
//     role: string;
//   }
// }
```

### Check if Admin

```typescript
import { auth } from "@/auth";

const session = await auth();
const isAdmin = session?.user?.role === "ADMIN";
```

### Protect Server Component

```typescript
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const session = await auth();
  
  if (session?.user?.role !== "ADMIN") {
    redirect("/");
  }
  
  // Admin-only content
}
```

---

## Common Patterns

### Create a Protected API Route

```typescript
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const session = await auth();
  
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  // Handle request
}
```

### Optimistic UI Update

```typescript
"use client";

import { useState } from "react";
import { updateMeal } from "@/actions/meals";

export default function MealToggle({ meal }) {
  const [available, setAvailable] = useState(meal.available);
  
  const handleToggle = async () => {
    // Optimistic update
    setAvailable(!available);
    
    try {
      await updateMeal(meal.id, { available: !available });
    } catch (error) {
      // Revert on error
      setAvailable(available);
    }
  };
  
  return <button onClick={handleToggle}>{available ? "Available" : "Unavailable"}</button>;
}
```

### Form Submission with Server Action

```typescript
"use client";

import { useTransition } from "react";
import { createMeal } from "@/actions/meals";

export default function MealForm() {
  const [isPending, startTransition] = useTransition();
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    startTransition(async () => {
      await createMeal({
        title: formData.get("title") as string,
        // ... other fields
      });
    });
  };
  
  return <form onSubmit={handleSubmit}>...</form>;
}
```

---

## Error Handling

All server actions return objects with either `success` or `error` properties:

```typescript
const result = await someAction();

if (result.error) {
  // Handle error
  console.error(result.error);
} else if (result.success) {
  // Handle success
  console.log(result.success);
}
```

---

## Development Tips

### Skip Authentication (Development Only)

Set in `.env.local`:
```env
SKIP_AUTH=true
```

This bypasses all admin checks. **NEVER use in production!**

### View Database

```bash
npx prisma studio
```

### Reset Database

```bash
npx prisma db push --force-reset
npx prisma generate
```

### Check Email in Console

When `GMAIL_USER` is not configured, emails are logged to console instead of being sent.

---

## Status Codes

### Order Statuses
- `PENDING` - Order created, awaiting payment
- `PAID` - Payment received
- `COMPLETED` - Order prepared
- `DELIVERED` - Order delivered to customer
- `CANCELLED` - Order cancelled

### User Roles
- `USER` - Regular customer
- `ADMIN` - Administrator with full access

---

This quick reference covers all backend functionality. For detailed implementation, see `BACKEND_COMPLETE.md`.
