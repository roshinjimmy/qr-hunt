"use client"; // Mark this component as a Client Component

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "../../lib/firebase";
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
      <div className="container mx-auto my-8 p-4 flex flex-col items-center justify-center min-h-screen" style={{ backgroundColor: '#E8F8F8' }}>
        {user ? (
          <div className="bg-white text-[#0F6464] p-6 rounded-md shadow-lg w-full max-w-md">
            <h2 className="text-4xl font-bold mb-6 text-center">Profile</h2>
            <div className="mb-4">
              <p className="text-lg mb-2">
                <strong>Name: </strong>
                {user.displayName || "N/A"}
              </p>
              <p className="text-lg mb-2">
                <strong>Email: </strong>
                {user.email}
              </p>
              <p className="text-lg mb-2">
                <strong>Points: </strong>
                {userData ? userData.points : "Loading..."}
              </p>
            </div>
            <button
              onClick={handleSignOut}
              className="bg-[#0C8B8B] hover:bg-[#0A7373] transition duration-300 px-6 py-2 rounded-md w-full text-white"
              style={{ boxShadow: '-4px 4px 0px rgba(11, 135, 135, 0.8)' }}
            >
              Sign Out
            </button>
          </div>
        ) : (
          <p className="text-gray-600 text-center">Please sign in to view your profile.</p>
        )}
      </div>
    </AuthWrapper>
  );
};

export default Profile;
