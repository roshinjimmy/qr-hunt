// src/pages/login.js
"use client"; // Mark this component as a Client Component

import { auth, db } from '../../lib/firebase';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/context/authcontext'; // Import your authentication context

const Login = () => {
    const router = useRouter();
    const { user } = useAuth(); // Access user from context
    const [error, setError] = useState('');

    const signInWithGoogle = async () => {
        const googleProvider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;

            // Store user in Firestore if not already present
            await setDoc(doc(db, 'users', user.uid), {
                email: user.email,
                displayName: user.displayName,
                points: 0,
            });

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
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
            <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
                <h1 className="text-3xl font-bold mb-6 text-center">Are you ready for the adventure?</h1>
                {error && <p className="text-red-500 mb-4">{error}</p>}

                <button
                    onClick={signInWithGoogle}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center"
                >
                    <img 
                        src="/google-icon.svg" 
                        alt="Google Icon" 
                        className="w-5 h-5 mr-2" 
                    />
                    Sign in with Google
                </button>
            </div>
        </div>
    );
};

export default Login;
