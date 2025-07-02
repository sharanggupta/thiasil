/**
 * TypeScript interfaces for UI components
 */

import { ReactNode } from 'react';

/**
 * Represents the dimensional properties of a product
 */
export interface ProductDimensions {
  /** Length measurement */
  length?: string | number;
  /** Width measurement */
  width?: string | number;
  /** Height measurement */
  height?: string | number;
  /** Diameter measurement */
  diameter?: string | number;
  /** Additional dimension properties */
  [key: string]: string | number | undefined;
}

/**
 * Represents a product with all its properties
 */
export interface Product {
  /** Product display name */
  name?: string;
  /** Catalog number (required identifier) */
  catNo: string;
  /** Current stock availability status */
  stockStatus?: 'in_stock' | 'out_of_stock' | string;
  /** Product capacity information */
  capacity?: string;
  /** Physical dimensions of the product */
  dimensions?: ProductDimensions;
  /** Packaging information */
  packaging?: string;
  /** URL-friendly category identifier */
  categorySlug?: string;
  /** Product category name */
  category?: string;
  /** Additional product properties */
  [key: string]: any;
}

/**
 * Represents a discount coupon
 */
export interface Coupon {
  /** Coupon code identifier */
  code: string;
  /** Discount percentage value */
  discountPercent: number;
  /** Additional coupon properties */
  [key: string]: any;
}

/**
 * Props interface for the ProductCard component
 */
export interface ProductCardProps {
  /** Product data to display in the card (required) */
  readonly product: Product;
  /** Optional active coupon for discount display */
  readonly activeCoupon?: Coupon | null;
  /** Custom price string to display */
  readonly displayPrice?: string | null;
  /** Callback when the card is clicked */
  readonly onCardClick?: (() => void) | null;
  /** Additional CSS classes */
  readonly className?: string;
  /** Custom content for the card's back side */
  readonly backContent?: ReactNode | null;
  /** Custom text for the action button */
  readonly buttonText?: string | null;
  /** Custom URL for button navigation */
  readonly buttonHref?: string | null;
  /** Callback for button click events */
  readonly buttonOnClick?: (() => void) | null;
  /** Loading state indicator */
  readonly loading?: boolean;
  /** Additional props passed to the card element */
  readonly [key: string]: any;
}