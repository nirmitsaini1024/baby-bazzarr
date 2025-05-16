import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { updateUserProfile, markUserDeleted } from '@/models/user'

export async function POST(req: Request) {
  console.log('📣 Webhook received from Clerk');
  
  // Get the headers
  const headersList = await headers();
  const svix_id = headersList.get("svix-id");
  const svix_timestamp = headersList.get("svix-timestamp");
  const svix_signature = headersList.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    console.error('❌ Missing Svix headers');
    return new Response('Error occurred -- missing webhook headers', {
      status: 400
    });
  }

  // Get the body as text first for verification
  let rawBody;
  try {
    rawBody = await req.text();
  } catch (error) {
    console.error('❌ Error reading request body:', error);
    return new Response('Error reading request body', {
      status: 400
    });
  }
  
  // Verify the webhook signature
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error('❌ CLERK_WEBHOOK_SECRET is missing');
    return new Response('Server configuration error', {
      status: 500
    });
  }
  
  const wh = new Webhook(webhookSecret);
  let evt: WebhookEvent;

  try {
    evt = wh.verify(rawBody, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
    console.log('✅ Webhook signature verified');
  } catch (err) {
    console.error('❌ Error verifying webhook signature:', err);
    return new Response(`Error verifying webhook: ${err instanceof Error ? err.message : 'Unknown error'}`, {
      status: 400
    });
  }

  // Parse the body as JSON after verification
  let payload;
  try {
    payload = JSON.parse(rawBody);
  } catch (error) {
    console.error('❌ Error parsing webhook payload as JSON:', error);
    return new Response('Invalid JSON payload', {
      status: 400
    });
  }

  // Handle the webhook
  const eventType = evt.type;
  console.log(`📌 Processing webhook event: ${eventType}`);
  
  try {
    if (eventType === 'user.created' || eventType === 'user.updated') {
      const { id, email_addresses, first_name, last_name, image_url } = evt.data;
      
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

      // Combine first and last name
      const fullName = [first_name, last_name].filter(Boolean).join(' ') || 'Anonymous';
      
      console.log(`📝 Updating user profile: ${id} (${fullName}, ${primaryEmail})`);
      
      // Store the user profile with the full Clerk data for debugging
      await updateUserProfile(
        id, 
        {
          name: fullName,
          email: primaryEmail,
          imageUrl: image_url || undefined,
        },
        evt.data // Store the full Clerk data for debugging
      );
      
      console.log(`✅ Successfully processed ${eventType} for user: ${id}`);
      
      return NextResponse.json({ 
        success: true,
        message: `User ${eventType === 'user.created' ? 'created' : 'updated'} successfully`,
        userId: id
      });
    } 
    else if (eventType === 'user.deleted') {
      const { id } = evt.data;
      
      if (!id) {
        console.error('❌ No user ID in user.deleted webhook');
        return new Response('Missing user ID in webhook data', { status: 400 });
      }
      
      console.log(`🗑️ Marking user as deleted: ${id}`);
      await markUserDeleted(id);
      
      console.log(`✅ Successfully processed user deletion: ${id}`);
      return NextResponse.json({ 
        success: true,
        message: 'User marked as deleted successfully',
        userId: id
      });
    }
    else {
      // For other event types we don't handle
      console.log(`ℹ️ Unhandled event type: ${eventType}`);
      return NextResponse.json({ 
        success: true,
        message: `Webhook received: ${eventType}` 
      });
    }
  } catch (error) {
    console.error(`❌ Error processing ${eventType} webhook:`, error);
    return new Response(
      `Error processing webhook: ${error instanceof Error ? error.message : 'Unknown error'}`, 
      { status: 500 }
    );
  }
}