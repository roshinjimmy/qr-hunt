"use client"; // Mark this component as a Client Component

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Updated to next/navigation
import { auth } from "../lib/firebase"; // Import the initialized auth from firebase.js
import { signOut } from "firebase/auth";
import Link from "next/link";

const Navbar = () => {
  const [user, setUser] = useState(null); // User state
  const router = useRouter();

  // Fetch signed-in user info
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null); // Reset user if signed out
      }
    });

    return () => unsubscribe(); // Cleanup subscription
  }, []);

  return (
    <nav className="bg-gray-800 text-white px-6 py-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* User Info */}
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <p className="text-sm">Signed in as: {user.displayName || user.email}</p>
            </>
          ) : (
            <Link href="/login" className="bg-blue-500 hover:bg-blue-600 transition duration-200 px-4 py-2 rounded-md text-sm">
              Sign In
            </Link>
          )}
        </div>

        {/* Navigation Links */}
        <div className="flex items-center space-x-6">
          <Link href="/scanner" className="hover:text-gray-400 transition duration-200">
            Scanner
          </Link>
          <Link href="/leaderboard" className="hover:text-gray-400 transition duration-200">
            Leaderboard
          </Link>
          <Link href="/profile" className="hover:text-gray-400 transition duration-200">
            Profile
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
