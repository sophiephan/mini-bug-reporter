# Tailwind CSS Quick Reference & Guide

## What is Tailwind?
Tailwind is a **utility-first CSS framework** - instead of writing custom CSS, you compose styles using small utility classes directly in your HTML/JSX.

## Setup (What we did)
```bash
npm install -D tailwindcss@^3.4.0 postcss autoprefixer
npx tailwindcss init -p
```

### Key Files:
- **`src/index.css`** - Contains the three Tailwind directives
- **`tailwind.config.js`** - Tells Tailwind which files to scan

### The Three Directives (`src/index.css`):
```css
@tailwind base;        /* Resets browser defaults */
@tailwind components;  /* Component classes (rarely used) */
@tailwind utilities;   /* All the utility classes like bg-blue-500 */
```

### Config (`tailwind.config.js`):
```javascript
content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"]
```
This scans your files and only includes CSS for classes you actually use → smaller bundle size.

## Common Utility Classes

### Colors
```jsx
<div className="bg-blue-500 text-white">Blue background, white text</div>
<div className="bg-red-100 text-red-800">Light red bg, dark red text</div>
```
- `bg-{color}-{shade}` - Background colors (50-900)
- `text-{color}-{shade}` - Text colors

### Spacing
```jsx
<div className="p-4 m-2">Padding 16px, margin 8px</div>
<div className="px-6 py-2">Horizontal padding 24px, vertical 8px</div>
<div className="mt-8 mb-4">Top margin 32px, bottom 16px</div>
```
- `p-{size}` - Padding all sides
- `px-{size}` - Horizontal padding
- `py-{size}` - Vertical padding  
- `pt-{size}` - Top padding (also `pr`, `pb`, `pl`)
- Same pattern for margin: `m-`, `mx-`, `my-`, `mt-`, etc.

**Size scale:** 1 = 4px, 2 = 8px, 4 = 16px, 6 = 24px, 8 = 32px

### Layout & Flexbox
```jsx
<div className="flex items-center justify-between">
  <span>Left</span>
  <span>Right</span>
</div>

<div className="grid grid-cols-3 gap-4">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</div>
```
- `flex` - Display flex
- `items-center` - Align items center (vertical)
- `justify-center` - Justify content center (horizontal)
- `justify-between` - Space between items
- `grid grid-cols-{n}` - CSS Grid with n columns
- `gap-{size}` - Gap between grid/flex items

### Sizing
```jsx
<div className="w-full h-64">Full width, 256px height</div>
<div className="w-1/2 h-screen">Half width, full screen height</div>
```
- `w-{size}` - Width
- `h-{size}` - Height
- Common sizes: `full`, `1/2`, `1/3`, `1/4`, `screen`, or numbers (4 = 16px)

### Borders & Rounded Corners
```jsx
<div className="border border-gray-300 rounded-lg">Bordered box</div>
<button className="rounded-full border-2 border-blue-500">Pill button</button>
```
- `border` - 1px border
- `border-{size}` - Thicker borders (2, 4, 8)
- `border-{color}` - Border color
- `rounded` - Small border radius
- `rounded-lg` - Larger radius
- `rounded-full` - Perfect circle/pill

### Text
```jsx
<h1 className="text-3xl font-bold text-gray-900">Large Bold Title</h1>
<p className="text-sm text-gray-600 italic">Small italic text</p>
```
- `text-{size}` - Font size (xs, sm, base, lg, xl, 2xl, 3xl...)
- `font-{weight}` - Font weight (thin, light, normal, medium, semibold, bold, black)
- `text-{color}` - Text color
- `italic` - Italic text
- `text-center` - Center align
- `text-left/right` - Left/right align

## Real Examples from Forms

### Input Field
```jsx
<input 
  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
  type="text"
/>
```

### Button
```jsx
<button className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded">
  Submit
</button>
```

### Card Component
```jsx
<div className="bg-white shadow-md rounded-lg p-6 border border-gray-200">
  <h3 className="text-lg font-semibold mb-2">Card Title</h3>
  <p className="text-gray-600">Card content goes here</p>
</div>
```

## States & Responsiveness

### Hover States
```jsx
<button className="bg-blue-500 hover:bg-blue-600">Hover me</button>
```

### Focus States
```jsx
<input className="border focus:border-blue-500 focus:outline-none" />
```

### Responsive Design
```jsx
<div className="w-full md:w-1/2 lg:w-1/3">
  {/* Full width on mobile, half on tablet, third on desktop */}
</div>
```
- `sm:` - Small screens (640px+)
- `md:` - Medium screens (768px+)  
- `lg:` - Large screens (1024px+)
- `xl:` - Extra large screens (1280px+)

## Debugging Tips

### See all classes in DevTools
- Inspect element → check which Tailwind classes are applied
- Look for overridden styles (crossed out)

### Common "Why isn't this working?" issues:
1. **Typo in class name** - `bg-blue-500` not `bg-blue500`
2. **Class not scanned** - Make sure file is in `tailwind.config.js` content array
3. **Conflicting classes** - Later classes override earlier ones: `text-red-500 text-blue-500` → blue wins
4. **Missing directive** - Make sure `@tailwind utilities;` is in your CSS

## Best Practices

### Group related classes
```jsx
// Good - logical grouping
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow">

// Avoid - random order  
<div className="bg-white flex shadow p-4 rounded-lg items-center justify-between">
```

### Use consistent spacing scale
```jsx
// Good - uses Tailwind's scale (4, 8, 16px)
<div className="p-4 mb-8 mt-4">

// Avoid - arbitrary values (use sparingly)
<div className="p-[13px] mb-[25px]">
```

### Extract repeated patterns into components
```jsx
// If you're repeating this everywhere, make a Button component
const Button = ({ children, ...props }) => (
  <button 
    className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded"
    {...props}
  >
    {children}
  </button>
);
```

## Quick Mental Model
Think of Tailwind classes as **describing what you want**, not how to achieve it:
- "I want blue background" → `bg-blue-500`
- "I want centered content" → `flex items-center justify-center`  
- "I want some padding" → `p-4`
- "I want it bigger on desktop" → `md:text-lg`

**Next:** Now you can style your bug reporter forms and UI without writing any custom CSS!