// Coupon Components
export { default as CouponInput } from './CouponInput';
export { default as CouponDisplay } from './CouponDisplay';
export { default as PriceDisplay, ProductPrice, OrderSummaryPrice, QuickPrice } from './PriceDisplay';

// Coupon Context and Hooks
export {
  CouponProvider,
  useCouponContext,
  useCouponDiscount,
  useCouponInput,
  useCouponDisplay,
  useCouponHistory
} from '@/contexts/CouponContext';

// Discount Utilities
export {
  DiscountCalculator,
  PriceExtractor,
  discountUtils
} from '@/lib/utils/discount';

// Types
export type {
  DiscountCalculationResult,
  PriceRange,
  DiscountedPriceRange
} from '@/lib/utils/discount';

export type {
  Coupon,
  CouponValidationResult
} from '@/lib/hooks/useCoupons';