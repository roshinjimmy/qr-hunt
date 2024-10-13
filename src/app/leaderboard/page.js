"use client";

// src/components/Leaderboard.js
import React, { useEffect, useState } from 'react';
import { db } from '../../lib/firebase'; // Adjust the path as needed
import { collection, getDocs } from 'firebase/firestore';

const Leaderboard = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            const usersCollection = collection(db, 'users');
            const usersSnapshot = await getDocs(usersCollection);
            const usersList = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setUsers(usersList.sort((a, b) => b.points - a.points)); // Sort by points descending
        };

        fetchUsers();
    }, []);

    return (
        <div>
            <h1>Leaderboard</h1>
            <ul>
                {users.map(user => (
                    <li key={user.id}>
                        {user.displayName}: {user.points} points
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Leaderboard;
