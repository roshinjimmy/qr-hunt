"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import ProfileGuard from "@/components/pfpcheck";
import Image from "next/image";
import cubo from "../../assets/cubo.png";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser();
        
        if (userError) throw userError;
        
        if (currentUser) {
          setUser(currentUser);
          
          // Fetch profile data and submissions in parallel
          const [profileResult] = await Promise.all([
            supabase
              .from('profiles')
              .select('*')
              .eq('id', currentUser.id)
              .single(),
          ]);
            
          if (profileResult.error) throw profileResult.error;
          setUserData(profileResult.data);

        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);


  return (
    <ProfileGuard>
      <div className="min-h-screen bg-[#E8F8F8] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
          {user && userData ? (
            <>
              {/* Profile Header */}
              <div className="relative h-32 bg-gradient-to-r from-[#0C8B8B] to-[#0F6464]">
                <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
                  <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden bg-white">
                    <Image
                      src={cubo}
                      alt="Profile"
                      width={128}
                      height={128}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>

              {/* Profile Content */}
              <div className="pt-20 pb-8 px-6 text-center">
                <h2 className="text-2xl font-bold text-[#0F6464] mb-2">
                  {userData.display_name}
                </h2>
                <p className="text-gray-500 mb-6">{user.email}</p>

                {/* Points Display */}
                <div className="bg-[#E8F8F8] rounded-xl p-6 mb-6">
                  <div className="text-4xl font-bold text-[#0C8B8B] mb-2">
                    {userData.points}
                  </div>
                  <div className="text-[#0F6464]">Total Points</div>
                </div>

              </div>
            </>
          ) : (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0C8B8B] mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading profile...</p>
            </div>
          )}
        </div>
      </div>
    </ProfileGuard>
  );
};

export default Profile;