"use client"; // Mark this component as a Client Component

import { auth, db } from '../../lib/firebase';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/context/authcontext'; // Import your authentication context
import Image from 'next/image'; // Import Next.js Image component
import googleIcon from '../../assets/google-icon.png';
import { Timestamp } from "firebase/firestore";

const Login = () => {
    const router = useRouter();
    const { user } = useAuth(); // Access user from context
    const [error, setError] = useState('');

    const signInWithGoogle = async () => {
        const googleProvider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;

            const userRef = doc(db, 'users', user.uid);
            const userDoc = await getDoc(userRef);

            // Only set points to 0 if the user document does not exist
            if (!userDoc.exists()) {
                await setDoc(userRef, {
                    email: user.email,
                    displayName: user.displayName,
                    points: 0,
                    updatedAt: Timestamp.now(),
                });
            } else {
                // If the user document exists, update only necessary fields (e.g., email, displayName)
                await setDoc(userRef, {
                    email: user.email,
                    displayName: user.displayName,
                }, { merge: true });
            }

            // Redirect after successful login
            router.push('/scanner');
        } catch (error) {
            console.error("Error during Google Sign-In:", error.message);
            setError('Failed to sign in with Google');
        }
    };

    // Redirect if the user is already logged in
    if (user) {
        router.push('/scanner');
        return null; // Prevent rendering of the login page
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-gray-800 via-gray-900 to-black text-white">
            <div className="bg-gray-800 bg-opacity-80 p-10 rounded-lg shadow-lg w-full max-w-md">
                <h1 className="text-4xl font-extrabold mb-6 text-center">Join the Adventure!</h1>
                {error && <p className="text-red-400 mb-4">{error}</p>}

                <button
                    onClick={signInWithGoogle}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-5 rounded-lg flex items-center justify-center transition duration-300 ease-in-out transform hover:scale-105 shadow-lg"
                >
                    <Image 
                        src={googleIcon}
                        alt="Google Icon" 
                        width={24} // Width of the icon
                        height={24} // Height of the icon
                        className="mr-2" 
                    />
                    Sign in with Google
                </button>
                <p className="mt-4 text-center text-sm text-gray-400">
                    By signing in, you agree to our Terms of Service and Privacy Policy.
                </p>
            </div>
        </div>
    );
};

export default Login;
