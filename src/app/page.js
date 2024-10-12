// src/app/page.js
"use client"; // Mark this as a Client Component

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Use the new import for routing

const HomePage = () => {
    const router = useRouter();

    useEffect(() => {
        // Redirect to the login page after 3 seconds
        const timer = setTimeout(() => {
            router.push('/login'); // Ensure this matches your actual login page path
        }, 3000);

        // Cleanup the timer on unmount
        return () => clearTimeout(timer);
    }, [router]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-800 text-white text-center">
            <h1 className="text-4xl font-bold mb-4">Welcome to the QR Treasure Hunt!</h1>
            <p className="text-lg mb-2">Get ready for an exciting adventure of scanning QR codes and solving puzzles!</p>
            <p className="text-md">You will be redirected to the login page shortly...</p>
        </div>
    );
};

export default HomePage;
