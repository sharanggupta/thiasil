export const mockProduct = {
  id: 'test-001',
  name: 'Test Beaker',
  description: 'A test beaker for testing purposes',
  category: 'Beakers',
  categorySlug: 'beakers',
  catNo: 'TB001',
  price: '₹150.00',
  priceRange: '₹150.00 - ₹300.00',
  capacity: '250ml',
  packaging: 'Individual',
  stockStatus: 'in_stock' as const,
  quantity: 10,
  dimensions: {
    height: '10cm',
    diameter: '5cm'
  },
  features: ['Borosilicate glass', 'Heat resistant'],
  imageUrl: '/test-images/beaker.jpg'
}

export const mockProducts = [
  mockProduct,
  {
    ...mockProduct,
    id: 'test-002',
    name: 'Test Flask',
    catNo: 'TF001',
    stockStatus: 'out_of_stock' as const,
    quantity: 0
  }
]

export const mockCoupon = {
  code: 'TEST10',
  discount: 10,
  type: 'percentage' as const,
  minOrder: 100,
  maxDiscount: 50,
  isActive: true,
  expiryDate: '2024-12-31',
  description: '10% off your order'
}

export const mockAdminCredentials = {
  username: 'testadmin',
  password: 'testpass123'
}