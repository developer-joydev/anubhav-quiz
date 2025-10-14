// app/quiz/[subject]/QuizClient.js
"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function QuizClient({ subject, initialQuestions, subjectId }) {
  const router = useRouter();
  const [questions, setQuestions] = useState(initialQuestions || []);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [isLoading, setIsLoading] = useState(
    !initialQuestions || initialQuestions.length === 0
  );
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  // If no questions were provided statically, load them on client
  useEffect(() => {
    if (!initialQuestions || initialQuestions.length === 0) {
      loadQuestions();
    } else {
      // Initialize user answers for pre-loaded questions
      const initialAnswers = {};
      initialQuestions.forEach((_, index) => {
        initialAnswers[index] = "";
      });
      setUserAnswers(initialAnswers);
    }
  }, [initialQuestions]);

  const loadQuestions = async () => {
    try {
      setIsLoading(true);
      setError("");

      const response = await fetch(`/api/questions?subject=${subjectId}`);

      if (!response.ok) {
        throw new Error(`Failed to load questions: ${response.status}`);
      }

      const data = await response.json();

      if (!data || data.length === 0) {
        throw new Error("No questions available for this subject");
      }

      setQuestions(data);

      // Initialize user answers
      const initialAnswers = {};
      data.forEach((_, index) => {
        initialAnswers[index] = "";
      });
      setUserAnswers(initialAnswers);
    } catch (error) {
      console.error("Error loading questions:", error);
      setError(error.message);
      setQuestions([]);
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

  const handleSubmit = async () => {
    try {
      // Update questions with user answers and status
      const updatedQuestions = questions.map((question, index) => ({
        ...question,
        UserAnswer: userAnswers[index] || "Not answered",
        Status:
          userAnswers[index] === question.CorrectAnswer
            ? "Correct"
            : "Incorrect",
        Subject: subject.name,
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

  // Render loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-xl text-gray-600">
            Loading {subject.name} questions...
          </div>
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-red-600 mb-2">
            Error Loading Questions
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="flex space-x-4 justify-center">
            <button
              onClick={loadQuestions}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
            >
              Try Again
            </button>
            <button
              onClick={() => router.push("/")}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-xl text-red-600">
          No questions available for {subject.name}.
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
            Your {subject.name} quiz results have been saved.
          </p>
          <p className="text-gray-600 mb-4">
            Check the{" "}
            <code className="bg-gray-100 px-2 py-1 rounded">
              public/results
            </code>{" "}
            folder.
          </p>
          <div className="flex space-x-4 justify-center">
            <button
              onClick={() => router.push("/")}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
            >
              Back to Home
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700"
            >
              Retake Quiz
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
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                {subject.name} Quiz
              </h1>
              <p className="text-gray-600">{subject.description}</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Subject</div>
              <div className="text-lg font-semibold">{subject.name}</div>
            </div>
          </div>
        </div>

        {/* Quiz Container */}
        <div className="bg-white rounded-lg shadow-md p-6">
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
              {["A", "B", "C", "D"].map((option) => {
                const optionText = currentQuestion[`Option${option}`];
                return optionText ? (
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
                      {option}. {optionText}
                    </span>
                  </label>
                ) : null;
              })}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center">
            <div className="flex space-x-4">
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
              <button
                onClick={() => router.push("/")}
                className="px-6 py-2 bg-gray-500 text-white rounded-lg font-medium hover:bg-gray-600"
              >
                Back to Subjects
              </button>
            </div>

            {!isLastQuestion ? (
              <button
                onClick={handleNext}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
              >
                Next Question
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
          <div className="flex justify-center space-x-2 mt-6 flex-wrap">
            {questions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestionIndex(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentQuestionIndex
                    ? "bg-blue-600"
                    : userAnswers[index]
                    ? "bg-green-500"
                    : "bg-gray-300"
                }`}
                title={`Question ${index + 1}${
                  userAnswers[index] ? " (Answered)" : ""
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
