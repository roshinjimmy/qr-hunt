"use client"; // Mark this as a Client Component

import React from "react";
import { useRouter } from "next/navigation"; // Import the router for navigation
import Image from "next/image"; // Import the Next.js Image component
import landingImg from "../assets/landingpageImg.png";
import cubo from "../assets/cubo.png";
import circle from "../assets/circle.png";
import ellipse from "../assets/ellipse.png";

const HomePage = () => {
  const router = useRouter(); // Initialize the Next.js router

  // Function to handle button click and redirect to the login page
  const handleStartNow = () => {
    router.push("/login"); // Redirects to the login page
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-white pt-20"
      style={{ color: "#0F6464" }}
    >
      <h1 className="text-4xl font-bold md:text-5xl mb-6 text-center">
        <span className="block md:inline">Welcome to the </span>
        <span className="block md:inline">QR Treasure Hunt!</span>
      </h1>

      <div className="absolute left-[-45%] top-10 md:left-0 md:top-[31.5%]">
        <Image
          src={ellipse}
          alt="ellipse"
          className="w-60 mb-10"
          width={140}
          height={126}
        />
      </div>

      <p
        className="text-xl font-medium mb-4 text-center"
        style={{ color: "rgba(4,121,121,1)" }}
      >
        <span className="block md:inline">
          Unravel mysteries, scan QR codes,
        </span>
        <span className="block md:inline"> and top the leaderboard!</span>
      </p>

      <div className="flex justify-center items-center mt-8 relative">
    <button
        onClick={handleStartNow}
        className="hover:bg-green-700 text-white py-2 px-14 shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
        style={{
            backgroundColor: '#0C8B8B',
            boxShadow: `-8px 8px 0px rgba(11, 135, 135, 0.8)`,
            borderRadius: '12px',
            position: 'relative', // Keep the button relative for absolute positioning of cubo
        }}
    >
        <Image
            src={cubo}
            alt="cubo"
            width={100} // Size of the cubo image
            height={100} // Size of the cubo image
            className="absolute left-[-30px] top-1/2 transform -translate-y-1/2" // Adjusted position
        />
        Join the Adventure
    </button>
</div>


      <div className="my-16 flex justify-center">
        <Image
          src={landingImg}
          alt="Treasure Hunt"
          className="w-full max-w-2xl mb-10 mt-20 md:mt-0"
          layout="responsive" // Ensures the image maintains aspect ratio
          objectFit="cover" // Adjusts how the image fits within its container
        />
      </div>

      <Image
        src={circle}
        alt="circle"
        className="w-20 md:w-60 mb-8"
        style={{ position: "absolute", top: "50%", right: "0" }}
      />
    </div>
  );
};

export default HomePage;
