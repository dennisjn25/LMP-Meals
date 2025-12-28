# Liberty Meal Prep Mobile App Roadmap

## Phase 1: Foundation & Core Utility (Weeks 1-3)
**Goal:** Enable time tracking and basic delivery viewing to replace immediate manual processes.

### Week 1: Project Setup & Authentication
- [ ] Initialize React Native (Expo) project with TypeScript
- [ ] Set up Navigation (Expo Router or React Navigation)
- [ ] Implement Auth Context (integrate with existing Supabase Auth)
- [ ] Create Login Screen (matches web aesthetic)
- [ ] Bottom Tab Navigation (Time, Delivery, Kitchen, Profile)

### Week 2: Time Tracking (Employee)
- [ ] Clock In / Clock Out interface
- [ ] Geolocation capture on clock events
- [ ] Timesheet view (Read-only history)
- [ ] Integration with backend `timesheets` table

### Week 3: Basic Delivery Route
- [ ] Driver view of assigned deliveries
- [ ] Map integration (MapView) with route plotting
- [ ] Delivery list view with status (Pending, Delivered)
- [ ] "Mark as Delivered" functionality (basic status update)

## Phase 2: Enhanced Operations (Weeks 4-6)
**Goal:** Deepen functional capabilities for Kitchen and Delivery teams.

### Week 4: Kitchen Operations
- [ ] Kitchen Dashboard (Orders summary)
- [ ] Meal Prep Checklist (interactive items)
- [ ] Ingredient inventory lookup
- [ ] Order details view (allergens, special instructions)

### Week 5: Advanced Delivery Features
- [ ] Turn-by-turn navigation deep-linking (Google Maps/Waze)
- [ ] Photo proof of delivery (Camera integration + Supabase Storage)
- [ ] Customer signature capture
- [ ] Offline handling for delivery updates

### Week 6: Communication & Polish
- [ ] In-app Messaging (Employees <-> Admin)
- [ ] Push Notifications (New orders, Route changes)
- [ ] User Profile (Edit specific details)
- [ ] UI/UX Polish (Dark mode refinement, animations)

## Phase 3: Admin & Optimization (Weeks 7-8)
**Goal:** Bring Admin capabilities to mobile and optimize workflows.

### Week 7: Admin Dashboard
- [ ] Live Driver Tracking (Admin view)
- [ ] Real-time Kitchen status
- [ ] Employee timesheet approval
- [ ] Inventory quick-scan updates

### Week 8: Release & Feedback
- [ ] Beta testing with select employees
- [ ] Bug fixes & Performance tuning
- [ ] App Store / Play Store submission preparation
