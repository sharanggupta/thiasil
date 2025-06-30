import { NextResponse } from 'next/server';
import { ErrorData } from '@/lib/error';

export async function POST(request: Request) {
  try {
    const errorData: ErrorData = await request.json();
    
    // In a real application, you would:
    // 1. Validate the error data
    // 2. Store in database or send to external service
    // 3. Maybe send alerts for critical errors
    
    console.error('Client Error:', {
      timestamp: errorData.timestamp,
      level: errorData.level,
      category: errorData.category,
      message: errorData.message,
      url: errorData.url,
      userAgent: errorData.userAgent,
    });
    
    // For now, just acknowledge receipt
    return NextResponse.json({ 
      success: true, 
      message: 'Error logged successfully' 
    });
    
  } catch (error) {
    console.error('Error logging failed:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to log error' },
      { status: 500 }
    );
  }
}