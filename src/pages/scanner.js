// src/pages/scanner.js
import React, { useState } from 'react';
import { QrReader } from 'react-qr-reader';
import { db, auth } from '../../lib/firebase';
import { doc, getDoc, updateDoc, increment } from 'firebase/firestore';

const Scanner = () => {
    const [question, setQuestion] = useState('');
    const [qrCode, setQrCode] = useState('');
    const [isCorrect, setIsCorrect] = useState(null);

    const handleScan = async (data) => {
        if (data) {
            setQrCode(data);
            const docRef = doc(db, 'questions', data);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const fetchedQuestion = docSnap.data().question;
                setQuestion(fetchedQuestion);
            } else {
                console.log("No such document!");
                alert("No question found for this QR code.");
            }
        }
    };

    const handleError = (err) => {
        console.error(err);
    };

    const handleSubmitAnswer = async (answer) => {
        const docRef = doc(db, 'questions', qrCode);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const correctAnswer = docSnap.data().correct_answer;
            if (answer === correctAnswer) {
                const userId = auth.currentUser.uid;
                await updateDoc(doc(db, 'users', userId), {
                    points: increment(1),
                });
                alert('Correct answer! Points awarded.');
                setIsCorrect(true);
            } else {
                alert('Incorrect answer. Try again!');
                setIsCorrect(false);
            }
        }
    };

    return (
        <div>
            <h1>QR Code Scanner</h1>
            <QrReader
                onScan={handleScan}
                onError={handleError}
                style={{ width: '100%' }}
                constraints={{ facingMode: 'environment' }} // Use the rear camera
                delay={300} // Adjust delay if needed
            />

            {question && (
                <div>
                    <h2>{question}</h2>
                    <input
                        type="text"
                        placeholder="Your answer"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleSubmitAnswer(e.target.value);
                                e.target.value = ''; // Clear input after submission
                            }
                        }}
                    />
                </div>
            )}

            {isCorrect !== null && (
                <p>{isCorrect ? "Great job!" : "Try again!"}</p>
            )}
        </div>
    );
};

export default Scanner;
