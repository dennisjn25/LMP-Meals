const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/components/admin/AdminMealsClient.tsx');
const lines = fs.readFileSync(filePath, 'utf8').split('\n');

const starButtonLines = [
    "                                    <button",
    "                                        onClick={() => handleToggleFeatured(meal.id, meal.featured)}",
    "                                        style={{",
    "                                            padding: '12px',",
    "                                            background: meal.featured ? 'rgba(251, 191, 36, 0.2)' : 'rgba(255,255,255,0.05)',",
    "                                            color: meal.featured ? '#fbbf24' : 'white',",
    "                                            border: meal.featured ? '1px solid rgba(251, 191, 36, 0.4)' : '1px solid rgba(255,255,255,0.1)',",
    "                                            borderRadius: '12px',",
    "                                            cursor: 'pointer',",
    "                                            display: 'flex',",
    "                                            justifyContent: 'center',",
    "                                            alignItems: 'center',",
    "                                            transition: 'all 0.2s',",
    "                                            title: meal.featured ? `Week's Menu #${meal.featuredOrder} - Click to remove` : 'Add to this week\\'s menu (max 5)'",
    "                                        }}",
    "                                        onMouseOver={(e) => {",
    "                                            e.currentTarget.style.background = meal.featured ? 'rgba(251, 191, 36, 0.3)' : 'rgba(255,255,255,0.1)';",
    "                                        }}",
    "                                        onMouseOut={(e) => {",
    "                                            e.currentTarget.style.background = meal.featured ? 'rgba(251, 191, 36, 0.2)' : 'rgba(255,255,255,0.05)';",
    "                                        }}",
    "                                    >",
    "                                        <Star size={16} fill={meal.featured ? '#fbbf24' : 'none'} />",
    "                                    </button>"
];

// Find the line with "MODIFY" and then find the closing </button>
let insertAfterLine = -1;
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('MODIFY')) {
        // Look for </button> within next 5 lines
        for (let j = i; j < Math.min(i + 5, lines.length); j++) {
            if (lines[j].trim() === '</button>') {
                insertAfterLine = j;
                break;
            }
        }
        if (insertAfterLine !== -1) break;
    }
}

if (insertAfterLine === -1) {
    console.log('❌ Could not find MODIFY button');
    process.exit(1);
}

console.log(`Found MODIFY button, inserting after line ${insertAfterLine + 1}`);

// Insert the star button
const newLines = [
    ...lines.slice(0, insertAfterLine + 1),
    ...starButtonLines,
    ...lines.slice(insertAfterLine + 1)
];

fs.writeFileSync(filePath, newLines.join('\n'), 'utf8');

console.log('✅ Star button added successfully!');
console.log(`   Inserted ${starButtonLines.length} lines after line ${insertAfterLine + 1}`);
console.log('\n📝 Next steps:');
console.log('   1. Refresh your admin meals page (http://localhost:3000/admin/meals)');
console.log('   2. You should see a star ⭐ button on each meal card');
console.log('   3. Click stars on 5 meals to feature them for this week');
console.log('   4. Featured meals will show a golden star with their order number');
