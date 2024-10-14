"use client";

import React, { useEffect, useState } from "react";
import { doc, getDoc, updateDoc, increment, arrayUnion } from "firebase/firestore";
import { useAuth } from "@/context/authcontext";
import AuthWrapper from "../../../components/authwrapper";
import { db } from "../../../lib/firebase";

const QuestionPage = ({ params }) => {
  const { id } = params;
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

      const answeredBy = questionData.answeredBy || [];

      if (answeredBy.includes(user.uid)) {
        setFeedback("You have already answered this question.");
        return;
      }

      if (userAnswer.trim().toLowerCase() === questionData.correct_answer.trim().toLowerCase()) {
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, {
          points: increment(questionData.points),
        });

        await updateDoc(questionDocRef, {
          answeredBy: arrayUnion(user.uid),
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

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (!questionData) return <p className="text-center text-gray-500">Question not found.</p>;

  return (
    <AuthWrapper>
      <div className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
        <h1 className="text-2xl font-bold text-center mb-4">Solve the Question</h1>
        <p className="text-lg text-gray-700 mb-6">{questionData.question}</p>
        <form onSubmit={handleAnswerSubmit} className="flex flex-col">
          <input
            type="text"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder="Enter your answer"
            required
            className="border border-gray-300 p-3 rounded mb-4 text-gray-800 focus:outline-none focus:border-blue-500"
            style={{ backgroundColor: "#f9f9f9" }} // Light background for better contrast
          />
          <button
            type="submit"
            className="bg-blue-500 text-white p-3 rounded hover:bg-blue-600 transition"
          >
            Submit Answer
          </button>
        </form>
        {feedback && (
          <p
            className={`mt-4 p-2 rounded text-center ${
              feedback.startsWith("Correct")
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {feedback}
          </p>
        )}
      </div>
    </AuthWrapper>
  );
};

export default QuestionPage;
