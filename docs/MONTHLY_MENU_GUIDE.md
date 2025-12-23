# Monthly Menu Rotation Guide

## 🗓️ Current Month: December 2024

### Featured 10 Meals:
1. ✅ Grilled chicken rice bowl - 500 cal, 45g protein
2. ✅ Turkey taco bowl - 520 cal, 42g protein
3. ✅ Beef and potato hash - 530 cal, 40g protein
4. ✅ Chicken pesto pasta Banza - 560 cal, 45g protein
5. ✅ Turkey meatballs marinara Banza - 520 cal, 46g protein
6. ✅ BBQ chicken mash - 520 cal, 44g protein
7. ✅ Turkey chili cup - 460 cal, 38g protein
8. ✅ Greek chicken bowl - 520 cal, 45g protein
9. ✅ Beef enchilada skillet - 500 cal, 38g protein
10. ✅ Chicken alfredo light Banza - 560 cal, 45g protein

### Rotated Out (Available Next Month):
11. Lemon herb chicken - 490 cal, 45g protein
12. Turkey breakfast scramble - 480 cal, 40g protein
13. Beef burrito bowl - 520 cal, 42g protein
14. Chicken parmesan light Banza - 480 cal, 44g protein
15. Turkey bolognese Banza - 560 cal, 45g protein
16. Chicken fajita bowl - 520 cal, 45g protein
17. Turkey shepherd pie - 520 cal, 40g protein
18. Beef Korean bowl - 540 cal, 40g protein
19. Chicken buffalo ranch - 540 cal, 44g protein
20. Turkey primavera Banza - 560 cal, 45g protein

---

## 🔄 How to Change Monthly Menu

### Option 1: Using the Script (Recommended)

1. Edit `web/scripts/set-monthly-menu.ts`
2. Update the meal list for the new month:

```typescript
// January 2025 - Featured 10 Meals
const JANUARY_2025_MEALS = [
  'Lemon herb chicken',
  'Turkey breakfast scramble',
  'Beef burrito bowl',
  'Chicken parmesan light Banza',
  'Turkey bolognese Banza',
  'Chicken fajita bowl',
  'Turkey shepherd pie',
  'Beef Korean bowl',
  'Chicken buffalo ranch',
  'Turkey primavera Banza',
];
```

3. Run the script:
```bash
cd web
npm run monthly-menu
```

### Option 2: Using Admin Panel (Future Feature)

Once the admin panel is enhanced, you'll be able to:
- Toggle meal availability with checkboxes
- See which meals are currently featured
- Schedule future rotations

---

## 📸 Professional Image Generation

### Current Status:
- **10 meals** have professional AI-generated images
- **10 meals** need new professional images

### Image Generation Prompts

When the image generation quota resets, use these prompts to create appetizing, professional meal photos:

#### For Each Meal:
Use this format for consistent, professional results:

```
Professional food photography of [MEAL NAME] in black meal prep container. 
[DETAILED DESCRIPTION OF INGREDIENTS AND PRESENTATION]. 
Shot from 45-degree angle in natural lighting, clean presentation, 
restaurant quality, high resolution, appetizing, food styling
```

#### Specific Prompts for Remaining 10 Meals:

**1. Lemon Herb Chicken**
```
Professional food photography of lemon herb chicken in black meal prep container. 
Zesty grilled chicken breast with fluffy jasmine rice and roasted zucchini slices, 
garnished with fresh herbs and lemon wedge. Bright, fresh, vibrant colors. 
Shot from 45-degree angle in natural lighting, restaurant quality, high resolution
```

**2. Turkey Breakfast Scramble**
```
Professional food photography of turkey breakfast scramble in black meal prep container. 
Lean ground turkey with fluffy scrambled egg whites, golden diced potatoes, 
and fresh spinach. Hearty breakfast presentation with steam effect. 
Shot from 45-degree angle in natural lighting, restaurant quality, high resolution
```

**3. Beef Burrito Bowl**
```
Professional food photography of beef burrito bowl in black meal prep container. 
Extra lean seasoned ground beef over jasmine rice with fresh pico de gallo 
and light shredded cheese. Colorful Mexican-inspired presentation. 
Shot from 45-degree angle in natural lighting, restaurant quality, high resolution
```

**4. Chicken Parmesan Light Banza**
```
Professional food photography of chicken parmesan in black meal prep container. 
Breaded baked chicken breast topped with rich marinara sauce and melted 
mozzarella cheese, served with Banza pasta. Italian classic presentation. 
Shot from 45-degree angle in natural lighting, restaurant quality, high resolution
```

