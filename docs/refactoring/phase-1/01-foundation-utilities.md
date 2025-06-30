# 🏗️ Foundation & Utilities Setup

## 📋 Task Checklist
- [ ] Convert utility files in `lib/` to TypeScript (safe, isolated functions)
- [ ] Add TypeScript configuration (`tsconfig.json`) without forcing conversion
- [ ] Extract constants from `lib/constants.js` into separate constant files
- [ ] Consolidate duplicate utility functions across components
- [ ] Add JSDoc comments to all utility functions for better IntelliSense

---

## 🔧 Task 1: Add TypeScript Configuration

### Steps:
1. **Create `tsconfig.json`:**
```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": false,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

2. **Create `next-env.d.ts`:**
```typescript
/// <reference types="next" />
/// <reference types="next/image-types/global" />
```

3. **Install TypeScript dependencies:**
```bash
npm install --save-dev typescript @types/react @types/node
```

### Validation:
- [ ] TypeScript configuration doesn't break existing JavaScript files
- [ ] Next.js development server starts without errors
- [ ] IntelliSense works in VS Code for existing files

---

## 🔧 Task 2: Convert Utility Files to TypeScript

### Target Files:
- `src/lib/utils.js` → `src/lib/utils.ts`
- `src/lib/price.js` → `src/lib/price.ts`
- `src/lib/date.js` → `src/lib/date.ts`
- `src/lib/array.js` → `src/lib/array.ts`
- `src/lib/validation.js` → `src/lib/validation.ts`

### Steps for each file:
1. **Rename file extension** from `.js` to `.ts`
2. **Add type annotations** to function parameters and return types
3. **Update imports** in components that use these utilities
4. **Test thoroughly** to ensure no runtime errors

### Example (utils.js → utils.ts):
```typescript
// Before (utils.js)
export function getBaseCatalogNumber(catNo) {
  if (!catNo) return '';
  return catNo.split(' ')[0];
}

// After (utils.ts)
export function getBaseCatalogNumber(catNo: string | null | undefined): string {
  if (!catNo) return '';
  return catNo.split(' ')[0];
}
```

### Validation:
- [ ] All utility functions have proper type annotations
- [ ] No TypeScript compilation errors
- [ ] All components using utilities still work correctly
- [ ] IntelliSense provides better autocomplete

---

## 🔧 Task 3: Extract Constants into Separate Files

### Current State:
Constants are scattered across files and some are inline

### Target Structure:
```
src/lib/constants/
├── index.ts              # Re-export all constants
├── api.ts               # API endpoints and configs
├── ui.ts                # UI-related constants
├── products.ts          # Product-related constants
├── admin.ts             # Admin panel constants
└── navigation.ts        # Already exists
```

### Steps:
1. **Audit existing constants** across the codebase
2. **Create constant files** with appropriate groupings
3. **Move hardcoded values** into constants
4. **Update imports** throughout the application

### Example Constants:
```typescript
// src/lib/constants/ui.ts
export const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
export const ITEMS_PER_PAGE = 20;
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// src/lib/constants/api.ts
export const API_ENDPOINTS = {
  PRODUCTS: '/api/products',
  COUPONS: '/api/coupons',
  ADMIN: {
    BACKUP: '/api/admin/backup-management',
    PRICES: '/api/admin/update-prices',
    INVENTORY: '/api/admin/update-inventory',
  },
} as const;
```

### Validation:
- [ ] All hardcoded values moved to appropriate constant files
- [ ] Constants are properly typed with `as const` where needed
- [ ] All imports updated and working
- [ ] No magic numbers or strings remain in components

---

## 🔧 Task 4: Consolidate Duplicate Utility Functions

### Audit Results:
Search for patterns like:
- Price formatting logic
- Date formatting
- Image path construction
- Form validation patterns

### Steps:
1. **Identify duplicates** using search patterns:
```bash
grep -r "toFixed(2)" src/
grep -r "new Date" src/
grep -r "₹" src/
```

2. **Create centralized versions** in appropriate utility files
3. **Replace all instances** with centralized function calls
4. **Test thoroughly** to ensure consistent behavior

### Example Consolidation:
```typescript
// Before: Scattered price formatting
component1: `₹${price.toFixed(2)}`
component2: `₹${amount.toFixed(2)}`
component3: `₹${cost.toFixed(2)}`

// After: Centralized utility
// src/lib/price.ts
export function formatPrice(amount: number): string {
  return `₹${amount.toFixed(2)}`;
}

// Usage in components
formatPrice(price)
formatPrice(amount)
formatPrice(cost)
```

### Validation:
- [ ] No duplicate logic exists across components
- [ ] All price formatting is consistent
- [ ] Date handling is standardized
- [ ] Image path construction is unified

---

## 🔧 Task 5: Add JSDoc Comments

### Target Files:
All utility functions in `src/lib/`

### JSDoc Template:
```typescript
/**
 * Brief description of what the function does
 * @param {type} paramName - Description of parameter
 * @returns {type} Description of return value
 * @example
 * // Usage example
 * const result = functionName(input);
 */
```

### Example:
```typescript
/**
 * Extracts the base catalog number from a full catalog string
 * @param catNo - The full catalog number (e.g., "1100 Series")
 * @returns The base catalog number (e.g., "1100")
 * @example
 * // Extract base number
 * const base = getBaseCatalogNumber("1100 Series"); // "1100"
 */
export function getBaseCatalogNumber(catNo: string | null | undefined): string {
  if (!catNo) return '';
  return catNo.split(' ')[0];
}
```

### Validation:
- [ ] All utility functions have JSDoc comments
- [ ] Examples are provided for complex functions
- [ ] Parameter types and descriptions are accurate
- [ ] IntelliSense shows helpful documentation in VS Code

---

## ✅ Phase 1.1 Completion Checklist

### Before Moving to Next Task:
- [ ] TypeScript configuration is working
- [ ] All utility files converted to TypeScript
- [ ] Constants extracted and organized
- [ ] Duplicate utilities consolidated
- [ ] JSDoc comments added to all functions
- [ ] No TypeScript compilation errors
- [ ] All existing functionality still works
- [ ] IntelliSense is improved in development

### Files Changed:
- [ ] `tsconfig.json` (created)
- [ ] `next-env.d.ts` (created)
- [ ] `src/lib/*.ts` (converted from .js)
- [ ] `src/lib/constants/*.ts` (new constant files)
- [ ] Components importing utilities (updated imports)

### Time Estimate: 4-6 hours
### Risk Level: 🟢 Very Low