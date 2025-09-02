"use client";
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function ProfileGuard({ children }) {
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const setupProfile = async () => {
            try {
                // Get current user
                const { data: { user }, error: userError } = await supabase.auth.getUser();
                
                if (userError || !user) {
                    router.push('/login');
                    return;
                }

                // Check/create profile
                const { data: profile } = await supabase
                    .from('profiles')
                    .select()
                    .eq('id', user.id)
                    .single();

                if (!profile) {
                    // Create new profile
                    await supabase.from('profiles').insert([{
                        id: user.id,
                        email: user.email,
                        display_name: user.user_metadata?.full_name || user.email,
                        points: 0,
                        updated_at: new Date().toISOString(),
                    }]);
                }
            } catch (error) {
                console.error('Profile setup error:', error);
                router.push('/login');
            } finally {
                setIsLoading(false);
            }
        };

        setupProfile();
    }, [router]);

    return children;
}