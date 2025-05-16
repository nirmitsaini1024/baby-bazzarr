'use client';

import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { syncUserData } from "@/app/actions/user-actions";

type SyncUserProps = {
  onSync?: (success: boolean) => void;
  showFeedback?: boolean;
};

/**
 * Component to sync Clerk user data with MongoDB
 * Can be placed on pages where you need to ensure user data is updated
 */
export default function SyncClerkUser({ onSync, showFeedback = false }: SyncUserProps) {
  const { user, isLoaded } = useUser();
  const [syncStatus, setSyncStatus] = useState<"idle" | "syncing" | "success" | "error">("idle");

  useEffect(() => {
    // Only run this once the user data is loaded and available
    if (isLoaded && user) {
      syncUserToDatabase();
    }
  }, [isLoaded, user]);

  async function syncUserToDatabase() {
    if (!user) return;
    
    try {
      setSyncStatus("syncing");
      
      // Extract the relevant user data from Clerk
      const userData = {
        userId: user.id,
        name: user.firstName + (user.lastName ? ` ${user.lastName}` : ""),
        email: user.emailAddresses[0].emailAddress,
        imageUrl: user.imageUrl,
        // Add phone if you have it from Clerk
        // phone: user.phoneNumbers && user.phoneNumbers.length > 0 
        //   ? user.phoneNumbers[0].phoneNumber 
        //   : undefined
      };
      
      // Call the server action to update/create the user profile
      const result = await syncUserData(userData);
      
      if (result.success) {
        console.log("User profile stored successfully");
        setSyncStatus("success");
        if (onSync) onSync(true);
      } else {
        console.error("Failed to store user profile:", result.error);
        setSyncStatus("error");
        if (onSync) onSync(false);
      }
    } catch (error) {
      console.error("Failed to store user profile:", error);
      setSyncStatus("error");
      if (onSync) onSync(false);
    }
  }
  
  // Only render feedback if requested
  if (!showFeedback) return null;
  
  return (
    <div className="user-sync-status">
      {syncStatus === "syncing" && <p>Syncing your profile...</p>}
      {syncStatus === "success" && <p>Profile synced successfully!</p>}
      {syncStatus === "error" && <p>Failed to sync profile. Please try again later.</p>}
    </div>
  );
}   