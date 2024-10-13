"use client"; // Mark this component as a Client Component

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Updated to next/navigation
import { auth } from "../lib/firebase"; // Import the initialized auth from firebase.js
import { signOut } from "firebase/auth"; // Importing signOut for future use if needed
import Link from "next/link";

const Navbar = () => {
  const router = useRouter();
  const [user, setUser] = useState(null); // User state

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
        {/* Title */}
        <h1 className="text-lg font-bold">QR Hunt</h1>

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
          {!user && (
            <Link href="/login" className="bg-blue-500 hover:bg-blue-600 transition duration-200 px-4 py-2 rounded-md text-sm">
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
