const fs = require('fs');

// Read the meal data
const mealData = JSON.parse(fs.readFileSync('meal-data.json', 'utf8'));

// Extract nutrition data
const nutritionData = mealData.Nutrition_Summary;

// Create a map of meal names to their nutrition info
const mealMap = new Map();

// Process nutrition data - only the first 20 entries have actual data
nutritionData.slice(0, 20).forEach(meal => {
    if (meal.Calories && meal.Protein_g && meal.Carbs_g && meal.Fat_g) {
        mealMap.set(meal.Meal.toLowerCase(), {
            name: meal.Meal,
            calories: meal.Calories,
            protein: meal.Protein_g,
            carbs: meal.Carbs_g,
            fat: meal.Fat_g,
            description: ''
        });
    }
});

// Now extract descriptions from the nutrition data (they're in alternating rows)
// Starting from index 143 where the title/description pairs begin
const descriptions = {
    "grilled chicken rice bowl": "Juicy grilled chicken over fluffy jasmine rice with tender broccoli, finished with a light teriyaki glaze that hits savory without turning sweet. Simple, clean, and reliable fuel that never gets old.",
    "turkey taco bowl": "Lean seasoned turkey layered over hearty brown rice with sweet corn, black beans, and salsa verde. All the taco flavor, none of the crash. Bold, filling, and surprisingly light.",
    "beef and potato hash": "Extra lean beef sautéed with golden potatoes, peppers, and onions. Comfort food energy with a clean conscience. This one eats like a weekend breakfast and works like weekday fuel.",
    "chicken pesto pasta banza": "Grilled chicken tossed with Banza chickpea shells and spinach, coated lightly in basil pesto. Rich flavor, serious protein, and pasta that actually does something for you.",
    "turkey meatballs marinara banza": "Tender turkey meatballs over Banza shells with slow simmered marinara. Classic Italian comfort rebuilt for performance instead of regret.",
    "bbq chicken mash": "Smoky barbecue chicken paired with creamy mashed potatoes and crisp green beans. Backyard flavor, gym friendly macros. Feels indulgent. Behaves responsibly.",
    "turkey chili cup": "Hearty lean turkey chili with beans, tomato, and warm spices. Thick, satisfying, and perfect when you want something that feels like it hugs back.",
    "greek chicken bowl": "Grilled chicken over jasmine rice with cucumber, tomato, feta, and cool tzatziki. Fresh, bright, and balanced. Like a Mediterranean vacation that still fits your goals.",
    "beef enchilada skillet": "Seasoned lean beef with peppers, enchilada sauce, and a warm corn tortilla. Deep flavor, no heaviness. All the comfort of enchiladas without the nap.",
    "chicken alfredo light banza": "Creamy alfredo style sauce folded into Banza shells with grilled chicken and spinach. Comfort food rewritten so you can eat it on a Tuesday and still feel proud.",
    "lemon herb chicken": "Zesty lemon herb chicken with jasmine rice and roasted zucchini. Clean, bright, and refreshing. The kind of meal that resets your appetite instead of weighing it down.",
    "turkey breakfast scramble": "Lean turkey, egg whites, potatoes, and spinach cooked into a hearty scramble. Breakfast energy anytime of day. High protein, deeply satisfying, zero excuses.",
    "beef burrito bowl": "Extra lean beef over rice with fresh pico and a light sprinkle of cheese. Simple, bold, and endlessly dependable. The kind of bowl you crave after a long day.",
    "chicken parmesan light banza": "Breaded baked chicken topped with marinara and melted mozzarella. All the comfort of chicken parm without the heaviness. Familiar flavors that still respect your goals.",
    "turkey bolognese banza": "Rich turkey bolognese sauce over Banza shells. Deep, savory, and slow cooked flavor with macros that make sense. This one eats like a cheat meal and isn't.",
    "chicken fajita bowl": "Seasoned chicken with sautéed peppers and onions over rice, finished with salsa. Sizzling flavor, clean ingredients, and just enough heat to keep things interesting.",
    "turkey shepherd pie": "Savory turkey topped with creamy mashed potatoes and vegetables. Classic comfort reengineered. Feels like home cooking, fuels like a performance meal.",
    "beef korean bowl": "Lean beef over jasmine rice with cabbage and a light gochujang sauce. Sweet heat, savory depth, and serious satisfaction without overload.",
    "chicken buffalo ranch": "Buffalo seasoned chicken with rice, carrots, celery, and a light ranch drizzle. Bold, tangy, and addictive in the best way. Heat without regret.",
    "turkey primavera banza": "Lean turkey and colorful vegetables tossed with Banza shells in a light garlic cream sauce. Fresh, creamy, and balanced. Proof that healthy does not mean boring."
};

// Apply descriptions to meals
mealMap.forEach((meal, key) => {
    if (descriptions[key]) {
        meal.description = descriptions[key];
    }
});

// Convert map to array and add additional fields
const meals = Array.from(mealMap.values()).map(meal => {
    // Determine category based on macros
    let category = 'Balanced';
    let tags = [];

    if (meal.protein >= 44) {
        category = 'High Protein';
        tags.push('High Protein');
    }

    if (meal.carbs <= 30) {
        category = 'Low Carb';
        tags.push('Low Carb');
    }

    if (meal.fat >= 16) {
        tags.push('Higher Fat');
    }

    // Add GF tag (most meals are gluten-free based on ingredients)
    if (!meal.name.toLowerCase().includes('banza')) {
        tags.push('GF');
    }

    // Determine price based on ingredients
    let price = 13.99;
    if (meal.name.toLowerCase().includes('beef')) {
        price = 14.99;
    }
    if (meal.name.toLowerCase().includes('banza')) {
        price = 14.99;
    }

    return {
        ...meal,
        category,
        tags: tags.join(','),
        price
    };
});

// Save processed meals
fs.writeFileSync('processed-meals.json', JSON.stringify(meals, null, 2));

console.log(`✅ Processed ${meals.length} meals`);
console.log('\nMeals:');
meals.forEach((meal, i) => {
    console.log(`${i + 1}. ${meal.name}`);
    console.log(`   Calories: ${meal.calories} | Protein: ${meal.protein}g | Carbs: ${meal.carbs}g | Fat: ${meal.fat}g`);
    console.log(`   Category: ${meal.category} | Price: $${meal.price}`);
    console.log(`   Description: ${meal.description.substring(0, 80)}...`);
    console.log('');
});
