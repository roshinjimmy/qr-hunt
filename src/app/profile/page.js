"use client"; // Mark this component as a Client Component

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "../../lib/firebase"; // Import Firebase auth
import { signOut } from "firebase/auth";

const Profile = () => {
  const [user, setUser] = useState(null);
  const router = useRouter();

  // Fetch signed-in user info
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe(); // Cleanup subscription
  }, []);

  // Handle Sign Out
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="container mx-auto my-8 p-4">
      {user ? (
        <div className="bg-gray-800 text-white p-6 rounded-md">
          <h2 className="text-2xl font-bold mb-4">Profile</h2>
          <p className="mb-4">
            <strong>Name: </strong>{user.displayName || "N/A"}
          </p>
          <p className="mb-4">
            <strong>Email: </strong>{user.email}
          </p>
          <button
            onClick={handleSignOut}
            className="bg-red-500 hover:bg-red-600 transition duration-200 px-4 py-2 rounded-md"
          >
            Sign Out
          </button>
        </div>
      ) : (
        <p className="text-gray-400">Please sign in to view your profile.</p>
      )}
    </div>
  );
};

export default Profile;
