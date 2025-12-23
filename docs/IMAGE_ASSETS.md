# Liberty Meal Prep - Image Assets

This document provides an overview of all available image assets for the Liberty Meal Prep website.

## Meal Category Images
Located in `/public/meals/`

### 1. High Protein Meal (`/meals/high-protein.png`)
- **Description**: Professional photo of grilled chicken breast with quinoa and steamed broccoli
- **Use Case**: High protein meal category showcase
- **Current Usage**: Homepage "Crafted with Care" section
- **Dimensions**: Optimized for web display

### 2. Keto Friendly Meal (`/meals/keto-friendly.png`)
- **Description**: Professional photo of salmon fillet with avocado, cauliflower rice, and leafy greens
- **Use Case**: Keto-friendly meal category showcase
- **Current Usage**: Homepage "Crafted with Care" section
- **Dimensions**: Optimized for web display

### 3. Balanced Nutrition Meal (`/meals/balanced-nutrition.png`)
- **Description**: Professional photo of lean turkey with sweet potato, mixed vegetables, and brown rice
- **Use Case**: Balanced nutrition meal category showcase
- **Current Usage**: Homepage "Crafted with Care" section
- **Dimensions**: Optimized for web display

## Lifestyle & Marketing Images
Located in `/public/`

### 4. Meal Prep Variety (`/meals/variety.png`)
- **Description**: Overhead shot of multiple meal prep containers with various healthy meals
- **Use Case**: Hero sections, about page, marketing materials
- **Suggested Usage**: 
  - "Our Story" page hero background
  - Menu page header
  - Social media posts

### 5. Fresh Ingredients (`/fresh-ingredients.png`)
- **Description**: Top-down view of fresh, colorful ingredients (chicken, salmon, vegetables, grains)
- **Use Case**: Quality/freshness sections, ingredient sourcing pages
- **Suggested Usage**:
  - "Why Choose Us" section
  - "Our Process" page
  - Quality commitment sections

### 6. Healthy Lifestyle (`/healthy-lifestyle.png`)
- **Description**: Person in athletic wear holding a healthy meal prep container in modern kitchen
- **Use Case**: Lifestyle sections, testimonials, customer success stories
- **Suggested Usage**:
  - Testimonials section background
  - "Join Our Community" sections
  - Marketing banners

### 7. Chef Preparing Meal (`/chef-preparing.png`)
- **Description**: Chef's hands carefully plating a gourmet meal prep dish
- **Use Case**: Behind-the-scenes, quality/craftsmanship sections
- **Suggested Usage**:
  - "Our Story" page
  - "How We Prepare" section
  - Quality assurance sections

### 8. Justin Dowd - Founder (`/justin_dowd_real.jpg`)
- **Description**: Real photo of Justin Dowd, the founder of Liberty Meal Prep, in a professional kitchen setting
- **Use Case**: About page, founder bio
- **Current Usage**: "Our Story" page founder section

## Existing Assets

### Logo (`/logo.png`)
- **Description**: Liberty Meal Prep logo
- **Current Usage**: Navbar, hero sections, footer
- **Note**: Already implemented with shimmer effects

### Background Video (`/hero-background.mp4`)
- **Description**: Hero background video
- **Current Usage**: Can be used for dynamic hero sections
- **Note**: Currently using AnimatedLogoBackground instead

### Stairway Background (`/stairway-bg.png`)
- **Description**: Background image
- **Current Usage**: Available for use in various sections

## Usage Guidelines

### Image Optimization
All images are optimized for web use with Next.js Image component:
```tsx
<Image
  src="/meals/high-protein.png"
  alt="High Protein Meal"
  fill
  style={{ objectFit: 'cover' }}
/>
```

### Responsive Design
- Images automatically adapt to different screen sizes
- Use `fill` prop for containers with defined dimensions
- Use `width` and `height` props for fixed-size images

### Best Practices
1. Always include descriptive `alt` text for accessibility
2. Use appropriate image for the context (lifestyle vs. product)
3. Consider loading performance - use lazy loading for below-fold images
4. Maintain consistent visual style across the website

## Future Image Needs

Consider adding:
- Individual meal photos for menu items (currently using existing meal-1.jpg through meal-5.jpg)
- Team photos for "Our Story" page
- Customer testimonial photos
- Delivery/logistics photos
- Scottsdale, Arizona location photos
- Veteran-owned business imagery

## Notes
- All generated images are professional quality, studio-lit food photography
- Images follow the brand's clean, modern aesthetic
- Color palette aligns with the website's black, white, gray, and gold theme
