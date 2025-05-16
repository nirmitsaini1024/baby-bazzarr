import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

// A super minimal webhook handler that just logs everything and responds
export async function POST(req: Request) {
  console.log('🔍 WEBHOOK DEBUG: Received request');
  
  // Log all environment variables (don't log sensitive values)
  console.log('🔍 WEBHOOK DEBUG: Environment variables check');
  console.log(`- NODE_ENV: ${process.env.NODE_ENV}`);
  console.log(`- MONGODB_URI exists: ${Boolean(process.env.MONGODB_URI)}`);
  console.log(`- CLERK_WEBHOOK_SECRET exists: ${Boolean(process.env.CLERK_WEBHOOK_SECRET)}`);
  
  // Log all headers
  console.log('🔍 WEBHOOK DEBUG: Request headers');
  const headersList = await headers();
  const allHeaders = Object.fromEntries(headersList.entries());
  console.log(JSON.stringify(allHeaders, null, 2));
  
  // Log request method and URL
  console.log(`🔍 WEBHOOK DEBUG: ${req.method} ${req.url}`);
  
  // Try to get the body
  try {
    const bodyText = await req.text();
    console.log(`🔍 WEBHOOK DEBUG: Request body (first 500 chars):`);
    console.log(bodyText.substring(0, 500));
    
    // Try to parse as JSON
    try {
      const bodyJson = JSON.parse(bodyText);
      console.log('🔍 WEBHOOK DEBUG: Body is valid JSON');
      console.log(`Event type: ${bodyJson.type}`);
    } catch (jsonError) {
      console.log('🔍 WEBHOOK DEBUG: Body is not valid JSON');
    }
  } catch (bodyError) {
    console.log('🔍 WEBHOOK DEBUG: Could not read request body', bodyError);
  }
  
  // Always return 200 to acknowledge
  console.log('🔍 WEBHOOK DEBUG: Returning 200 response');
  return NextResponse.json({ success: true, message: 'Webhook received' });
}