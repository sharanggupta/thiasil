import { NextRequest, NextResponse } from 'next/server';
import productsData from '../../../data/products.json';

export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');

  if (category) {
    // Return specific category data
    const categoryData = productsData.productVariants[category as keyof typeof productsData.productVariants];
    if (!categoryData) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }
    return NextResponse.json(categoryData);
  }

  // Return all products
  return NextResponse.json({
    products: productsData.products,
    categories: Object.keys(productsData.productVariants)
  });
} 