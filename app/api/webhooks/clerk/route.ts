import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

// A simplified webhook handler focused on debugging
export async function POST(req: Request) {
  // STEP 1: Log basic request information
  console.log('----------------------');
  console.log('CLERK WEBHOOK RECEIVED');
  console.log('----------------------');
  
  // STEP 2: Check environment variables (don't log the actual values)
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
  const mongoUri = process.env.MONGODB_URI;
  
  console.log('Environment check:');
  console.log(`- CLERK_WEBHOOK_SECRET: ${webhookSecret ? 'Set' : 'MISSING!'}`);
  console.log(`- MONGODB_URI: ${mongoUri ? 'Set' : 'MISSING!'}`);
  
  if (!webhookSecret || !mongoUri) {
    console.error('Missing required environment variables!');
    return new Response('Server configuration error: Missing required environment variables', {
      status: 500
    });
  }
  
  // STEP 3: Test MongoDB connection
  console.log('Testing MongoDB connection...');
  try {
    const client = await clientPromise;
    await client.db().command({ ping: 1 });
    console.log('✅ MongoDB connection successful');
  } catch (dbError) {
    console.error('❌ MongoDB connection failed:', dbError);
    return new Response(`Database connection error: ${dbError instanceof Error ? dbError.message : String(dbError)}`, {
      status: 500
    });
  }
  
  // STEP 4: Process headers
  const headersList = await headers();
  const svix_id = headersList.get("svix-id");
  const svix_timestamp = headersList.get("svix-timestamp");
  const svix_signature = headersList.get("svix-signature");
  
  console.log('Header check:');
  console.log(`- svix-id: ${svix_id ? 'Present' : 'MISSING!'}`);
  console.log(`- svix-timestamp: ${svix_timestamp ? 'Present' : 'MISSING!'}`);
  console.log(`- svix-signature: ${svix_signature ? 'Present' : 'MISSING!'}`);
  
  if (!svix_id || !svix_timestamp || !svix_signature) {
    console.error('Missing required Svix headers');
    return new Response('Error occurred -- missing webhook headers', {
      status: 400
    });
  }
  
  // STEP 5: Get and log the raw body
  let rawBody;
  try {
    rawBody = await req.text();
    console.log('Raw body received, length:', rawBody.length);
    // Log only the first 100 chars to avoid flooding logs
    console.log('Body preview:', rawBody.substring(0, 100) + '...');
  } catch (bodyError) {
    console.error('Error reading request body:', bodyError);
    return new Response('Error reading request body', {
      status: 400
    });
  }
  
  // STEP 6: Verify the webhook
  const wh = new Webhook(webhookSecret);
  let evt: WebhookEvent;
  
  try {
    evt = wh.verify(rawBody, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
    console.log('✅ Webhook signature verified successfully');
  } catch (verifyError) {
    console.error('❌ Webhook verification failed:', verifyError);
    return new Response(`Webhook verification failed: ${verifyError instanceof Error ? verifyError.message : 'Unknown error'}`, {
      status: 400
    });
  }
  
  // STEP 7: Parse the body
  let payload;
  try {
    payload = JSON.parse(rawBody);
    console.log('Event type:', payload.type);
    
    // For user events, log key information
    if (payload.type === 'user.created' || payload.type === 'user.updated') {
      const { id, email_addresses } = payload.data;
      const primaryEmail = email_addresses && email_addresses.length > 0 
        ? email_addresses[0].email_address 
        : 'No email found';
        
      console.log(`User ID: ${id || 'Missing!'}`);
      console.log(`Primary email: ${primaryEmail}`);
    }
  } catch (parseError) {
    console.error('Error parsing webhook JSON:', parseError);
    return new Response('Invalid JSON payload', {
      status: 400
    });
  }
  
  // STEP 8: Store data in MongoDB
  try {
    console.log('Attempting to store event in database...');
    const client = await clientPromise;
    const db = client.db();
    
    // Create a collection specifically for webhook logs
    const collection = db.collection('webhook_logs');
    
    // Store the entire event plus metadata
    const result = await collection.insertOne({
      event_type: payload.type,
      event_id: svix_id,
      timestamp: new Date(),
      data: payload,
      raw_headers: {
        'svix-id': svix_id,
        'svix-timestamp': svix_timestamp,
        'svix-signature': svix_signature?.substring(0, 10) + '...' // Only store part of the signature
      }
    });
    
    console.log('✅ Event stored in database:', result.insertedId);
    
    // If this is a user event, also try to store in users collection
    if (payload.type === 'user.created' || payload.type === 'user.updated') {
      const { id, email_addresses, first_name, last_name, image_url } = payload.data;
      
      if (!id) {
        console.error('No user ID found in data!');
      } else {
        const primaryEmail = email_addresses && email_addresses.length > 0 
          ? email_addresses[0].email_address 
          : null;
          
        if (!primaryEmail) {
          console.error('No email address found for user:', id);
        } else {
          // Combine name
          const fullName = [first_name, last_name].filter(Boolean).join(' ') || 'Anonymous';
          
          // Try to store in users collection
          const usersCollection = db.collection('users');
          const userResult = await usersCollection.updateOne(
            { userId: id },
            {
              $set: {
                name: fullName,
                email: primaryEmail,
                imageUrl: image_url || undefined,
                updatedAt: new Date(),
              },
              $setOnInsert: {
                userId: id,
                isActive: true,
                createdAt: new Date(),
              }
            },
            { upsert: true }
          );
          
          console.log('User storage result:', {
            acknowledged: userResult.acknowledged,
            matchedCount: userResult.matchedCount,
            modifiedCount: userResult.modifiedCount,
            upsertedCount: userResult.upsertedCount,
            upsertedId: userResult.upsertedId
          });
        }
      }
    }
  } catch (dbError) {
    console.error('❌ Database operation failed:', dbError);
    // Continue processing instead of returning error
    // This way we at least acknowledge the webhook even if storage fails
    console.log('Continuing despite database error to acknowledge webhook');
  }
  
  // STEP 9: Always acknowledge the webhook
  console.log('Webhook processing completed');
  return NextResponse.json({ 
    success: true,
    message: `Webhook processed successfully` 
  });
}