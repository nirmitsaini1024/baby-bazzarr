'use client';

import { useUser } from "@clerk/clerk-react";
import { ReactNode, useEffect } from "react";
import { syncUserData } from "@/app/actions/user-actions";
import { usePathname } from "next/navigation";

type AuthWrapperProps = {
  children: ReactNode;
};

/**
 * Wrapper component to handle auth state and sync user data
 * Place this in your app layout or around protected routes
 */
export default function AuthWrapper({ children }: AuthWrapperProps) {
  const { user, isLoaded, isSignedIn } = useUser();
  const pathname = usePathname();

  // List of public routes that don't need authentication
  const publicRoutes = ['/sign-in', '/sign-up', '/', '/shop'];

  useEffect(() => {
    // Only sync when we have a signed-in user
    if (isLoaded && isSignedIn && user) {
      syncUserToDatabase(user);
    }
  }, [isLoaded, isSignedIn, user]);

  async function syncUserToDatabase(user: any) {
    try {
      // Extract the relevant user data from Clerk
      const userData = {
        userId: user.id,
        name: user.firstName + (user.lastName ? ` ${user.lastName}` : ""),
        email: user.emailAddresses[0].emailAddress,
        imageUrl: user.imageUrl,
        // Optional: Include phone if available
        ...(user.phoneNumbers && user.phoneNumbers.length > 0 
          ? { phone: user.phoneNumbers[0].phoneNumber }
          : {})
      };
      
      // Call the server action to update/create the user profile
      const result = await syncUserData(userData);
      
      if (result.success) {
        console.log("User data synced with database");
      } else {
        console.error("Error syncing user data:", result.error);
      }
    } catch (error) {
      console.error("Error syncing user data:", error);
      // You might want to add error tracking here (Sentry, etc.)
    }
  }

  // Only show loading state for protected routes
  const isPublicRoute = publicRoutes.includes(pathname);
  if (!isLoaded && !isPublicRoute) {
    return <div>Loading authentication...</div>;
  }

  return <>{children}</>;
}