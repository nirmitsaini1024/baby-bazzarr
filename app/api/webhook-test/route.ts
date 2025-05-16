import { NextResponse } from 'next/server';

// This just returns a simple response to verify the endpoint is accessible
export async function GET() {
  return NextResponse.json({ 
    status: 'online',
    message: 'Webhook endpoint is accessible',
    timestamp: new Date().toISOString()
  });
}

// Also handle POST just to confirm it works
export async function POST() {
  return NextResponse.json({ 
    status: 'online',
    message: 'Webhook endpoint POST is working',
    timestamp: new Date().toISOString()
  });
}