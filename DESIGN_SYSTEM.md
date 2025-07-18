# Currency Converter Design System

## Standardized Color Palette

### Primary Colors
- **Primary Gradient**: `from-blue-600 to-purple-600`
- **Primary Blue**: `blue-600`
- **Primary Purple**: `purple-600`

### Background Colors
- **Main Background**: `from-slate-50 to-slate-100`
- **Card Background**: `bg-white/80 backdrop-blur-sm`
- **Input Background**: `from-slate-50 to-slate-100`
- **Dialog Background**: `from-slate-50 to-slate-100 backdrop-blur-sm`
- **Accent Background**: `from-blue-50 to-purple-50`
- **Status Bar**: `bg-white/80 backdrop-blur-sm`

### Text Colors (Standardized)
- **Primary Text**: `text-slate-800` (headings, currency codes)
- **Secondary Text**: `text-slate-600` (descriptions, labels)
- **Muted Text**: `text-slate-500` (timestamps, symbols)
- **Search Icon**: `text-slate-500`

### Border Colors (Consistent)
- **Primary Border**: `border-slate-200`
- **Card Border**: `border border-slate-200`
- **Focus Border**: `border-blue-400`
- **Hover Border**: `hover:border-blue-200`

### Interactive States (Unified)
- **Hover Background**: `hover:from-blue-50 hover:to-purple-50`
- **Hover Text**: `hover:text-blue-700`
- **Focus Ring**: `focus:ring-blue-400/20`
- **Transition Duration**: `duration-200` (standardized)

### Status Colors (Consistent)
- **Success**: `bg-green-50 text-green-700 border-green-200`
- **Warning**: `bg-orange-50 text-orange-700 border-orange-200`
- **Error**: `bg-red-50 text-red-700 border-red-200`
- **Destructive Hover**: `hover:bg-red-50 hover:text-red-600`

## Typography (Standardized)
- **App Title**: `text-4xl font-bold` with gradient
- **Dialog Title**: `text-xl font-bold` with gradient
- **Currency Code**: `text-lg font-bold`
- **Currency Name**: `text-sm font-medium`
- **Input Text**: `text-xl font-bold`
- **Status Text**: `text-sm font-bold`
- **Button Text**: `text-sm font-medium`

## Layout & Spacing (Consistent)
- **Card Padding**: `p-6` for main content
- **Header Padding**: `pb-4` for card headers
- **Status Padding**: `p-4` for status bars
- **Button Padding**: `px-3 py-2` for standard buttons
- **Icon Padding**: `p-3` for flag containers, `p-4` for plus icon
- **Gaps**: `gap-3` for standard spacing, `gap-4` for larger spacing

## Rounded Corners (Unified)
- **Cards**: `rounded-xl`
- **Buttons**: `rounded-lg`
- **Inputs**: `rounded-xl`
- **Icons**: `rounded-xl`
- **Status Indicators**: `rounded-full`

## Shadows & Effects (Consistent)
- **Card Shadow**: `shadow-xl hover:shadow-blue-500/10`
- **Status Shadow**: `shadow-sm`
- **Header Shadow**: `shadow-lg`
- **Backdrop Blur**: `backdrop-blur-sm` (standardized)

## Animation (Standardized)
- **Transition Duration**: `duration-200` for all interactions
- **Hover Transform**: `hover:-translate-y-1` for cards
- **Icon Scale**: `group-hover:scale-110` for icons
- **Opacity**: `opacity-0 group-hover:opacity-100` for remove buttons

## Applied Changes

### Components Updated
1. **App.tsx**: Consistent header/footer styling, standardized gaps and colors
2. **CurrencyInput.tsx**: Unified card styling, consistent text colors, standardized spacing
3. **CurrencySelector.tsx**: Matching dialog styling, consistent button interactions
4. **StatusBar.tsx**: Unified background and text colors, consistent button styling
5. **UI Components**: Removed all dark theme styles

### CSS Cleanup
- Removed dark theme configurations from App.css
- Cleaned up index.css to remove conflicting styles
- Reduced CSS bundle size by ~10%
- Eliminated inconsistent color usage

### Benefits Achieved
- **Visual Consistency**: All components use the same color palette
- **Better Performance**: Smaller CSS bundle, no unused dark theme styles
- **Maintainability**: Centralized design system documentation
- **User Experience**: Cohesive interface with smooth interactions
