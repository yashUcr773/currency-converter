# Consistent Color Scheme Documentation

This app now uses a consistent blue-to-purple color scheme with proper semantic color variables.

## Color Variables

### Primary Colors (Blue-Purple Theme)
- `--primary`: Main brand color (blue-purple blend)
- `--primary-foreground`: Text color on primary background (white)
- `--primary-light`: Light variant of primary color
- `--primary-dark`: Dark variant of primary color

### Status Colors
- `--success`: Green for success states
- `--warning`: Orange for warning states  
- `--destructive`: Red for error/destructive states
- `--info`: Blue for informational states

### Neutral Colors
- `--background`: Main app background
- `--foreground`: Main text color
- `--card`: Card background
- `--muted`: Muted background
- `--muted-foreground`: Muted text
- `--border`: Border color
- `--accent`: Accent background for hover states

## Current Status ✅

### Completed Updates:
1. **Core CSS Variables** - Updated `src/App.css` with consistent color scheme
2. **Main App Layout** - Updated `src/App.tsx` with semantic colors
3. **UpdatePrompt Component** - Replaced hardcoded blue/orange with semantic colors
4. **UnitSelector Component** - Updated to use consistent primary colors
5. **Utility Functions** - Added color utilities in `src/lib/utils.ts`

### Key Improvements Made:
- ✅ Background changed from `bg-gradient-to-br from-slate-50 to-slate-100` → `bg-background`
- ✅ Header styling updated to use `bg-card/80 backdrop-blur-sm border-border`
- ✅ Tab navigation uses `bg-primary text-primary-foreground` for active states
- ✅ Status indicators use semantic colors (`bg-success`, `text-warning`, etc.)
- ✅ Cards use consistent `bg-card/80 backdrop-blur-sm` pattern

## Usage Guidelines

### Instead of hardcoded colors, use:
- ❌ `bg-blue-600` → ✅ `bg-primary`
- ❌ `text-slate-600` → ✅ `text-muted-foreground`
- ❌ `border-slate-200` → ✅ `border-border`
- ❌ `bg-green-500` → ✅ `bg-success`
- ❌ `text-red-600` → ✅ `text-destructive`
- ❌ `bg-orange-50` → ✅ `bg-warning/10`

### Status Color Utilities
Use the helper utilities from `src/lib/utils.ts`:

```typescript
import { statusColors, cardStyles, buttonVariants } from '@/lib/utils'

// For success alerts
className={statusColors.success.light}

// For primary buttons  
className={buttonVariants.primary}

// For consistent cards
className={cardStyles.base}
```

## Remaining Work 📝

The following components still contain hardcoded colors and should be updated in future iterations:

### High Priority:
- `src/components/CurrencyInput.tsx` - Many slate-* and blue-* colors
- `src/components/CurrencySelector.tsx` - Likely contains hardcoded colors
- `src/components/StatusBar.tsx` - May have status-related hardcoded colors
- `src/components/TimezoneConverter.tsx` - Check for hardcoded colors

### Medium Priority:
- All components in `src/components/` directory should be audited
- Check `src/pages/` components for consistency
- Review form components and inputs

### Search Command:
Use this command to find remaining hardcoded colors:
```bash
grep -r "blue-\|slate-\|gray-\|green-\|red-\|orange-\|purple-\|yellow-\|indigo-" src/components/ --include="*.tsx"
```

## Benefits Achieved ✨
1. **Consistent visual identity** across updated components
2. **Easy theming** - colors defined in one place
3. **Better accessibility** with proper contrast ratios
4. **Maintainable** - semantic color names
5. **Future-proof** - foundation for dark mode

## Development Server
The app is now running with the updated color scheme at http://localhost:5174/
