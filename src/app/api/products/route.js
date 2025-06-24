import productsData from '../../../data/products.json';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');

  if (category) {
    // Return specific category data
    const categoryData = productsData.productVariants[category];
    if (!categoryData) {
      return Response.json({ error: 'Category not found' }, { status: 404 });
    }
    return Response.json(categoryData);
  }

  // Return all products
  return Response.json({
    products: productsData.products,
    categories: Object.keys(productsData.productVariants)
  });
} 