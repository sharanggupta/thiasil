# Component Props Documentation

This document provides comprehensive documentation for all component props in the Thiasil application.

## Core Components

### Button Component
**Location**: `src/app/components/MainButton/Button.tsx`

```typescript
interface ButtonProps {
  name: string;                    // Button text content
  color?: string;                  // Text color (default: "#fff")
  bgColor?: string;               // Background color (default: "#0A6EBD")
  size?: "small" | "medium" | "large"; // Button size variant
  padding?: string;               // Custom padding classes
  textSize?: string;              // Text size classes
  className?: string;             // Additional CSS classes
  onClick?: () => void;           // Click handler
  disabled?: boolean;             // Disabled state
  type?: "button" | "submit" | "reset"; // Button type
}
```

**Usage Example**:
```tsx
<Button
  name="Contact Us"
  bgColor="#0A6EBD"
  color="#fff"
  size="large"
  onClick={handleContact}
/>
```

### ProductCard Component
**Location**: `src/app/components/ui/ProductCard.tsx`

```typescript
interface ProductCardProps {
  product: {
    id: number;
    name: string;
    category: string;
    categorySlug: string;
    catNo: string;
    description?: string;
    image?: string;
    priceRange?: string;
    capacity?: string;
    packaging?: string;
  };
  className?: string;             // Additional CSS classes
  variant?: "default" | "compact"; // Card layout variant
}
```

### GlassCard Component
**Location**: `src/app/components/Glassmorphism/index.tsx`

```typescript
interface GlassCardProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "accent" | "success" | "warning"; // Visual variant
  padding?: "none" | "small" | "default" | "large"; // Padding size
  className?: string;             // Additional CSS classes
  onClick?: () => void;           // Click handler
}
```

### Navbar Component
**Location**: `src/app/components/Navbar/Navbar.tsx`

```typescript
interface NavbarProps {
  theme?: "default" | "products" | "transparent"; // Color theme
  className?: string;             // Additional CSS classes
}
```

### Heading Component
**Location**: `src/app/components/common/Heading.tsx`

```typescript
interface HeadingProps {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6"; // HTML heading element
  size?: "primary" | "secondary" | "tertiary"; // Size variant
  gradient?: string;              // CSS gradient for text
  className?: string;             // Additional CSS classes
  children: React.ReactNode;      // Heading content
}
```

### LoadingSpinner Component
**Location**: `src/app/components/ui/LoadingSpinner.tsx`

```typescript
interface LoadingSpinnerProps {
  size?: "small" | "medium" | "large"; // Spinner size
  color?: string;                 // Spinner color
  className?: string;             // Additional CSS classes
}
```

### SuspenseWrapper Component
**Location**: `src/app/components/ui/SuspenseWrapper.tsx`

```typescript
interface SuspenseWrapperProps {
  children: React.ReactNode;      // Content to wrap
  fallback?: React.ReactNode;     // Custom loading fallback
  className?: string;             // Additional CSS classes
}
```

### ErrorBoundary Component
**Location**: `src/app/components/ui/ErrorBoundary.tsx`

```typescript
interface ErrorBoundaryProps {
  children: React.ReactNode;      // Content to protect
  fallback?: React.ReactNode;     // Custom error fallback
  onError?: (error: Error, errorInfo: ErrorInfo) => void; // Error handler
}
```

## Form Components

### ContactFormGlass Component
**Location**: `src/app/components/ContactForm/ContactFormGlass.tsx`

```typescript
interface ContactFormGlassProps {
  initialName?: string;           // Pre-filled name
  initialEmail?: string;          // Pre-filled email
  initialPhone?: string;          // Pre-filled phone
}
```

## Server Components

### ProductDataFetcher Component
**Location**: `src/app/components/server/ProductDataFetcher.tsx`

```typescript
interface ProductDataProps {
  children: (products: Product[]) => React.ReactNode; // Render prop
}
```

### ServerProductList Component
**Location**: `src/app/components/server/ServerProductList.tsx`

```typescript
interface ServerProductListProps {
  category?: string;              // Filter by category
  limit?: number;                 // Limit number of products
  className?: string;             // Additional CSS classes
}
```

## Layout Components

### Breadcrumb Component
**Location**: `src/app/components/common/Breadcrumb.tsx`

```typescript
interface BreadcrumbProps {
  items: Array<{
    href?: string;                // Link URL (optional for current page)
    label: string;                // Display text
  }>;
  className?: string;             // Additional CSS classes
  separator?: string;             // Custom separator (default: "/")
}
```

## Concurrent Components

### TransitionWrapper Component
**Location**: `src/app/components/concurrent/TransitionWrapper.tsx`

```typescript
interface TransitionWrapperProps {
  children: React.ReactNode;      // Content to wrap
  onTransition?: () => void;      // Transition callback
}
```

### DeferredComponent Component
**Location**: `src/app/components/concurrent/DeferredComponent.tsx`

```typescript
interface DeferredComponentProps {
  children: React.ReactNode;      // Content to defer
  value: any;                     // Value to defer
  fallback?: React.ReactNode;     // Loading fallback
}
```

## Prop Validation Guidelines

### Required Props
- Always mark required props without `?`
- Provide clear TypeScript interfaces
- Use descriptive prop names

### Optional Props
- Use `?` for optional props
- Provide sensible defaults
- Document default values in comments

### Prop Naming Conventions
- Use camelCase for prop names
- Use descriptive names that indicate purpose
- Prefix boolean props with `is`, `has`, or `should`
- Use `on` prefix for event handlers

### Type Safety
- Use specific types over `any`
- Create interfaces for complex object props
- Use union types for controlled variants
- Leverage TypeScript strict mode

## Best Practices

1. **Prop Drilling**: Avoid deep prop drilling by using context or state management
2. **Default Props**: Use defaultProps or default parameters for consistency
3. **Prop Validation**: Use TypeScript interfaces for compile-time validation
4. **Documentation**: Always document complex props with comments
5. **Backwards Compatibility**: Be careful when changing existing prop interfaces

## Usage Examples

### Basic Component Usage
```tsx
import { Button, ProductCard, GlassCard } from '@/components';

function ExampleUsage() {
  return (
    <GlassCard variant="primary" padding="large">
      <ProductCard product={productData} />
      <Button 
        name="Learn More"
        size="medium"
        onClick={() => console.log('Clicked')}
      />
    </GlassCard>
  );
}
```

### Server Component Usage
```tsx
import { ServerProductList, ProductDataFetcher } from '@/components/server';

async function ServerPage() {
  return (
    <ProductDataFetcher>
      {(products) => (
        <ServerProductList 
          category="crucibles"
          limit={10}
          className="grid-cols-2"
        />
      )}
    </ProductDataFetcher>
  );
}
```

This documentation should be updated whenever component interfaces change to maintain accuracy and developer experience.