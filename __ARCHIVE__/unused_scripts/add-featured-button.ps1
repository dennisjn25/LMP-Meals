$file = "src\components\admin\AdminMealsClient.tsx"
$content = Get-Content $file -Raw

# Find the location to insert the button (after the MODIFY button)
$searchPattern = '(<Edit2 size={14} /> MODIFY\s*</button>)'
$replacement = '$1
                                    <button
                                        onClick={() => handleToggleFeatured(meal.id, meal.featured)}
                                        style={{
                                            padding: ''12px'',
                                            background: meal.featured ? ''rgba(251, 191, 36, 0.2)'' : ''rgba(255,255,255,0.05)'',
                                            color: meal.featured ? ''#fbbf24'' : ''white'',
                                            border: meal.featured ? ''1px solid rgba(251, 191, 36, 0.4)'' : ''1px solid rgba(255,255,255,0.1)'',
                                            borderRadius: ''12px'',
                                            cursor: ''pointer'',
                                            display: ''flex'',
                                            justifyContent: ''center'',
                                            alignItems: ''center'',
                                            transition: ''all 0.2s'',
                                            title: meal.featured ? `Featured #${meal.featuredOrder} - Click to unfeature` : ''Click to feature on homepage (max 5)''
                                        }}
                                        onMouseOver={(e) => {
                                            e.currentTarget.style.background = meal.featured ? ''rgba(251, 191, 36, 0.3)'' : ''rgba(255,255,255,0.1)'';
                                        }}
                                        onMouseOut={(e) => {
                                            e.currentTarget.style.background = meal.featured ? ''rgba(251, 191, 36, 0.2)'' : ''rgba(255,255,255,0.05)'';
                                        }}
                                    >
                                        <Star size={16} fill={meal.featured ? ''#fbbf24'' : ''none''} />
                                    </button>'

$newContent = $content -replace $searchPattern, $replacement

Set-Content -Path $file -Value $newContent -NoNewline

Write-Host "Featured button added successfully!"
