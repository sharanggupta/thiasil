import fs from 'fs/promises';
import { NextResponse } from 'next/server';
import path from 'path';

const COUPONS_FILE = path.join(process.cwd(), 'src', 'data', 'coupons.json');

export async function POST(request) {
  try {
    const { code } = await request.json();

    if (!code) {
      return NextResponse.json(
        { error: 'Coupon code is required' },
        { status: 400 }
      );
    }

    // Read coupons file
    let coupons = [];
    try {
      const existingCoupons = await fs.readFile(COUPONS_FILE, 'utf8');
      coupons = JSON.parse(existingCoupons);
    } catch {
      return NextResponse.json(
        { error: 'No coupons available' },
        { status: 404 }
      );
    }

    // Find the coupon
    const coupon = coupons.find(c => c.code === code.toUpperCase());

    if (!coupon) {
      return NextResponse.json(
        { error: 'Invalid coupon code' },
        { status: 404 }
      );
    }

    // Check if coupon is active
    if (!coupon.isActive) {
      return NextResponse.json(
        { error: 'Coupon is inactive' },
        { status: 400 }
      );
    }

    // Check if coupon has expired
    const now = new Date();
    const expiryDate = new Date(coupon.expiryDate);
    if (now > expiryDate) {
      return NextResponse.json(
        { error: 'Coupon has expired' },
        { status: 400 }
      );
    }

    // Check if coupon has reached max uses
    if (coupon.maxUses && coupon.currentUses >= coupon.maxUses) {
      return NextResponse.json(
        { error: 'Coupon usage limit reached' },
        { status: 400 }
      );
    }

    // Increment usage count
    coupon.currentUses++;
    await fs.writeFile(COUPONS_FILE, JSON.stringify(coupons, null, 2));

    return NextResponse.json({
      success: true,
      coupon: {
        code: coupon.code,
        discountPercent: coupon.discountPercent,
        maxUses: coupon.maxUses,
        currentUses: coupon.currentUses
      }
    });

  } catch (error) {
    console.error('Coupon validation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Read coupons file
    let coupons = [];
    try {
      const existingCoupons = await fs.readFile(COUPONS_FILE, 'utf8');
      coupons = JSON.parse(existingCoupons);
    } catch {
      // Return empty array if file doesn't exist
    }

    // Return only active, non-expired coupons
    const now = new Date();
    const activeCoupons = coupons.filter(coupon => {
      if (!coupon.isActive) return false;
      const expiryDate = new Date(coupon.expiryDate);
      if (now > expiryDate) return false;
      if (coupon.maxUses && coupon.currentUses >= coupon.maxUses) return false;
      return true;
    });

    return NextResponse.json({
      success: true,
      coupons: activeCoupons,
      count: activeCoupons.length
    });

  } catch (error) {
    console.error('Error fetching coupons:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 