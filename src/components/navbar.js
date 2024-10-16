"use client"; // Mark this component as a Client Component

import Image from 'next/image';
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth } from "../lib/firebase";
import { signOut } from "firebase/auth";
import Link from "next/link";
import logo from '../assets/TLE.png'

const Navbar = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false); // State to handle mobile menu toggle

  // Fetch signed-in user info
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <nav className="px-6 py-2 relative" style={{ backgroundColor: '#C1E4E4', color: '#047979' }}>
      <div className="container mx-auto flex  items-center">
        <Image 
          src={logo} 
          alt="logo" 
          className="w-10 mb-2" 
          style={{height:'5%', width:'5%', marginRight:'6px'}}
      />
        {/* Title */}
        <h1 className="text-lg font-bold">QR Hunt</h1>

        {/* Hamburger Icon for Mobile View */}
        <button
          className="block md:hidden focus:outline-none"
          onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
        >
          <svg
            className="w-6 h-6"
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
        <div className="hidden md:flex space-x-6 font-lg items-center justify-center justify-inbetween" style={{color:'rgba(4,121,121,1', marginLeft:'62%'}}>
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
            <Link
              href="/login"
              className="bg-white hover:bg-[rgba(12,130,130,0.8)] hover:text-white transition duration-200 px-4 py-2 text-sm rounded-[11px]"
            >
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile Fullscreen Menu */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-95 flex flex-col z-50">
            <ul className="space-y-8 text-center">
              <li>
                <Link
                  href="/scanner"
                  className="text-white text-2xl hover:text-gray-400 transition duration-200"
                  onClick={() => setMobileMenuOpen(false)} // Close menu on click
                >
                  Scanner
                </Link>
              </li>
              <li>
                <Link
                  href="/leaderboard"
                  className="text-white text-2xl hover:text-gray-400 transition duration-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Leaderboard
                </Link>
              </li>
              <li>
                <Link
                  href="/profile"
                  className="text-white text-2xl hover:text-gray-400 transition duration-200"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{marginTop:'10px'}}
                >
                  Profile
                </Link>
              </li>
              {!user && (
                <li>
                  <Link
                    href="/login"
                    className="bg-blue-500 hover:bg-blue-600 transition duration-200 px-6 py-3 rounded-md text-xl text-white"
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
