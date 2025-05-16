import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

export async function POST(req: Request) {
  console.log('📣 Clerk webhook received');
  
  // Get the webhook secret
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error('❌ CLERK_WEBHOOK_SECRET is missing');
    return new Response('Server configuration error', {
      status: 500
    });
  }
  
  // Get the headers
  const headersList = await headers();
  const svix_id = headersList.get("svix-id");
  const svix_timestamp = headersList.get("svix-timestamp");
  const svix_signature = headersList.get("svix-signature");
  
  if (!svix_id || !svix_timestamp || !svix_signature) {
    console.error('❌ Missing required Svix headers');
    return new Response('Missing webhook headers', {
      status: 400
    });
  }
  
  // Get the body as text
  let rawBody: string;
  try {
    rawBody = await req.text();
    console.log('✅ Webhook body received, length:', rawBody.length);
  } catch (error) {
    console.error('❌ Error reading request body:', error);
    return new Response('Error reading request body', {
      status: 400
    });
  }
  
  // Verify the webhook
  const wh = new Webhook(webhookSecret);
  let evt: WebhookEvent;
  
  try {
    evt = wh.verify(rawBody, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
    console.log('✅ Webhook signature verified successfully');
  } catch (error) {
    console.error('❌ Webhook verification failed:', error);
    return new Response(`Webhook verification failed: ${error instanceof Error ? error.message : 'Unknown error'}`, {
      status: 400
    });
  }
  
  // Parse the body
  let payload: any;
  try {
    payload = JSON.parse(rawBody);
    console.log('📌 Event type:', payload.type);
  } catch (error) {
    console.error('❌ Error parsing webhook JSON:', error);
    return new Response('Invalid JSON payload', {
      status: 400
    });
  }
  
  // Process the webhook event
  try {
    if (payload.type === 'user.created' || payload.type === 'user.updated') {
      // Extract user data
      const { id, email_addresses, first_name, last_name, image_url, phone_numbers } = payload.data;
      
      if (!id) {
        console.error('❌ No user ID in webhook data');
        return new Response('Missing user ID in webhook data', { status: 400 });
      }
      
      // Get the primary email
      const primaryEmail = email_addresses && email_addresses.length > 0 
        ? email_addresses[0].email_address 
        : null;
      
      if (!primaryEmail) {
        console.error('❌ No email found for user:', id);
        return new Response('No email found in user data', { status: 400 });
      }
      
      // Get phone if available
      const primaryPhone = phone_numbers && phone_numbers.length > 0
        ? phone_numbers[0].phone_number
        : null;

      // Combine first and last name
      const fullName = [first_name, last_name].filter(Boolean).join(' ') || 'Anonymous';
      
      console.log(`📝 Processing user: ${id} (${fullName}, ${primaryEmail})`);
      
      // Connect to MongoDB and store user
      const client = await clientPromise;
      const db = client.db();
      const usersCollection = db.collection('users');
      
      // Update or insert user
      const result = await usersCollection.updateOne(
        { userId: id },
        {
          $set: {
            name: fullName,
            email: primaryEmail,
            phone: primaryPhone,
            imageUrl: image_url || null,
            isActive: true,
            updatedAt: new Date(),
          },
          $setOnInsert: {
            userId: id,
            createdAt: new Date(),
          }
        },
        { upsert: true }
      );
      
      console.log('✅ User data stored in MongoDB:', {
        matchedCount: result.matchedCount,
        modifiedCount: result.modifiedCount,
        upsertedCount: result.upsertedCount
      });
      
      return NextResponse.json({ 
        success: true,
        message: `User ${payload.type === 'user.created' ? 'created' : 'updated'} successfully`,
        userId: id
      });
    } 
    else if (payload.type === 'user.deleted') {
      const { id } = payload.data;
      
      if (!id) {
        console.error('❌ No user ID in user.deleted webhook');
        return new Response('Missing user ID in webhook data', { status: 400 });
      }
      
      console.log(`🗑️ Processing user deletion: ${id}`);
      
      // Connect to MongoDB and mark user as deleted
      const client = await clientPromise;
      const db = client.db();
      const usersCollection = db.collection('users');
      
      // Soft delete (mark as inactive)
      await usersCollection.updateOne(
        { userId: id },
        {
          $set: {
            isActive: false,
            updatedAt: new Date()
          }
        }
      );
      
      console.log(`✅ User ${id} marked as deleted`);
      
      return NextResponse.json({ 
        success: true,
        message: 'User marked as deleted successfully',
        userId: id
      });
    }
    else {
      // For other event types we don't handle
      console.log(`ℹ️ Unhandled event type: ${payload.type}`);
      return NextResponse.json({ 
        success: true,
        message: `Webhook acknowledged: ${payload.type}` 
      });
    }
  } catch (error) {
    console.error(`❌ Error processing webhook:`, error);
    return new Response(
      `Error processing webhook: ${error instanceof Error ? error.message : 'Unknown error'}`, 
      { status: 500 }
    );
  }
}