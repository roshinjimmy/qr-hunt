// src/app/page.js
"use client"; // Mark this as a Client Component

import React from 'react';
import { useRouter } from 'next/navigation'; // Use the new import for routing

const HomePage = () => {
    const router = useRouter();

    const handleStartNow = () => {
        router.push('/login'); // Ensure this matches your actual login page path
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-800 text-white text-center">
            <h1 className="text-4xl font-bold mb-4">Welcome to the QR Treasure Hunt!</h1>
            <p className="text-lg mb-2">Get ready for an exciting adventure of scanning QR codes and solving puzzles!</p>
            <button 
                onClick={handleStartNow} 
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
            >
                Join Now
            </button>
        </div>
    );
};

export default HomePage;
