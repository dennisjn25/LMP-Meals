# Generate Remaining Meal Images

This script contains the prompts needed to generate the remaining 10 meal images.
Run these after the image generation quota resets.

## Remaining Meals to Generate:

### 11. Lemon Herb Chicken
```
Professional food photography of lemon herb chicken in meal prep container. Zesty grilled chicken breast with jasmine rice and roasted zucchini slices, garnished with fresh herbs and lemon. Bright, fresh presentation, shot from 45-degree angle, natural lighting in black container, restaurant quality, high resolution
```

### 12. Turkey Breakfast Scramble
```
Professional food photography of turkey breakfast scramble in meal prep container. Lean ground turkey with fluffy egg whites, golden diced potatoes, and fresh spinach. Hearty breakfast presentation, shot from 45-degree angle, natural lighting in black container, restaurant quality, high resolution
```

### 13. Beef Burrito Bowl
```
Professional food photography of beef burrito bowl in meal prep container. Extra lean ground beef over jasmine rice with fresh pico de gallo and light shredded cheese. Mexican-inspired, shot from 45-degree angle, natural lighting, vibrant presentation in black container, restaurant quality, high resolution
```

### 14. Chicken Parmesan Light Banza
```
Professional food photography of chicken parmesan with Banza pasta in meal prep container. Breaded baked chicken breast topped with marinara sauce and melted mozzarella cheese. Italian classic, shot from 45-degree angle, natural lighting in black container, restaurant quality, high resolution
```

### 15. Turkey Bolognese Banza
```
Professional food photography of turkey bolognese with Banza pasta in meal prep container. Rich turkey bolognese sauce over chickpea pasta shells. Deep red sauce, shot from 45-degree angle, natural lighting, Italian presentation in black container, restaurant quality, high resolution
```

### 16. Chicken Fajita Bowl
```
Professional food photography of chicken fajita bowl in meal prep container. Seasoned grilled chicken with sautéed colorful bell peppers and onions over jasmine rice, topped with salsa. Sizzling presentation, shot from 45-degree angle, natural lighting in black container, restaurant quality, high resolution
```

### 17. Turkey Shepherd Pie
```
Professional food photography of turkey shepherd pie in meal prep container. Savory seasoned turkey topped with creamy mashed potatoes and mixed vegetables. Comfort food presentation, shot from 45-degree angle, natural lighting in black container, restaurant quality, high resolution
```

### 18. Beef Korean Bowl
```
Professional food photography of beef Korean bowl in meal prep container. Lean beef over jasmine rice with shredded cabbage and gochujang sauce drizzle. Asian-inspired, shot from 45-degree angle, natural lighting, vibrant presentation in black container, restaurant quality, high resolution
```

### 19. Chicken Buffalo Ranch
```
Professional food photography of chicken buffalo ranch bowl in meal prep container. Buffalo seasoned chicken over rice with carrots, celery sticks, and light ranch drizzle. Bold colors, shot from 45-degree angle, natural lighting in black container, restaurant quality, high resolution
```

### 20. Turkey Primavera Banza
```
Professional food photography of turkey primavera with Banza pasta in meal prep container. Lean turkey and colorful vegetables (broccoli, bell peppers, carrots) tossed with chickpea pasta shells in light garlic cream sauce. Fresh, vibrant presentation, shot from 45-degree angle, natural lighting in black container, restaurant quality, high resolution
```

---

## Instructions:

1. Wait for image generation quota to reset
2. Use the generate_image tool with each prompt above
3. Save images with the following names:
   - lemon_herb_chicken
   - turkey_breakfast_scramble
   - beef_burrito_bowl
   - chicken_parmesan_banza
   - turkey_bolognese_banza
   - chicken_fajita_bowl
   - turkey_shepherd_pie
   - beef_korean_bowl
   - chicken_buffalo_ranch
   - turkey_primavera_banza

4. Copy generated images to `web/public/meals/`
5. Update `imageMap` in `web/scripts/seed-meals.ts`
6. Run `npm run seed-meals` to update database
