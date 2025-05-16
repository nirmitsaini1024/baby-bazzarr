'use server';

import { updateUserProfile } from "@/lib/user-model";

/**
 * Server action to sync Clerk user data with MongoDB
 */
export async function syncUserData(userData: {
  userId: string;
  name: string;
  email: string;
  imageUrl?: string;
  phone?: string;
}) {
  try {
    await updateUserProfile(userData.userId, {
      name: userData.name,
      email: userData.email,
      imageUrl: userData.imageUrl,
      phone: userData.phone
    });
    
    return { success: true };
  } catch (error) {
    console.error("Error syncing user data:", error);
    return { success: false, error: (error as Error).message };
  }
}