**5. Turkey Bolognese Banza**
```
Professional food photography of turkey bolognese with Banza pasta in black meal prep container. 
Rich, hearty turkey bolognese sauce over chickpea pasta shells. Deep red sauce, 
garnished with fresh basil. Italian comfort food presentation. 
Shot from 45-degree angle in natural lighting, restaurant quality, high resolution
```

**6. Chicken Fajita Bowl**
```
Professional food photography of chicken fajita bowl in black meal prep container. 
Seasoned grilled chicken strips with sautéed colorful bell peppers and onions 
over jasmine rice, topped with fresh salsa. Sizzling, vibrant presentation. 
Shot from 45-degree angle in natural lighting, restaurant quality, high resolution
```

**7. Turkey Shepherd Pie**
```
Professional food photography of turkey shepherd pie in black meal prep container. 
Savory seasoned turkey topped with creamy mashed potatoes and mixed vegetables 
(peas, carrots). Classic comfort food presentation with golden potato topping. 
Shot from 45-degree angle in natural lighting, restaurant quality, high resolution
```

**8. Beef Korean Bowl**
```
Professional food photography of beef Korean bowl in black meal prep container. 
Lean beef over jasmine rice with shredded purple cabbage and gochujang sauce drizzle, 
garnished with sesame seeds and green onions. Asian-inspired, vibrant colors. 
Shot from 45-degree angle in natural lighting, restaurant quality, high resolution
```

**9. Chicken Buffalo Ranch**
```
Professional food photography of chicken buffalo ranch bowl in black meal prep container. 
Buffalo seasoned chicken over rice with fresh carrots, celery sticks, and light 
ranch drizzle. Bold orange and green colors, appetizing presentation. 
Shot from 45-degree angle in natural lighting, restaurant quality, high resolution
```

**10. Turkey Primavera Banza**
```
Professional food photography of turkey primavera with Banza pasta in black meal prep container. 
Lean turkey and colorful vegetables (broccoli, red bell peppers, yellow squash, carrots) 
tossed with chickpea pasta shells in light garlic cream sauce. Fresh, vibrant, healthy presentation. 
Shot from 45-degree angle in natural lighting, restaurant quality, high resolution
```

---

## 🎨 Image Generation Workflow

### Step 1: Generate Images
Use the `generate_image` tool with each prompt above:

```typescript
generate_image({
  ImageName: "lemon_herb_chicken",
  Prompt: "[Use prompt from above]"
})
```

### Step 2: Copy Images to Project
```bash
copy "C:\Users\Da Boof\.gemini\antigravity\brain\[SESSION_ID]\*.png" "web\public\meals\"
```

### Step 3: Update Seed Script
Edit `web/scripts/seed-meals.ts` and update the `imageMap`:

```typescript
const imageMap: Record<string, string> = {
  'lemon herb chicken': '/meals/lemon_herb_chicken_[TIMESTAMP].png',
  'turkey breakfast scramble': '/meals/turkey_breakfast_scramble_[TIMESTAMP].png',
  // ... etc
};
```

### Step 4: Re-seed Database
```bash
cd web
npm run seed-meals
```

---

## 📋 Monthly Rotation Checklist

### Before Each Month:
- [ ] Decide which 10 meals to feature
- [ ] Update `set-monthly-menu.ts` with new meal list
- [ ] Run `npm run monthly-menu`
- [ ] Verify menu page shows correct 10 meals
- [ ] (Optional) Generate new images for featured meals
- [ ] (Optional) Update social media with new menu

### Image Quality Guidelines:
- ✅ Clean, professional food photography
- ✅ Natural lighting
- ✅ Black meal prep containers
- ✅ 45-degree angle shots
- ✅ Vibrant, appetizing colors
- ✅ High resolution (1024x1024 or higher)
- ✅ Realistic food presentation
- ❌ No artificial backgrounds
- ❌ No text overlays
- ❌ No unrealistic portions

---

## 🚀 Quick Commands

```bash
# Set monthly menu rotation
npm run monthly-menu

# Re-seed all meals (keeps availability settings)
npm run seed-meals

# Start dev server
npm run dev
```

---

## 📊 Menu Statistics

### Current Month Distribution:
- **High Protein**: 7 meals (70%)
- **Balanced**: 3 meals (30%)
- **Low Carb**: 0 meals (0%)

### Price Distribution:
- **$13.99**: 6 meals
- **$14.99**: 4 meals

### Protein Range: 38g - 46g
### Calorie Range: 460 - 560 cal
