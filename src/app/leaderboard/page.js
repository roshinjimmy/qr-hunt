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
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-center mb-6">Leaderboard</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((user) => (
            <div
              key={user.id}
              className="bg-gray-800 text-white rounded-lg shadow-md p-4"
            >
              <h2 className="text-xl font-semibold">{user.displayName}</h2>
              <p className="text-lg">Points: <span className="font-bold">{user.points}</span></p>
            </div>
          ))}
        </div>
      </div>
    </AuthWrapper>
  );
};

export default Leaderboard;
