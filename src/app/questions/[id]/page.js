"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import { useRouter } from "next/navigation";

const QuestionPage = ({ params }) => {
  const { id } = params;
  const router = useRouter();
  
  const [questionData, setQuestionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [user, setUser] = useState(null);


// checking user auth and fetching question data
useEffect(() => {
  const checkAuth = async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) {
      router.push('/login');
      return;
    }
    setUser(user);

    // Fetch question data
    const { data: questionData, error: questionError } = await supabase
      .from('questions')
      .select('*')
      .eq('question_id', id)
      .single();

    if (questionError) {
      console.error("Error fetching question:", questionError);
      setLoading(false);
      return;
    }

    setQuestionData(questionData);
    setLoading(false);
  };

  checkAuth();
}, [id, supabase]);

 const handleAnswerSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setFeedback("You must be logged in to submit an answer.");
      return;
    }

    try {
      // Check if user has already submitted an answer
      const { data: existingSubmission } = await supabase
        .from('submissions')
        .select('*')
        .eq('user_id', user.id)
        .eq('question_id', id)
        .single();

      if (existingSubmission) {
        setFeedback("You have already answered this question.");
        return;
      }

      const isCorrect = userAnswer.trim().toLowerCase() === questionData.correct_answer.trim().toLowerCase();

      // Record the submission regardless of correctness
      const { error: submissionError } = await supabase
        .from('submissions')
        .insert({
          user_id: user.id,
          question_id: id,
          is_correct: isCorrect,
          submitted_at: new Date().toISOString()
        });

      if (submissionError) {
        if (submissionError.code === '23505') {
          setFeedback("You have already answered this question.");
          return;
        }
        throw submissionError;
      }
     if (isCorrect) {
        // First get current user points
        const { data: userData, error: fetchError } = await supabase
          .from('profiles')
          .select('points')
          .eq('id', user.id)
          .single();

        if (fetchError) throw fetchError;

        const newPoints = (userData.points || 0) + questionData.points;

        // Update with total points
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ 
            points: newPoints,
            updated_at: new Date().toISOString()
          })
          .eq('id', user.id);

        if (updateError) throw updateError;

        setFeedback(`Correct! You have been awarded ${questionData.points} points. Your total is now ${newPoints} points.`);
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
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md mt-10" 
         style={{ backgroundColor: "#E8F8F8", color: "#0F6464" }}>
      <h1 className="text-3xl font-bold text-center mb-4" 
          style={{ color: "#0F6464" }}>
        Solve the Question
      </h1>
      <p className="text-lg mb-6" 
         style={{ color: "#047979" }}>
        {questionData.question}
      </p>
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
        <p className={`mt-4 p-3 rounded-lg text-center ${
          feedback.startsWith("Correct") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
        }`}>
          {feedback}
        </p>
      )}
    </div>
  );
};

export default QuestionPage;