"use client"; // Mark this component as a Client Component

import { auth, db } from '../../lib/firebase';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation'; // Update the import
import { useState } from 'react';

const Login = () => {
    const router = useRouter();
    const [error, setError] = useState('');

    const signInWithGoogle = async () => {
        const googleProvider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;

            // Store user in Firestore
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

    return (
        <div>
            <h1>Login</h1>
            {error && <p>{error}</p>}
            <button onClick={signInWithGoogle}>Sign in with Google</button>
        </div>
    );
};

export default Login;
