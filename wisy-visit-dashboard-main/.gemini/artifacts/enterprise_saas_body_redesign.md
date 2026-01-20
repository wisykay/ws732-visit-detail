# Enterprise SaaS Body Redesign Plan

## Objective
Transform the body content of both AA40299 (CCU Detail) and AA40258 (Price Collection) views to match modern enterprise SaaS design standards (Notion, Linear, Stripe aesthetic).

## Design Principles

### 1. Visual Hierarchy
- **Primary content**: White backgrounds, clear typography
- **Secondary content**: Subtle gray backgrounds (`bg-slate-50`)
- **Tertiary/Meta**: Lighter grays (`bg-slate-100`)

### 2. Spacing System
- **Tight**: 8px (gap-2, p-2)
- **Normal**: 16px (gap-4, p-4)
- **Comfortable**: 24px (gap-6, p-6)
- **Spacious**: 32px (gap-8, p-8)

### 3. Border Philosophy
- **Avoid**: Heavy borders (`border-2`, `border-slate-300`)
- **Use**: Subtle dividers (`border-slate-200/60`, `border-slate-100`)
- **Prefer**: Spacing and background colors for separation

### 4. Interactive Elements
- **Hover states**: Subtle background change (`hover:bg-slate-50`)
- **Active states**: Light blue tint (`bg-blue-50`, `text-blue-600`)
- **Focus rings**: Blue with opacity (`ring-2 ring-blue-500/20`)

---

## AA40299 (CCU Detail) - Specific Changes

### Left Panel (Sections: Layout, Contaminación, Etiquetas, Manuales)

#### Current Issues:
- Heavy borders around containers
- Inconsistent spacing
- Busy visual appearance

#### Changes:

**1. Status Cards (VÁLIDAS, INVÁLIDAS, SCORE)**
```tsx
// Current: Multiple borders, shadows
// New: Minimal borders, clean backgrounds
className="bg-white border border-slate-200/60 rounded-lg p-4 hover:border-slate-300 transition-all"
```

**2. Rules List Items**
```tsx
// Current: Heavy borders, rounded corners
// New: Subtle hover states, clean spacing
className="px-4 py-3 rounded-md hover:bg-slate-50 transition-all border border-transparent hover:border-slate-200"
// Active state:
className="bg-blue-50 border-blue-200 text-blue-900"
```

**3. Section Headers**
```tsx
// Current: Various styles
// New: Consistent, clean
className="text-sm font-semibold text-slate-900 mb-4"
```

**4. Manual Responses**
```tsx
// Current: Gray background boxes
// New: Clean rows with dividers
className="py-3 border-b border-slate-100 last:border-0 hover:bg-slate-50/50"
```

### Right Panel (Photo Gallery)

#### Changes:

**1. Container**
```tsx
// Current: Dark background, heavy shadows
// New: Clean white container with subtle border
className="bg-white rounded-lg border border-slate-200 overflow-hidden"
```

**2. Header**
```tsx
// Current: Various styles
// New: Clean, minimal
className="px-6 py-4 border-b border-slate-100 bg-white"
```

---

## AA40258 (Price Collection) - Specific Changes

### Left Panel (Survey/Category List)

#### Changes:

**1. List Items**
```tsx
// Current: Heavy borders, shadows
// New: Clean hover states
className="px-3 py-3 rounded-md hover:bg-slate-50 transition-all border border-transparent"
// Active:
className="bg-blue-50 border-blue-200 text-blue-900"
```

**2. Header Section**
```tsx
// Already clean, maintain:
className="px-6 py-4 bg-slate-50/50"
```

### Right Panel (Product List + Photo Gallery)

#### Changes:

**1. Product Cards (in SaaSDistributionList)**
```tsx
// Current: Heavy borders, shadows
// New: Minimal, clean
className="bg-white border border-slate-200/60 rounded-lg p-4 hover:border-slate-300 hover:shadow-sm transition-all"
```

**2. Photo Gallery Section**
```tsx
// Match AA40299 style:
className="bg-white border-l border-slate-200/60"
// Header:
className="px-6 py-4 border-b border-slate-100"
```

**3. Distribution Charts/Stats**
```tsx
// Clean card style:
className="bg-white border border-slate-200/60 rounded-lg p-6"
```

---

## Photo Gallery Component Updates

### Current Issues:
- Dark background (`bg-slate-900`) feels heavy
- Height inconsistency between views
- Heavy shadows

### Proposed Changes:

**1. Container Style**
```tsx
// Option A: Light theme (recommended for consistency)
className="bg-white rounded-lg border border-slate-200 overflow-hidden max-h-[500px]"

// Option B: Keep dark but lighter
className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden max-h-[500px]"
```

**2. Consistent Height**
```tsx
// Both AA40299 and AA40258:
max-h-[500px] // or max-h-[600px] for more space
```

**3. Door Tabs**
```tsx
// Cleaner tab style:
className="px-4 py-2 text-sm font-medium border-b-2 transition-all"
// Active:
className="border-blue-500 text-blue-600 bg-blue-50/50"
// Inactive:
className="border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50"
```

---

## Implementation Order

### Phase 1: Core Components (30 min)
1. ✅ Update PhotoGallery height consistency
2. Update PhotoGallery theme (light vs dark decision)
3. Update StatusCard styling (remove heavy borders)

### Phase 2: AA40299 Body (45 min)
4. Update left panel rule lists
5. Update section headers
6. Update manual responses layout
7. Refine status cards

### Phase 3: AA40258 Body (45 min)
8. Update product list cards (SaaSDistributionList)
9. Update category list items
10. Ensure photo gallery matches AA40299

### Phase 4: Polish (20 min)
11. Consistent spacing throughout
12. Hover states refinement
13. Final visual review

---

## Color Palette Reference

### Backgrounds
- Primary: `bg-white`
- Secondary: `bg-slate-50`
- Tertiary: `bg-slate-100`
- Hover: `hover:bg-slate-50`
- Active: `bg-blue-50`

### Borders
- Subtle: `border-slate-200/60`
- Normal: `border-slate-200`
- Divider: `border-slate-100`
- Active: `border-blue-200`

### Text
- Primary: `text-slate-900`
- Secondary: `text-slate-600`
- Tertiary: `text-slate-500`
- Active: `text-blue-600`
- Muted: `text-slate-400`

### Interactive States
- Focus ring: `ring-2 ring-blue-500/20`
- Hover border: `hover:border-slate-300`
- Active background: `bg-blue-50`

---

## Questions for User

1. **Photo Gallery Theme**: Should we keep the dark theme (`bg-slate-900`) or switch to light (`bg-white`) for consistency?
2. **Photo Gallery Height**: Is `max-h-[500px]` good, or would you prefer taller/shorter?
3. **Priority**: Should we focus on AA40299 or AA40258 first, or do both simultaneously?
