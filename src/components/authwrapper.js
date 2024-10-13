// src/components/AuthWrapper.js
"use client"; // Mark this component as a Client Component

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth } from "../lib/firebase"; // Adjust the path as necessary
import { useState } from "react";

const AuthWrapper = ({ children }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        // Redirect to login if not authenticated
        router.push("/login");
      } else {
        setLoading(false); // User is authenticated
      }
    });

    return () => unsubscribe(); // Cleanup subscription
  }, [router]);

  if (loading) {
    return <div>Loading...</div>; // Show a loading message while checking auth status
  }

  return <>{children}</>; // Render children if user is authenticated
};

export default AuthWrapper;
