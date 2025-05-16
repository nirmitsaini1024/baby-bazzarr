import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { updateUserProfile, ensureUserProfile } from '@/models/user'

export async function POST(req: Request) {
  console.log('Webhook received from Clerk');
  
  // Get the headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    console.error('Missing Svix headers');
    return new Response('Error occured -- no svix headers', {
      status: 400
    })
  }

  // Get the body
  const payload = await req.json()
  const body = JSON.stringify(payload);
  console.log('Webhook payload:', payload);

  // Create a new Svix instance with your webhook secret
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET || '');

  let evt: WebhookEvent

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent
    console.log('Webhook verified successfully');
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error occured', {
      status: 400
    })
  }

  // Handle the webhook
  const eventType = evt.type;
  console.log('Webhook event type:', eventType);
  
  if (eventType === 'user.created' || eventType === 'user.updated') {
    const { id, email_addresses, first_name, last_name } = evt.data;
    console.log('User data:', { id, email_addresses, first_name, last_name });
    
    // Get the primary email
    const primaryEmail = email_addresses?.[0]?.email_address;
    
    if (!primaryEmail) {
      console.error('No email found in webhook data');
      return new Response('No email found', { status: 400 });
    }

    // Combine first and last name
    const fullName = [first_name, last_name].filter(Boolean).join(' ') || 'Anonymous';
    console.log('Processed user data:', { fullName, primaryEmail });

    try {
      // First ensure the user profile exists
      await ensureUserProfile(id, {
        name: fullName,
        email: primaryEmail
      });

      // Then update it
      await updateUserProfile(id, {
        name: fullName,
        email: primaryEmail
      });
      console.log('User profile updated successfully');

      return NextResponse.json({ success: true });
    } catch (error) {
      console.error('Error updating user profile:', error);
      return new Response('Error updating user profile', { status: 500 });
    }
  }

  return new Response('Webhook received', { status: 200 });
} 