$filePath = "src\components\admin\AdminMealsClient.tsx"
$lines = Get-Content $filePath

# Find the line with "</button>" after "MODIFY"
$insertAfterLine = -1
for ($i = 0; $i -lt $lines.Count; $i++) {
    if ($lines[$i] -match 'MODIFY' -and $i -lt $lines.Count - 5) {
        # Look for the closing </button> tag within the next few lines
        for ($j = $i; $j -lt [Math]::Min($i + 5, $lines.Count); $j++) {
            if ($lines[$j] -match '^\s*</button>\s*$') {
                $insertAfterLine = $j
                break
            }
        }
        if ($insertAfterLine -ne -1) { break }
    }
}

if ($insertAfterLine -eq -1) {
    Write-Host "❌ Could not find insertion point" -ForegroundColor Red
    exit 1
}

Write-Host "Found insertion point at line $($insertAfterLine + 1)" -ForegroundColor Cyan

# Create the star button code with proper indentation
$starButtonLines = @(
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
)

# Insert the star button
$newLines = @()
$newLines += $lines[0..$insertAfterLine]
$newLines += $starButtonLines
$newLines += $lines[($insertAfterLine + 1)..($lines.Count - 1)]

# Write back to file
$newLines | Set-Content -Path $filePath

Write-Host "✅ Star button added successfully!" -ForegroundColor Green
Write-Host "   Inserted after line $($insertAfterLine + 1)" -ForegroundColor Cyan
Write-Host "   Added $($starButtonLines.Count) lines" -ForegroundColor Cyan
Write-Host "`n📝 Next steps:" -ForegroundColor Yellow
Write-Host "   1. Refresh your admin meals page" -ForegroundColor White
Write-Host "   2. You should see a star button on each meal" -ForegroundColor White
Write-Host "   3. Click stars on 5 meals to feature them" -ForegroundColor White
