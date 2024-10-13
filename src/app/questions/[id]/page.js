"use client";

import React, { useEffect, useState } from "react";
import { doc, getDoc, updateDoc, increment } from "firebase/firestore";
import { useAuth } from "@/context/authcontext"; // Adjust the path
import AuthWrapper from "../../../components/authwrapper"; // Adjust the path
import { db } from "../../../lib/firebase"; // Adjust the path

const QuestionPage = ({ params }) => {
  const { id } = params; // Extracting the id from params
  const [questionData, setQuestionData] = useState(null); // State to hold the question data
  const [loading, setLoading] = useState(true); // State to handle loading
  const [userAnswer, setUserAnswer] = useState(""); // State to handle user's answer input
  const [feedback, setFeedback] = useState(""); // State to give feedback to the user
  const { user } = useAuth(); // Getting the current authenticated user from the context

  // Fetch question data from Firestore based on the 'id'
  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const questionDoc = doc(db, "questions", id); // Get a reference to the document
        const questionSnapshot = await getDoc(questionDoc); // Fetch the document

        if (questionSnapshot.exists()) {
          setQuestionData(questionSnapshot.data()); // Set the question data if it exists
        } else {
          console.error("No such document!"); // Error if no document exists
        }
      } catch (error) {
        console.error("Error fetching question:", error); // Error handling
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    if (id) {
      fetchQuestion(); // Fetch the question if 'id' exists
    }
  }, [id]);

  // Function to update user's points in Firestore
  const awardPointsToUser = async (points) => {
    const userRef = doc(db, "users", user.uid); // Reference to the user's document in Firestore

    try {
      // Update the user's points by adding the points of the question
      await updateDoc(userRef, {
        points: increment(points) // Increment the points field by the points of the current question
      });

      setFeedback(`Correct answer! You have been awarded ${points} points.`);
    } catch (error) {
      console.error("Error updating user points:", error);
      setFeedback("Error awarding points. Please try again later.");
    }
  };

  // Handle the form submission and check the answer
  const handleAnswerSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    if (!user) {
      setFeedback("You must be logged in to submit an answer.");
      return;
    }

    if (!userAnswer) {
      setFeedback("Please enter an answer.");
      return;
    }

    // Check if the user's answer matches the correct answer
    if (questionData.correct_answer.toLowerCase() === userAnswer.trim().toLowerCase()) {
      // If the answer is correct, award the user points
      await awardPointsToUser(questionData.points); // Award points from the question
    } else {
      setFeedback("Incorrect answer. Try again.");
    }
  };

  // Render the page while loading or if no question is found
  if (loading) return <p>Loading...</p>;
  if (!questionData) return <p>Question not found.</p>;

  return (
    <AuthWrapper>
      <div style={{ padding: "20px" }}>
        <h1>Question</h1>
        <p>{questionData.question}</p> {/* Display the question */}

        <form onSubmit={handleAnswerSubmit}> {/* Form to submit answer */}
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

        {/* Display feedback after submission */}
        {feedback && <p>{feedback}</p>}
      </div>
    </AuthWrapper>
  );
};

export default QuestionPage;
