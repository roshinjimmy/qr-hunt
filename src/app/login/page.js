"use client";
import { Poppins } from '@next/font/google';
import { supabase } from '@/lib/supabase';  // Make sure this import points to your supabase client
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Image from 'next/image';
import googleIcon from '../../assets/google-icon.png';
import cubo from '../../assets/cubo.png';
import ellipse from '../../assets/ellipse.png';
import group from '../../assets/group.png';

const poppins = Poppins({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700'],
    variable: '--font-poppins',
});

const Login = () => {
    const router = useRouter();
    const [error, setError] = useState('');

    const signInWithGoogle = async () => {
        try {
            const { data, error: signInError } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/scanner`, 
                }
            });

            if (signInError) {
                throw signInError;
            }
        } catch (error) {
            console.error('Error during sign-in:', error);
            setError('Failed to sign in. Please try again.');
        }
    };
    return (
        <div className={`${poppins.variable} font-sans flex flex-col items-center justify-center min-h-screen bg-[#fff] to-black text-white`}>
            <div className="relative z-10 bg-[#CFEAEA] bg-opacity-100 p-6 sm:p-8 md:p-10 lg:p-16 shadow-lg w-full max-w-xs sm:max-w-sm md:max-w-lg transition-shadow duration-700 hover:shadow-[8px_8px_20px_0px_rgba(13,148,136,0.6)] 
                mx-auto my-6 sm:my-8">

                <Image className="absolute z-0 top-0 left-0 transform -translate-x-20 -translate-y-20 mix-blend-lighten"
                    src={ellipse}
                    alt="ellipse"
                    width={180}
                    height={180}
                />
                <h1 className="text-4xl font-semibold mb-6 text-center text-[#0F6464]">Join the Adventure!</h1>
                {error && <p className="text-red-400 mb-4">{error}</p>}

                <button
                    onClick={signInWithGoogle}
                    className="w-full bg-white text-[#0F6464] font-semibold py-2 sm:py-3 px-5 rounded-lg flex items-center justify-center transition-all duration-700 ease-in-out 
                    transform hover:-translate-y-2 hover:shadow-[-8px_8px_0px_0px_rgba(4,121,121,0.6)]"
                >
                    <Image 
                        src={googleIcon}
                        alt="Google Icon" 
                        width={24} // Width of the icon
                        height={24} // Height of the icon
                        className="mr-2" 
                    />
                    Sign In with Google
                </button>
                <p className="mt-4 text-center text-sm text-[#047979] font-medium">
                    By signing in, you agree to our Terms of Service and Privacy Policy.
                </p>
                <div className="absolute bottom-0 left-0 transform rotate-6 -translate-x-24 translate-y-20"> 
                    <Image 
                        src={cubo} 
                        alt="Cubo" 
                        width={180}  // Adjust size as necessary
                        height={180} 
                    />
                </div>

                <Image className="absolute bottom-0 right-0 transform translate-x-32 translate-y-20"
                    src={group}
                    alt="group" 
                    width={180} // Width of the icon
                    height={180} 
                />
            </div>
        </div>
    );
};

export default Login;
