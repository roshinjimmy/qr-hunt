"use client";

import React, { useEffect, useState } from "react";
import { doc, getDoc, updateDoc, increment, arrayUnion, Timestamp } from "firebase/firestore";
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
          updatedAt: Timestamp.now(),
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
      <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md mt-10" style={{ backgroundColor: "#E8F8F8", color: "#0F6464" }}>
        <h1 className="text-3xl font-bold text-center mb-4" style={{ color: "#0F6464" }}>Solve the Question</h1>
        <p className="text-lg mb-6" style={{ color: "#047979" }}>{questionData.question}</p>
        <form onSubmit={handleAnswerSubmit} className="flex flex-col">
          <input
            type="text"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder="Enter your answer"
            required
            className="p-3 rounded-lg mb-4 focus:outline-none shadow-sm"
            style={{ backgroundColor: "#FFFFFF", border: "1px solid #0C8B8B", color: "#0F6464" }}
          />
          <button
            type="submit"
            className="py-2 px-6 rounded-lg text-white transition duration-300 ease-in-out transform hover:scale-105"
            style={{ backgroundColor: "#0C8B8B", boxShadow: "-4px 4px 0px rgba(11, 135, 135, 0.8)" }}
          >
            Submit Answer
          </button>
        </form>
        {feedback && (
          <p
            className={`mt-4 p-3 rounded-lg text-center ${feedback.startsWith("Correct") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
          >
            {feedback}
          </p>
        )}
      </div>
    </AuthWrapper>
  );
};

export default QuestionPage;
