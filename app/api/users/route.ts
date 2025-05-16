import { NextResponse } from 'next/server';
import { updateUserProfile } from '@/models/user';

export async function POST(req: Request) {
  try {
    const { userId, firstName, email } = await req.json();

    if (!userId || !firstName || !email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    await updateUserProfile(userId, {
      name: firstName,
      email: email,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
} 