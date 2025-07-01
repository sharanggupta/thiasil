// Mock product data for testing
export const mockProducts = [
  {
    id: 'beaker-500ml',
    catNo: 'TB001',
    name: 'Test Beaker',
    description: 'High quality borosilicate glass beaker',
    category: 'Beakers',
    categorySlug: 'beakers',
    price: '₹300.00',
    stockStatus: 'in_stock',
    capacity: '500ml',
    dimensions: {
      height: '95',
      diameter: '85'
    },
    packaging: 'Individual',
    features: ['Borosilicate glass', 'Graduated markings', 'Spout for pouring'],
    specifications: {
      material: 'Borosilicate Glass',
      grade: 'Class A',
      tolerance: '±5%'
    }
  },
  {
    id: 'flask-250ml',
    catNo: 'TF001',
    name: 'Test Flask',
    description: 'Erlenmeyer flask for laboratory use',
    category: 'Flasks',
    categorySlug: 'flasks',
    price: '₹250.00',
    stockStatus: 'in_stock',
    capacity: '250ml',
    dimensions: {
      height: '110',
      diameter: '65'
    },
    packaging: 'Individual',
    features: ['Narrow neck', 'Heat resistant', 'Clear graduations'],
    specifications: {
      material: 'Borosilicate Glass',
      grade: 'Class A',
      tolerance: '±2%'
    }
  },
  {
    id: 'pipette-out-of-stock',
    catNo: 'TP001',
    name: 'Test Pipette',
    description: 'Precision pipette for accurate measurements',
    category: 'Pipettes',
    categorySlug: 'pipettes',
    price: '₹150.00',
    stockStatus: 'out_of_stock',
    capacity: '10ml',
    dimensions: {
      length: '350',
      diameter: '8'
    },
    packaging: 'Pack of 10',
    features: ['High accuracy', 'Easy to clean', 'Durable construction'],
    specifications: {
      material: 'Polypropylene',
      accuracy: '±0.1ml',
      autoclavable: true
    }
  }
]

// Mock coupon data
export const mockCoupon = {
  code: 'SAVE10',
  discountPercent: 10,
  isValid: true,
  expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  minimumOrderValue: 100,
  maxDiscount: 500,
  description: '10% off on all products'
}

export const mockInvalidCoupon = {
  code: 'INVALID',
  isValid: false,
  error: 'Invalid coupon code'
}

// Mock API responses
export const mockApiResponses = {
  products: {
    success: true,
    data: mockProducts,
    total: mockProducts.length
  },
  
  couponValidation: (code: string) => {
    if (code === mockCoupon.code) {
      return {
        success: true,
        isValid: true,
        coupon: mockCoupon,
        discount: mockCoupon.discountPercent
      }
    }
    return {
      success: false,
      isValid: false,
      error: 'Invalid coupon code'
    }
  }
}

export default {
  mockProducts,
  mockCoupon,
  mockInvalidCoupon,
  mockApiResponses
}