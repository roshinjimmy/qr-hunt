"use client"; // Mark this as a Client Component

import React from 'react';
import { useRouter } from 'next/navigation'; // Import the router for navigation
import Image from 'next/image'; // Import the Next.js Image component
import treasureHuntImage from '../assets/treasure-hunt-illustration.jpg'; // Adjust the path as needed

const HomePage = () => {
    const router = useRouter(); // Initialize the Next.js router

    // Function to handle button click and redirect to the login page
    const handleStartNow = () => {
        router.push('/login'); // Redirects to the login page
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 text-white text-center">
            <h1 className="text-5xl font-extrabold mb-6">Welcome to the QR Treasure Hunt!</h1>
            <p className="text-lg mb-4">Unravel mysteries, scan QR codes, and top the leaderboard!</p>
            
            <div className="my-8">
                <Image 
                    src={treasureHuntImage} 
                    alt="Treasure Hunt" 
                    className="w-64 mb-6" 
                    width={256} // Set the width
                    height={256} // Set the height
                />
            </div>

            <button 
                onClick={handleStartNow} 
                className="bg-green-500 hover:bg-green-700 text-white text-lg font-bold py-3 px-6 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
            >
                Join the Adventure
            </button>
        </div>
    );
};

export default HomePage;
