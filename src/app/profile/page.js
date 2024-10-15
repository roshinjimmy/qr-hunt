"use client"; // Mark this component as a Client Component

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "../../lib/firebase"; // Import Firebase auth and db
import { signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import AuthWrapper from "@/components/authwrapper";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null); // Store user data from Firestore
  const router = useRouter();

  // Fetch signed-in user info
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        // Fetch the user's data from Firestore, including points
        const userDocRef = doc(db, "users", currentUser.uid);
        const userDocSnapshot = await getDoc(userDocRef);

        if (userDocSnapshot.exists()) {
          setUserData(userDocSnapshot.data());
        } else {
          console.error("User document not found in Firestore");
        }
      } else {
        setUser(null);
        setUserData(null);
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
    <AuthWrapper>
      <div className="container mx-auto my-8 p-4">
        {user ? (
          <div className="bg-gray-800 text-white p-6 rounded-md">
            <h2 className="text-2xl font-bold mb-4">Profile</h2>
            <p className="mb-4">
              <strong>Name: </strong>
              {user.displayName || "N/A"}
            </p>
            <p className="mb-4">
              <strong>Email: </strong>
              {user.email}
            </p>
            <p className="mb-4">
              <strong>Points: </strong>
              {userData ? userData.points : "Loading..."}
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
    </AuthWrapper>
  );
};

export default Profile;
