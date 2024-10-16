"use client"; // Mark this component as a Client Component

import Image from 'next/image';
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth } from "../lib/firebase";
import Link from "next/link";
import logo from '../assets/TLE.png';

const Navbar = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false); // State to handle mobile menu toggle

  // Fetch signed-in user info
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  return (
    <nav className="bg-[#E8F8F8] text-[#0F6464] shadow-md p-4">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <Image 
            src={logo} 
            alt="logo" 
            className="h-12 mr-3" // Set only height to keep aspect ratio
            style={{ height: '3rem', width: 'auto' }} // Responsive height with auto width
          />
          <h1 className="text-2xl font-bold">QR Hunt</h1>
        </div>

        {/* Hamburger Icon for Mobile View */}
        <button
          className="block md:hidden focus:outline-none"
          onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <svg
            className="w-8 h-8 text-[#0F6464]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
            />
          </svg>
        </button>

        {/* Navigation Links for Desktop */}
        <div className="hidden md:flex space-x-8 items-center">
          <Link href="/scanner" className="hover:text-gray-600 transition duration-200">
            Scanner
          </Link>
          <Link href="/leaderboard" className="hover:text-gray-600 transition duration-200">
            Leaderboard
          </Link>
          <Link href="/profile" className="hover:text-gray-600 transition duration-200">
            Profile
          </Link>
          {!user && (
            <Link
              href="/login"
              className="bg-[#0F6464] text-white hover:bg-[#0B5454] transition duration-200 px-4 py-2 rounded-full"
            >
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile Fullscreen Menu */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 bg-[#047979] bg-opacity-95 flex flex-col z-50">
            <ul className="space-y-8 text-center mt-10">
              <li>
                <Link
                  href="/scanner"
                  className="text-white text-3xl hover:text-gray-300 transition duration-200"
                  onClick={() => setMobileMenuOpen(false)} // Close menu on click
                >
                  Scanner
                </Link>
              </li>
              <li>
                <Link
                  href="/leaderboard"
                  className="text-white text-3xl hover:text-gray-300 transition duration-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Leaderboard
                </Link>
              </li>
              <li>
                <Link
                  href="/profile"
                  className="text-white text-3xl hover:text-gray-300 transition duration-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Profile
                </Link>
              </li>
              {!user && (
                <li>
                  <Link
                    href="/login"
                    className="bg-[#0F6464] hover:bg-[#0B5454] transition duration-200 px-6 py-3 rounded-full text-xl text-white"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
