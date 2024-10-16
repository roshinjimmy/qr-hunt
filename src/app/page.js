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
        <div className="flex flex-col items-center justify-center min-h-screen bg-white pt-20 sm: " style={{ color: '#0F6464' }}>

<h1 className="text-4xl font-bold md:text-5xl  mb-6 ">
    <span className='text-center
    block md:inline'>Welcome to the </span> 
    <span className='block md:inline'>QR Treasure Hunt!</span>

</h1>

<div className="absolute left-[-45%] top-1.75 md:left-0 md:top-[31.5%]">
    <Image 
        src={ellipse} 
        alt="ellipse" 
        className="w-60 mb-10" 
        width={140} 
        height={126} 
    />
</div>
            <p className="text-xl font-weight:500 font-medium mb-4" style={{color:'rgba(4,121,121,1)'}}>
                <span className='block md:inline'>Unravel mysteries, scan QR codes,</span>
                <span className=' text-center block md:inline'> and  top the leaderboard!
                </span>
                </p>
            
            <div style={{marginLeft:'-250px'}}>
            
            
            <Image src={cubo} alt="cubo"
            width={50} height={50} className='left-0 top-0 md:hidden'></Image>
            <button 
                    onClick={handleStartNow} 
                    className="hover:bg-green-700 text-white  py-2 px-14 shadow-lg transition duration-300 ease-in-out transform hover:scale-105 -mt-4 ml-9 md:mt-10" 
                    style={{ backgroundColor: '#0C8B8B', boxShadow: `-8px 8px 0px rgba(11, 135, 135, 0.8)`,  borderRadius: '12px', position:'absolute' }}
                >
                    Join the Adventure
                </button>

               

            </div>
            
            <div className="my-8">
                <Image 
                    src={landingImg} 
                    alt="Treasure Hunt" 
                    className="w-68 mb-8 mt-40 md:mt-0 w-90 mt-30 " 
                    
                />
            </div>
            <Image 
                    src={circle} 
                    alt="circle" 
                    className="w-20  md:w-60 mb-8" 
                    style={{position:'absolute', top:'49.5%', right:'0'}}
                />
        </div>
    );
};

export default HomePage;
