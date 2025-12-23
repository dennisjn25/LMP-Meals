import { createPromoCode } from "../src/actions/promo-codes";

async function testFlexiblePromoCode() {
    try {
        console.log("🧪 Testing flexible promo code creation...\n");

        // Test 1: Code with colon
        console.log("Test 1: Creating promo code '11:11'...");
        const promo1 = await createPromoCode({
            code: "11:11",
            discountType: "FIXED",
            discountValue: 11.11,
            startDate: new Date(),
            endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            isActive: true,
            maxRedemptions: null,
            applicableProducts: null,
            applicableCategories: null,
            minOrderValue: null,
            description: "Test promo with colon",
        });
        console.log("✅ Success! Created:", promo1.code, "\n");

        // Test 2: Code with hyphen
        console.log("Test 2: Creating promo code 'HOLIDAY-25'...");
        const promo2 = await createPromoCode({
            code: "HOLIDAY-25",
            discountType: "PERCENTAGE",
            discountValue: 25,
            startDate: new Date(),
            endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            isActive: true,
            maxRedemptions: null,
            applicableProducts: null,
            applicableCategories: null,
            minOrderValue: null,
            description: "Test promo with hyphen",
        });
        console.log("✅ Success! Created:", promo2.code, "\n");

        // Test 3: Short code (3 characters)
        console.log("Test 3: Creating promo code 'VIP'...");
        const promo3 = await createPromoCode({
            code: "VIP",
            discountType: "PERCENTAGE",
            discountValue: 15,
            startDate: new Date(),
            endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            isActive: true,
            maxRedemptions: null,
            applicableProducts: null,
            applicableCategories: null,
            minOrderValue: null,
            description: "Test short code",
        });
        console.log("✅ Success! Created:", promo3.code, "\n");

        // Test 4: Code with special characters
        console.log("Test 4: Creating promo code 'SAVE@2024!'...");
        const promo4 = await createPromoCode({
            code: "SAVE@2024!",
            discountType: "FIXED",
            discountValue: 20,
            startDate: new Date(),
            endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            isActive: true,
            maxRedemptions: null,
            applicableProducts: null,
            applicableCategories: null,
            minOrderValue: null,
            description: "Test with special characters",
        });
        console.log("✅ Success! Created:", promo4.code, "\n");

        console.log("🎉 All tests passed! Flexible promo codes are working correctly.");

    } catch (error: any) {
        console.error("❌ Test failed:", error.message);
        process.exit(1);
    }
}

testFlexiblePromoCode();
