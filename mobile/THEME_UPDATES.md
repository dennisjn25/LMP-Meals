## How to Update Remaining Screens

The following screens need their colors updated to match the dark theme:

### OrdersScreen.tsx
- Change header background to `theme.colors.surface`
- Change text colors to use `theme.colors.text.primary/secondary`
- Update card backgrounds to `theme.colors.surface` 
- Update borders to `theme.colors.border`
- Change primary color references to `theme.colors.primary` (golden)

### MapScreen.tsx  
- Same updates as OrdersScreen

### ChatScreen.tsx
- Same updates as OrdersScreen
- Update StatusBar to 'light'

All screens should now have:
- Dark backgrounds (#0B0E14)
- Surface cards (#1e293b) 
- Golden accents (#fbbf24)
- White text (#ffffff)
- Gray secondary text (#94a3b8)
