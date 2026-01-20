
# 🎨 Design Handoff & Style Guide 2.0

## Project: Wisy Visit Dashboard
**Date**: January 20, 2026
**Framework**: React + Tailwind CSS
**Font Family**: Open Sans (`font-family: 'Open Sans', sans-serif`)

---

## 1. Technical Dependencies
To accurately reproduce this design, ensure these dependencies are present:

*   **Tailwind CSS**: `v3.x` (via CDN or npm)
*   **Icon Set**: `lucide-react` (Version `^0.454.0` or higher)
*   **Font Source**: [Google Fonts: Open Sans](https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;500;600;700;800&display=swap)

---

## 2. Color Palette

The project primarily uses the **Slate** scale for neutrals and **Blue/Emerald/Red** for semantic states.

### Primary (Brand)
- **Primary Blue**: `bg-blue-600` / `text-blue-600` (Buttons, Active States)
- **Primary Hover**: `hover:bg-blue-700`
- **Primary Light**: `bg-blue-50` (Active backgrounds, highlights)
- **Primary Border**: `border-blue-200` (Active borders)
- **Detailed Active Item**: `bg-blue-50/50` with `border-l-blue-400`

### Neutrals (Slate)
- **Background (Main)**: `bg-[#FDFEFE]` (Clean Off-White) / `bg-slate-50`
- **Surface**: `bg-white`
- **Text (Headings)**: `text-slate-900`
- **Text (Body)**: `text-slate-700` / `text-slate-600`
- **Text (Subtle/Placeholder)**: `text-slate-400` / `text-slate-500`
- **Borders**: `border-slate-100` (Subtle dividers), `border-slate-200` (Component borders)

### Semantic / Status
- **Success (Valid/Passed)**: `text-emerald-700`, `bg-emerald-50`, `border-emerald-100`
- **Error (Invalid/Failed)**: `text-red-600` / `text-red-700`, `bg-red-50`
- **Warning (Score < 50)**: `text-orange-600`
- **Neutral (No Status)**: `text-slate-400`

---

## 3. Typography

**Font**: Open Sans

### Hierarchy
- **Page Titles**: `text-3xl font-bold tracking-tight text-slate-900`
- **Section Headers**: `text-lg font-bold text-slate-900`
- **Component Labels (Overlines)**: `text-xs font-bold uppercase tracking-wider text-slate-500`
- **Sidebar Headers**: `text-sm font-bold text-slate-800`
- **Body Text**: `text-sm font-medium text-slate-600`
- **Small Text**: `text-xs text-slate-500`

---

## 4. Shapes & Layout

### Border Radius
- **Cards/Containers**: `rounded-[12px]` (Modern, smooth look) or `rounded-xl`
- **Buttons/Inputs**: `rounded-md` (Standard) or `rounded-[8px]`
- **Badges/Tags**: `rounded` or `rounded-full`

### Shadows
- **Cards**: `shadow-sm`
- **Floating Panels**: `shadow-2xl`
- **Layout Depth**: `shadow-[-4px_0_24px_rgba(0,0,0,0.02)]` (Subtle sidebar separation)

### Spacing Guidelines (Tailwind)
- **Section Padding**: `p-6` or `p-8` for breathable containers.
- **Component Gap**: `gap-3` or `gap-4`.
- **List Item Height**: `h-[72px]` fixed for critical headers to ensure alignment.

---

## 5. UI Library / Naming Convention

**Tailwind CSS** is the source of truth.

### Active State Pattern (Sidebar/List)
- **Container**: `bg-blue-50`
- **Text**: `text-blue-700`
- **Icon**: `text-blue-500`
- **Border**: `border border-blue-200` (Box style) OR `border-l-2 border-l-blue-400` (Edge highlight style)

### Card Style (Standard)
```css
bg-white border border-slate-200 rounded-[12px] shadow-sm overflow-hidden
```

---

## 6. Iconography
**Library**: `lucide-react`
**Size**: Standard `size={16}` to `size={20}`.
**Stroke**: `strokeWidth={2}` (Regular), `strokeWidth={2.5}` (Active/Bold).

---

## 7. Component Library & Code Factors

The following components are the building blocks of the current design system.

### A. Visit Header (Main Navigation)
**Visual Reference**:
![Header](public/ref_header.png)

**Usage**: Top of the screen or top of detail views. Includes back button integration.
**Key Classes**:
*   Container: `flex flex-col lg:flex-row lg:items-start justify-between gap-4`
*   Title: `text-xl font-semibold text-slate-900 leading-tight`
*   Subtitle: `text-sm text-slate-500 mt-0.5`
*   Back Button: `mt-1 p-1 -ml-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600`

### B. SaaS List Item (Sidebar/Navigation)
**Visual Reference**:
![Sidebar](public/ref_sidebar.png)

**Usage**: The vertical list in the left panel of detail views (e.g., Surveys, Categories). Uses the "Edge Highlight" style.
**Exact Code**:
```tsx
// Active State
<button className="w-full flex items-center justify-between px-3 py-2.5 rounded-md text-sm font-medium transition-all group border bg-blue-50 text-blue-700 border border-blue-200">
  {/* Content */}
  <ChevronRight size={16} className="text-blue-500" />
</button>

// Inactive State
<button className="w-full flex items-center justify-between px-3 py-2.5 rounded-md text-sm font-medium transition-all group border text-slate-600 hover:bg-slate-50/80 hover:text-slate-900 border-transparent">
  {/* Content */}
  <ChevronRight size={16} className="text-slate-300 group-hover:text-slate-400" />
</button>
```

### C. Status Card (Compact)
**Visual Reference**:
![Content](public/ref_content.png)

**Usage**: Used for showing metrics (Valid/Invalid/Score). Can be 'normal' or 'small'.
**Base Styles**: `bg-white border border-slate-200 rounded-xl shadow-sm`
**Variants**:
*   **Valid (Green)**: `bg-emerald-50/50 border-emerald-200 text-emerald-700`
*   **Invalid (Red)**: `bg-red-50/50 border-red-200 text-red-700`
*   **Neutral (Score)**: `bg-white border-slate-200/60 text-slate-900`
*   **Active Selection**: Adds `border-2`.

### D. Section Header
**Visual Reference**:
![Filters](public/ref_filters.png)

**Usage**: The precise 72px header used in master-detail layouts to ensure horizontal alignment across columns.
**Exact Code**:
```tsx
<div className="px-6 h-[72px] flex items-center justify-between gap-3 shrink-0 bg-white">
  <h2 className="text-lg font-bold text-slate-900 truncate">Title Here</h2>
  {/* Optional Right Actions */}
</div>
```

### E. Component Label (Overline)
**Usage**: Small uppercase headers above lists (e.g., "LISTA DE ENCUESTAS").
**Exact Code**:
```tsx
<h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
  Label Name
</h3>
```

### F. Manual Response Row
**Usage**: Displaying Q&A items in a list.
**Exact Code**:
```tsx
<div className="flex justify-between items-start py-4 border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors px-6">
  <span className="text-slate-600 font-medium text-sm max-w-[70%]">Question Text</span>
  <span className="text-blue-700 font-bold text-sm text-right">Answer Text</span>
</div>
```

### G. Photo Gallery (Right Panel)
**Visual Reference**:
![Gallery](public/visit_detail_ref.png)

**Usage**: The evidence viewer/photo component.
**Code**:
```tsx
<div className="flex flex-col h-full bg-slate-900">
  <div className="flex-1 relative bg-black flex items-center justify-center overflow-hidden">
    <img src="..." className="max-w-full max-h-full object-contain" />
  </div>
</div>
```
