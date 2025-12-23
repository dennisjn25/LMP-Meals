$filePath = "src\components\admin\AdminMealsClient.tsx"
$content = Get-Content $filePath -Raw

# Define the star button code
$starButton = @'
                                    <button
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
                                            title: meal.featured ? `Week's Menu #${meal.featuredOrder} - Click to remove` : 'Add to this week\'s menu (max 5)'
                                        }}
                                        onMouseOver={(e) => {
                                            e.currentTarget.style.background = meal.featured ? 'rgba(251, 191, 36, 0.3)' : 'rgba(255,255,255,0.1)';
                                        }}
                                        onMouseOut={(e) => {
                                            e.currentTarget.style.background = meal.featured ? 'rgba(251, 191, 36, 0.2)' : 'rgba(255,255,255,0.05)';
                                        }}
                                    >
                                        <Star size={16} fill={meal.featured ? '#fbbf24' : 'none'} />
                                    </button>
'@

# Find the pattern: after MODIFY button and before DELETE button
# Look for the closing tag of the MODIFY button followed by the opening of DELETE button
$pattern = '(<Edit2 size={14} /> MODIFY\s*</button>)\s*(<button\s+onClick={\(\) => handleDelete)'

# Replace with: MODIFY button + STAR button + DELETE button
$replacement = "`$1`n$starButton`n                                    `$2"

# Perform the replacement
if ($content -match $pattern) {
    $newContent = $content -replace $pattern, $replacement
    Set-Content -Path $filePath -Value $newContent -NoNewline
    Write-Host "✅ Star button added successfully!" -ForegroundColor Green
    Write-Host "   Location: Between MODIFY and DELETE buttons" -ForegroundColor Cyan
} else {
    Write-Host "❌ Could not find the button section" -ForegroundColor Red
    Write-Host "   Please add the button manually using the guide in 20_MEALS_IMPORTED.md" -ForegroundColor Yellow
}
