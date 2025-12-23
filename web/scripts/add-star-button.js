const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/components/admin/AdminMealsClient.tsx');
let content = fs.readFileSync(filePath, 'utf8');

const starButton = `                                    <button
                                        onClick={() => handleToggleFeatured(meal.id, meal.featured)}
                                        style={{
                                            padding: '12px',
                                            background: meal.featured ? 'rgba(251, 191, 36, 0.2)' : 'rgba(255,255,255,0.05)',
                                            color: meal.featured ? '#fbbf24' : 'white',
                                            border: meal.featured ? '1px solid rgba(251, 191, 36, 0.4)' : '1px solid rgba(255,255,255,0.1)',
                                            borderRadius: '12px',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            transition: 'all 0.2s',
                                            title: meal.featured ? \`Week's Menu #\${meal.featuredOrder} - Click to remove\` : 'Add to this week\\'s menu (max 5)'
                                        }}
                                        onMouseOver={(e) => {
                                            e.currentTarget.style.background = meal.featured ? 'rgba(251, 191, 36, 0.3)' : 'rgba(255,255,255,0.1)';
                                        }}
                                        onMouseOut={(e) => {
                                            e.currentTarget.style.background = meal.featured ? 'rgba(251, 191, 36, 0.2)' : 'rgba(255,255,255,0.05)';
                                        }}
                                    >
                                        <Star size={16} fill={meal.featured ? '#fbbf24' : 'none'} />
                                    </button>`;

// Find the pattern: MODIFY button closing tag (handles multiline)
const pattern = /(<Edit2 size={14} \/> MODIFY\s*<\/button>)\s*(<button[\s\S]*?onClick={\(\) => handleDelete)/;

if (pattern.test(content)) {
    content = content.replace(pattern, `$1\n${starButton}\n                                    $2`);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('✅ Star button added successfully!');
    console.log('   Location: Between MODIFY and DELETE buttons');
    console.log('\n📝 Next steps:');
    console.log('   1. Refresh your admin meals page');
    console.log('   2. You should see a star button on each meal');
    console.log('   3. Click stars on 5 meals to feature them for this week');
} else {
    console.log('❌ Could not find the button section');
    console.log('   The file structure may have changed');
}
