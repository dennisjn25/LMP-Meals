import { db } from "../src/lib/db";

async function verifyPromoCodeModel() {
    try {
        console.log("🔍 Verifying PromoCode model...");

        // Check if we can query the PromoCode table
        const promoCodes = await db.promoCode.findMany();

        console.log("✅ PromoCode model is accessible!");
        console.log(`📊 Found ${promoCodes.length} promo code(s) in the database`);

        if (promoCodes.length > 0) {
            console.log("\n📋 Existing promo codes:");
            promoCodes.forEach((code) => {
                console.log(`  - ${code.code}: ${code.discountType} ${code.discountValue}`);
            });
        } else {
            console.log("\n💡 No promo codes found. Create your first one in the admin panel!");
        }

        console.log("\n✨ Verification complete!");
    } catch (error) {
        console.error("❌ Error verifying PromoCode model:", error);
        process.exit(1);
    } finally {
        await db.$disconnect();
    }
}

verifyPromoCodeModel();
