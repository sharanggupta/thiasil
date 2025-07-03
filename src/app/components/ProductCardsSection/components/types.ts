export interface ProductCardData {
  id: string;
  title: string[];
  capacity: string;
  packaging: string;
  pricing: string;
  startingPrice: string;
  gradientClass: string;
  backSideClass: string;
  ctaClass: string;
  headingClasses: string[];
}

export interface ProductCardProps {
  card: ProductCardData;
  onBuyNow: () => void;
}