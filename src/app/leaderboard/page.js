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
      setUsers(usersList.sort((a, b) => b.points - a.points)); // Sort by points descending
    };

    fetchUsers();
  }, []);

  return (
    <AuthWrapper>
      <div className="w-screen bg-[#ffffff] overflow-hidden">
        <div className="max-w-4xl mx-auto p-6 bg-[#ffffff]">
          <h1 className="text-3xl font-bold text-center mb-6">Leaderboard</h1>
          <div className="grid grid-cols-1  gap-6">
            <div className="header w-full h-20 flex flex-row justify-between items-center text-[#ffffff] bg-[#80cbc4] text-xl font-poppins px-12 font-semibold shadow-[#0F6464ff] shadow-lg">
              <div className=" text-center ">Rank No</div>
              <div className=" text-center ">Participant</div>
              <div className=" text-center ">Points</div>
            </div>
            {users.map((user, index) => {
              return(
              <div
                key={user.id}
                className="header w-full h-20 flex flex-row justify-between items-center text-[#0F6464] bg-[#C1E4E4] text-xl font-poppins px-12 font-semibold shadow-[#0F6464ff] shadow-lg"
              >
                <div className=" text-center ">{index}</div>
                <div className=" text-center ">{user.displayName}</div>
                <div className=" text-center ">{user.points}</div>
              </div>
            )})}
          </div>
        </div>
      </div>
    </AuthWrapper>
  );
};

export default Leaderboard;
