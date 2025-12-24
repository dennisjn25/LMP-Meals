import assert from "node:assert";
import { formatDuration, formatMetricValue, generateSparklinePath } from "../src/lib/analytics-utils";

console.log("🧪 Running Analytics Utility Tests...\n");

try {
    // Test formatDuration
    console.log("Testing formatDuration...");
    assert.strictEqual(formatDuration(184), "3m 4s");
    assert.strictEqual(formatDuration(0), "0m 0s");
    assert.strictEqual(formatDuration(3600), "60m 0s");
    console.log("✅ formatDuration passed");

    // Test formatMetricValue
    console.log("\nTesting formatMetricValue...");
    assert.strictEqual(formatMetricValue(12500), "12.5k");
    assert.strictEqual(formatMetricValue(1200000), "1.2M");
    assert.strictEqual(formatMetricValue(450), "450");
    assert.strictEqual(formatMetricValue(999), "999");
    console.log("✅ formatMetricValue passed");

    // Test generateSparklinePath
    console.log("\nTesting generateSparklinePath...");
    const path = generateSparklinePath([10, 20, 10], 100, 30);
    assert.ok(path.startsWith("M 0.00"));
    assert.ok(path.includes("L 50.00"));
    assert.ok(path.includes("L 100.00"));
    assert.strictEqual(generateSparklinePath([]), "");
    console.log("✅ generateSparklinePath passed");

    console.log("\n✨ ALL TESTS PASSED SUCCESSFULLY! ✨");
} catch (error) {
    console.error("\n❌ TEST FAILED!");
    console.error(error);
    process.exit(1);
}
