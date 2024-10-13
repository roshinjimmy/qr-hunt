"use client";

import React, { useEffect, useState } from "react";
import { doc, getDoc, updateDoc, increment, arrayUnion } from "firebase/firestore"; // Added arrayUnion and increment import
import { useAuth } from "@/context/authcontext"; // Adjust the path
import AuthWrapper from "../../../components/authwrapper"; // Adjust the path
import { db } from "../../../lib/firebase"; // Adjust the path

const QuestionPage = ({ params }) => {
  const { id } = params; // Extracting the id from params
  const [questionData, setQuestionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    const fetchQuestion = async () => {
      const questionDoc = doc(db, "questions", id);
      const questionSnapshot = await getDoc(questionDoc);

      if (questionSnapshot.exists()) {
        setQuestionData(questionSnapshot.data());
      } else {
        console.error("No such document!");
      }
      setLoading(false);
    };

    if (id) {
      fetchQuestion();
    }
  }, [id]);

  const handleAnswerSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setFeedback("You must be logged in to submit an answer.");
      return;
    }

    try {
      const questionDocRef = doc(db, "questions", id);
      const questionSnapshot = await getDoc(questionDocRef);

      if (!questionSnapshot.exists()) {
        setFeedback("Question not found.");
        return;
      }

      const questionData = questionSnapshot.data();

      // Check if the user has already answered this question
      const answeredBy = questionData.answeredBy || []; // Get the array or empty if it doesn't exist

      if (answeredBy.includes(user.uid)) {
        setFeedback("You have already answered this question.");
        return;
      }

      // Check if the answer is correct
      if (userAnswer.trim().toLowerCase() === questionData.correct_answer.trim().toLowerCase()) {
        // Award points to the user
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, {
          points: increment(questionData.points), // Increment user points
        });

        // Add the user to the list of people who answered this question
        await updateDoc(questionDocRef, {
          answeredBy: arrayUnion(user.uid), // Add user ID to answeredBy array
        });

        setFeedback(`Correct! You have been awarded ${questionData.points} points.`);
      } else {
        setFeedback("Incorrect answer. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting answer:", error);
      setFeedback("An error occurred while submitting your answer.");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!questionData) return <p>Question not found.</p>;

  return (
    <AuthWrapper>
      <div style={{ padding: "20px" }}>
        <h1>Question</h1>
        <p>{questionData.question}</p>
        <form onSubmit={handleAnswerSubmit}>
          <input
            type="text"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder="Enter your answer"
            required
            className="border border-gray-300 p-2 rounded mb-4"
          />
          <button type="submit" className="bg-blue-500 text-white p-2 rounded">
            Submit Answer
          </button>
        </form>
        {feedback && <p>{feedback}</p>}
      </div>
    </AuthWrapper>
  );
};

export default QuestionPage;
