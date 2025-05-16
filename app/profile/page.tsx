'use client';

import { useUser } from "@clerk/clerk-react";
import SyncClerkUser from "@/components/SyncClerkUser"; // Adjust the path as needed

export default function ProfilePage() {
  const { user, isLoaded } = useUser();
  
  if (!isLoaded || !user) {
    return <div>Loading...</div>;
  }
  
  return (
    <div className="profile-container">
      {/* This component will sync the user data in the background */}
      <SyncClerkUser />
      
      <h1>Welcome, {user.firstName}!</h1>
      <p>Email: {user.emailAddresses[0].emailAddress}</p>
      
      {/* Rest of your profile page content */}
      <div className="profile-details">
        <h2>Your Profile</h2>
        <div className="profile-avatar">
          {user.imageUrl && <img src={user.imageUrl} alt="Profile" />}
        </div>
        <div className="profile-info">
          <p><strong>Name:</strong> {user.firstName} {user.lastName}</p>
          <p><strong>Email:</strong> {user.emailAddresses[0].emailAddress}</p>
          {user.phoneNumbers && user.phoneNumbers.length > 0 && (
            <p><strong>Phone:</strong> {user.phoneNumbers[0].phoneNumber}</p>
          )}
        </div>
      </div>
    </div>
  );
}