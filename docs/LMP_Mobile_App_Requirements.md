# Liberty Meal Prep Mobile App - Feature Specification

## 1. Overview
The LMP Mobile App is a companion application for Liberty Meal Prep employees and administrators. It facilitates operational tasks such as time tracking, delivery management, kitchen production tracking, and internal communication.

**Tech Stack:** React Native (Expo), TypeScript, Supabase (Auth & DB).

## 2. User Roles
- **Admin**: Full access to all dashboards, employee tracking, and system overrides.
- **Driver**: Access to delivery routes, navigation, and proof-of-delivery tools.
- **Kitchen**: Access to prep lists, order views, and inventory tools.
- **General**: Access to time tracking and schedule.

## 3. Key Feature Requirements

### 3.1 Authentication
- Login with Email/Password (Supabase).
- Persistent session management.
- Role-based navigation (tabs appear based on role).

### 3.2 Time Tracking
- **Clock In/Out**: Big, accessible buttons.
- **Location Validation**: Capture GPS coords on clock-in to verify on-site status.
- **Timesheet**: View past shifts and total hours.

### 3.3 Delivery Management
- **Route View**: Map showing all stops numbered by optimization.
- **Stop Details**: Card showing Customer Name, Address (clickable for Nav), Order ID, and Special Instructions.
- **Delivery Action**:
  - Slide to complete.
  - Optional: Upload photo or Capture Signature.
  - Trigger SMS notification to customer ("Your meal has arrived!").

### 3.4 Kitchen Dashboard
- **Prep Queue**: List of meals to prepare, grouped by recipe.
- **Order Cards**: Digital tickets showing meal customization/allergens.
- **Status Toggles**: "Prep Started", "Packed", "Ready for Pickup".

### 3.5 Messaging & Notifications
- **Chat**: One-on-one or Group chat for teams.
- **Announcements**: Admin-broadcasted messages (e.g., "Kitchen closing early").
- **Push Notifications**: "New Route Assigned", "Urgent Order Update".

## 4. UI/UX Design System
- **Theme**: Dark mode primarily (matches web admin aesthetic).
- **Colors**:
  - Primary: `#3b82f6` (Blue)
  - Success: `#22c55e` (Green)
  - Background: `#0f172a` (Slate-900)
  - Surface: `#1e293b` (Slate-800)
- **Typography**: Clean sans-serif (Inter/Roboto), high legibility.

## 5. Offline Capabilities
- Cache delivery routes for low-signal areas.
- Queue "Clock Out" or "Delivery Complete" actions to sync when online.
