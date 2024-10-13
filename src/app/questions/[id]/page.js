"use client"; // Mark this component as a Client Component

import { useParams } from 'next/navigation'; // Use useParams instead of router.query
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';

const QuestionPage = () => {
    const { id } = useParams(); // Get the question ID from the dynamic route
    const [questionData, setQuestionData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [userAnswer, setUserAnswer] = useState(''); // State for user's answer
    const [feedback, setFeedback] = useState(''); // State for feedback message

    useEffect(() => {
        const fetchQuestion = async () => {
            const questionDoc = doc(db, 'questions', id); // Reference to the question document
            const questionSnapshot = await getDoc(questionDoc); // Get the document snapshot

            if (questionSnapshot.exists()) {
                setQuestionData(questionSnapshot.data()); // Set the question data to state
            } else {
                console.error('No such document!');
            }
            setLoading(false); // Set loading to false after fetching
        };

        if (id) {
            fetchQuestion(); // Fetch the question when the ID is available
        }
    }, [id]);

    const handleAnswerSubmit = (e) => {
        e.preventDefault(); // Prevent page reload

        // Check user's answer against the correct answer
        if (userAnswer.trim() === questionData.correct_answer) {
            setFeedback(`Correct answer! You earned ${questionData.points} points!`); // Feedback for correct answer
        } else {
            setFeedback('Incorrect answer. Try again!'); // Feedback for incorrect answer
        }

        setUserAnswer(''); // Clear the input field
    };

    if (loading) return <p>Loading...</p>; // Show loading text while fetching

    if (!questionData) return <p>Question not found.</p>; // Handle case where question doesn't exist

    return (
        <div style={{ padding: '20px' }}>
            <h1>Question</h1>
            <p>{questionData.question}</p> {/* Display question */}

            <form onSubmit={handleAnswerSubmit}>
                <input
                    type="text"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)} // Update userAnswer state
                    placeholder="Enter your answer"
                    required
                />
                <button type="submit">Submit Answer</button>
            </form>

            {feedback && <p>{feedback}</p>} {/* Display feedback message */}
        </div>
    );
};

export default QuestionPage;
