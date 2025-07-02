import { deleteValue, getValue, listPush, setValue } from '@/lib/redis-client';
import { NextResponse } from 'next/server';

// GET - Retrieve data from Redis
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key') || 'test-key';
    
    const result = await getValue(key);
    
    if (!result.success) {
      return NextResponse.json(
        { error: 'Failed to get value from Redis', details: result.error },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      key,
      value: result.value,
      message: result.value ? 'Value retrieved successfully' : 'Key not found'
    });
    
  } catch (error) {
    console.error('Redis GET API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

// POST - Store data in Redis
export async function POST(request) {
  try {
    const body = await request.json();
    const { key, value, ttl } = body;
    
    if (!key || value === undefined) {
      return NextResponse.json(
        { error: 'Key and value are required' },
        { status: 400 }
      );
    }
    
    const result = await setValue(key, value, ttl);
    
    if (!result.success) {
      return NextResponse.json(
        { error: 'Failed to set value in Redis', details: result.error },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      key,
      message: 'Value stored successfully',
      ttl: ttl || 'no expiration'
    });
    
  } catch (error) {
    console.error('Redis POST API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Remove data from Redis
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');
    
    if (!key) {
      return NextResponse.json(
        { error: 'Key parameter is required' },
        { status: 400 }
      );
    }
    
    const result = await deleteValue(key);
    
    if (!result.success) {
      return NextResponse.json(
        { error: 'Failed to delete value from Redis', details: result.error },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      key,
      message: 'Value deleted successfully'
    });
    
  } catch (error) {
    console.error('Redis DELETE API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

// PUT - Add to list in Redis
export async function PUT(request) {
  try {
    const body = await request.json();
    const { key, value } = body;
    
    if (!key || value === undefined) {
      return NextResponse.json(
        { error: 'Key and value are required' },
        { status: 400 }
      );
    }
    
    const result = await listPush(key, value);
    
    if (!result.success) {
      return NextResponse.json(
        { error: 'Failed to add value to list in Redis', details: result.error },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      key,
      message: 'Value added to list successfully'
    });
    
  } catch (error) {
    console.error('Redis PUT API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
} 