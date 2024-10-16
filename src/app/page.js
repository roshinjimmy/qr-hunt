"use client"; // Mark this as a Client Component

import React from 'react';
import { useRouter } from 'next/navigation'; // Import the router for navigation
import Image from 'next/image'; // Import the Next.js Image component
import landingImg from '../assets/landingpageImg.png';
import cubo from "../assets/cubo.png";
import circle from '../assets/circle.png';
import ellipse from '../assets/ellipse.png'

const HomePage = () => {
    const router = useRouter(); // Initialize the Next.js router

    // Function to handle button click and redirect to the login page
    const handleStartNow = () => {
        router.push('/login'); // Redirects to the login page
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white" style={{ color: '#0F6464' }}>

            <h1 className="text-5xl font-bold mb-6">Welcome to the QR Treasure Hunt!</h1>

            
            <Image 
                    src={ellipse} 
                    alt="ellipse" 
                    className="w-60 mb-10" 
                    width={140} // Set the width
                    height={126} // Set the height
                    style={{position:'absolute', top:'31.5%', left:'0'}}
                />
            <p className="text-xl font-weight:500 font-medium mb-4" style={{color:'rgba(4,121,121,1)'}}>Unravel mysteries, scan QR codes, and top the leaderboard!</p>
            
            <div style={{marginLeft:'-250px'}}>

            <button 
                    onClick={handleStartNow} 
                    className="hover:bg-green-700 text-white  py-2 px-14 shadow-lg transition duration-300 ease-in-out transform hover:scale-105" 
                    style={{ backgroundColor: '#0C8B8B', boxShadow: `-8px 8px 0px rgba(11, 135, 135, 0.8)`,  borderRadius: '12px', position:'absolute' }}
                >
                    Join the Adventure
                </button>

                <Image 
                    src={cubo} 
                    alt="cubo" 
                    className="w-20 mb-4" 
                    width={140} // Set the width
                    height={126} // Set the height
                    style={{position:'absolute', top:'31.5%', left:'39.5%'}}
                />

            </div>
            
            <div className="my-8">
                <Image 
                    src={landingImg} 
                    alt="Treasure Hunt" 
                    className="w-68 mb-8" 
                    width={500} // Set the width
                    height={750} // Set the height
                />
            </div>
            <Image 
                    src={circle} 
                    alt="circle" 
                    className="w-60 mb-8" 
                    style={{position:'absolute', top:'49.5%', right:'0'}}
                />
        </div>
    );
};

export default HomePage;
