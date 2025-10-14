"use client";
import { useEffect, useState } from "react";

export default function MCQQuiz() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      const response = await fetch("/api/questions");
      const data = await response.json();
      setQuestions(data);

      // Initialize user answers
      const initialAnswers = {};
      data.forEach((question, index) => {
        initialAnswers[index] = "";
      });
      setUserAnswers(initialAnswers);
    } catch (error) {
      console.error("Error loading questions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerSelect = (answer) => {
    setUserAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: answer,
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  // const handleSubmit = async () => {
  //   try {
  //     // Update questions with user answers
  //     const updatedQuestions = questions.map((question, index) => ({
  //       ...question,
  //       UserAnswer: userAnswers[index] || "",
  //     }));

  //     const response = await fetch("/api/submit", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(updatedQuestions),
  //     });

  //     if (response.ok) {
  //       setIsSubmitted(true);
  //       alert(
  //         "Quiz submitted successfully! Check your downloads for the results file."
  //       );
  //     }
  //   } catch (error) {
  //     console.error("Error submitting quiz:", error);
  //     alert("Error submitting quiz. Please try again.");
  //   }
  // };

  const handleSubmit = async () => {
    try {
      // Update questions with user answers
      const updatedQuestions = questions.map((question, index) => ({
        ...question,
        UserAnswer: userAnswers[index] || "Not answered",
        Status:
          userAnswers[index] === question.CorrectAnswer
            ? "Correct"
            : "Incorrect",
      }));

      const response = await fetch("/api/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedQuestions),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        console.log("✅ Results saved:", result.fileInfo);
        setIsSubmitted(true);

        // Show success message with file info
        alert(
          `Quiz submitted successfully!\n\nResults saved to: ${result.fileInfo.path}`
        );
      } else {
        throw new Error(result.error || "Failed to submit quiz");
      }
    } catch (error) {
      console.error("Error submitting quiz:", error);
      alert("Error submitting quiz: " + error.message);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-xl">Loading questions...</div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-xl text-red-600">
          No questions found. Please check the Excel file.
        </div>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md">
          <div className="text-green-500 text-4xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-green-600 mb-4">
            Quiz Submitted Successfully!
          </h2>
          <p className="text-gray-600 mb-2">
            Your results have been saved to the server.
          </p>
          <p className="text-gray-600 mb-4">
            You can find the results file in the{" "}
            <code className="bg-gray-100 px-2 py-1 rounded">
              public/results
            </code>{" "}
            folder.
          </p>
          <div className="flex space-x-4 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
            >
              Take Quiz Again
            </button>
            <button
              onClick={() => window.open("/results", "_blank")}
              className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700"
            >
              View Results Folder
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const currentAnswer = userAnswers[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              Question {currentQuestionIndex + 1} of {questions.length}
            </span>
            <span className="text-sm font-medium text-gray-700">
              {Math.round(
                ((currentQuestionIndex + 1) / questions.length) * 100
              )}
              %
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${
                  ((currentQuestionIndex + 1) / questions.length) * 100
                }%`,
              }}
            ></div>
          </div>
        </div>

        {/* Question */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            {currentQuestion.Question}
          </h2>

          {/* Options */}
          <div className="space-y-3">
            {["A", "B", "C", "D"].map((option) => (
              <label
                key={option}
                className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                  currentAnswer === option
                    ? "bg-blue-50 border-blue-500"
                    : "border-gray-300 hover:bg-gray-50"
                }`}
              >
                <input
                  type="radio"
                  name="answer"
                  value={option}
                  checked={currentAnswer === option}
                  onChange={() => handleAnswerSelect(option)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-3 text-gray-700">
                  {option}. {currentQuestion[`Option${option}`]}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center">
          <button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className={`px-6 py-2 rounded-lg font-medium ${
              currentQuestionIndex === 0
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-gray-600 text-white hover:bg-gray-700"
            }`}
          >
            Previous
          </button>

          {!isLastQuestion ? (
            <button
              onClick={handleNext}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700"
            >
              Submit Quiz
            </button>
          )}
        </div>

        {/* Quick Navigation Dots */}
        <div className="flex justify-center space-x-2 mt-6">
          {questions.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentQuestionIndex(index)}
              className={`w-3 h-3 rounded-full ${
                index === currentQuestionIndex
                  ? "bg-blue-600"
                  : userAnswers[index]
                  ? "bg-green-500"
                  : "bg-gray-300"
              }`}
              title={`Question ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
