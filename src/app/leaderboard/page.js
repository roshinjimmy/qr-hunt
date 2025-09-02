"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';
import cubo from '../../assets/cubo.png';

const Leaderboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .order('points', { ascending: false });

        if (error) throw error;
        setUsers(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#E8F8F8]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0C8B8B]"></div>
      </div>
    );
  }

  return (
       <div className="min-h-screen bg-[#E8F8F8] relative overflow-hidden">
    
      {/* Content */}
      <div className="py-12 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold text-center text-[#0F6464] mb-8">
            Leaderboard
          </h1>

          {/* Glassy Container */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden">
            {users.map((user, index) => (
              <div 
                key={user.id}
                className={`flex items-center px-6 py-4 border-b border-gray-100/50 hover:bg-white/50 transition-colors ${
                  index === 0 ? 'bg-yellow-50/70' : ''
                }`}
              >
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mr-4 font-bold ${
                  index === 0 ? 'bg-[#FFD700] text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {index + 1}
                </div>
                <div className="flex-shrink-0 w-12 h-12 mr-4 relative">
                  <Image
                    src={cubo}
                    alt={user.display_name}
                    className={`rounded-full border-2 ${
                      index === 0 ? 'border-[#FFD700]' : 'border-gray-200'
                    }`}
                    fill
                    objectFit="cover"
                  />
                </div>
                <div className="flex-grow">
                  <p className="font-semibold text-[#0F6464]">{user.display_name}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
                <div className={`flex-shrink-0 font-semibold ${
                  index === 0 ? 'text-[#FFD700]' : 'text-[#0C8B8B]'
                }`}>
                  {user.points} pts
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;