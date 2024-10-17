"use client";

// src/components/Leaderboard.js
import React, { useEffect, useState } from "react";
import { db } from "../../lib/firebase"; // Adjust the path as needed
import { collection, getDocs } from "firebase/firestore";
import AuthWrapper from "@/components/authwrapper";

const Leaderboard = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const usersCollection = collection(db, "users");
      const usersSnapshot = await getDocs(usersCollection);
      const usersList = usersSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Sort by points descending, and by updatedAt ascending if points are equal
      const sortedUsers = usersList.sort((a, b) => {
        // Sort by points first
        if (b.points === a.points) {
          // If points are equal, check for updatedAt
          const aUpdatedAt = a.updatedAt ? a.updatedAt.seconds : 0; // Default to 0 if undefined
          const bUpdatedAt = b.updatedAt ? b.updatedAt.seconds : 0; // Default to 0 if undefined
          return aUpdatedAt - bUpdatedAt; // Sort by updatedAt
        }
        return b.points - a.points; // Sort by points
      });

      // Assign ranks, ensuring that users with 0 points get rank 0
      const rankedUsers = sortedUsers.map((user, index) => ({
        ...user,
        rank: user.points > 0 ? index + 1 : 0, // Rank starts from 1 for non-zero points
      }));

      setUsers(rankedUsers);
    };

    fetchUsers();
  }, []);

  return (
    <AuthWrapper>
      <div className="w-screen bg-[#ffffff] overflow-hidden">
        <div className="max-w-4xl mx-auto p-6 bg-[#ffffff]">
          <h1 className="text-3xl font-bold text-center mb-6">Leaderboard</h1>
          <div className="grid grid-cols-1 gap-6">
            <div className="header w-full h-20 flex flex-row justify-between items-center text-[#ffffff] bg-[#80cbc4] text-xl font-poppins px-12 font-semibold shadow-[#0F6464ff] shadow-lg">
              <div className="text-center">Rank</div>
              <div className="text-center">Participant</div>
              <div className="text-center">Points</div>
            </div>
            {users.map((user) => {
              if (user.points != 0) {
                return (
                  <div
                    key={user.id}
                    className="header w-full h-20 flex flex-row justify-between items-center text-[#0F6464] bg-[#C1E4E4] text-xl font-poppins px-12 font-semibold shadow-[#0F6464ff] shadow-lg"
                  >
                    <div className="text-center">{user.rank}</div>
                    <div className="text-center">{user.displayName}</div>
                    <div className="text-center">{user.points}</div>
                  </div>
                );
              }
            })}
          </div>
        </div>
      </div>
    </AuthWrapper>
  );
};

export default Leaderboard;
