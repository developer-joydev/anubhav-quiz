"use client";
import { getSubjectById } from "@/lib/subjects";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function QuizPage() {
  const params = useParams();
  const router = useRouter();
  const subjectId = params.subject;

  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [showRequiredError, setShowRequiredError] = useState(false);

  const subject = getSubjectById(subjectId);

  useEffect(() => {
    if (!subject) {
      setError("Subject not found");
      setIsLoading(false);
      return;
    }
    loadQuestions();
  }, [subject]);

  useEffect(() => {
    isSubmitted && toast.success("Quiz submitted successfully!");
  }, [isSubmitted]);

  const notify = () => toast("Wow so easy!");
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
    // Hide required error when user selects an answer
    if (showRequiredError) {
      setShowRequiredError(false);
    }
  };

  const validateCurrentQuestion = () => {
    const currentAnswer = userAnswers[currentQuestionIndex];
    if (!currentAnswer || currentAnswer.trim() === "") {
      setShowRequiredError(true);
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (!validateCurrentQuestion()) {
      return;
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setShowRequiredError(false);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
      setShowRequiredError(false);
    }
  };

  const handleQuestionNavigation = (index) => {
    // Allow navigation to previous questions without validation
    // But require current question to be answered before moving to next questions
    if (index > currentQuestionIndex && !validateCurrentQuestion()) {
      return;
    }
    setCurrentQuestionIndex(index);
    setShowRequiredError(false);
  };

  const validateAllQuestions = () => {
    const unansweredQuestions = [];
    questions.forEach((_, index) => {
      if (!userAnswers[index] || userAnswers[index].trim() === "") {
        unansweredQuestions.push(index + 1);
      }
    });

    if (unansweredQuestions.length > 0) {
      alert(
        `Please answer all questions before submitting.\n\nUnanswered questions: ${unansweredQuestions.join(
          ", "
        )}`
      );
      // Jump to first unanswered question
      setCurrentQuestionIndex(unansweredQuestions[0] - 1);
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateAllQuestions()) {
      return;
    }

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

      const response = await fetch(`/api/submit?subject=${subjectId}`, {
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

        // alert(
        //   `Quiz submitted successfully!\n\nResults saved to: ${result.fileInfo.path}`
        // );
      } else {
        throw new Error(result.error || "Failed to submit quiz");
      }
    } catch (error) {
      console.error("Error submitting quiz:", error);
      alert("Error submitting quiz: " + error.message);
    }
  };

  // Calculate progress and completion
  const answeredCount = Object.values(userAnswers).filter(
    (answer) => answer && answer.trim() !== ""
  ).length;
  const totalQuestions = questions.length;
  const isAllAnswered = answeredCount === totalQuestions;

  // Redirect if subject not found
  if (!subject) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Subject Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            The requested subject does not exist.
          </p>
          <button
            onClick={() => router.push("/")}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

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
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
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
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                {subject.name} Quiz
              </h1>
              <p className="text-gray-600">{subject.description}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 text-center sm:text-right">
              <div>
                <div className="text-sm text-gray-500">Progress</div>
                <div className="text-lg font-semibold">
                  {answeredCount}/{totalQuestions} Answered
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Completion</div>
                <div className="text-lg font-semibold">
                  {Math.round((answeredCount / totalQuestions) * 100)}%
                </div>
              </div>
            </div>
          </div>

          {/* Completion Status Bar */}
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Quiz Progress</span>
              <span>
                {Math.round((answeredCount / totalQuestions) * 100)}% Complete
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-green-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Quiz Container */}
        <div className="bg-white rounded-lg shadow-md p-6">
          {/* Question Header */}
          <div className="flex justify-between items-center mb-4">
            <div className="text-sm font-medium text-gray-700">
              Question {currentQuestionIndex + 1} of {questions.length}
            </div>
            <div
              className={`text-sm font-medium px-3 py-1 rounded-full ${
                currentAnswer
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {currentAnswer ? "Answered" : "Not Answered"}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
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

          {/* Required Error Message */}
          {showRequiredError && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center">
                <span className="text-red-500 text-lg mr-2">⚠️</span>
                <span className="text-red-700 font-medium">
                  This question is required. Please select an answer before
                  proceeding.
                </span>
              </div>
            </div>
          )}

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
                    className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                      currentAnswer === option
                        ? "bg-blue-50 border-blue-500 shadow-sm"
                        : "border-gray-300 hover:bg-gray-50 hover:border-gray-400"
                    } ${showRequiredError ? "border-red-300" : ""}`}
                  >
                    <input
                      type="radio"
                      name="answer"
                      value={option}
                      checked={currentAnswer === option}
                      onChange={() => handleAnswerSelect(option)}
                      className="h-5 w-5 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-3 text-gray-700 font-medium">
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
                className={`px-6 py-2 rounded-lg font-medium ${
                  currentAnswer
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-blue-400 text-white cursor-not-allowed"
                }`}
              >
                Next Question
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className={`px-6 py-2 rounded-lg font-medium ${
                  isAllAnswered
                    ? "bg-green-600 text-white hover:bg-green-700"
                    : "bg-green-400 text-white cursor-not-allowed"
                }`}
              >
                {isAllAnswered ? "Submit Quiz" : "Complete All Questions"}
              </button>
            )}
          </div>

          {/* Quick Navigation Dots */}
          <div className="mt-8">
            <h3 className="text-sm font-medium text-gray-700 mb-3 text-center">
              Question Navigation - {answeredCount}/{totalQuestions} Answered
            </h3>
            <div className="flex justify-center space-x-2 flex-wrap">
              {questions.map((_, index) => {
                const isAnswered =
                  userAnswers[index] && userAnswers[index].trim() !== "";
                const isCurrent = index === currentQuestionIndex;

                return (
                  <button
                    key={index}
                    onClick={() => handleQuestionNavigation(index)}
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200 ${
                      isCurrent
                        ? "bg-blue-600 text-white ring-2 ring-blue-300"
                        : isAnswered
                        ? "bg-green-500 text-white hover:bg-green-600"
                        : "bg-gray-300 text-gray-600 hover:bg-gray-400"
                    }`}
                    title={`Question ${index + 1}${
                      isAnswered ? " (Answered)" : " (Not Answered)"
                    }`}
                  >
                    {index + 1}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Completion Message */}
          {isAllAnswered && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg text-center">
              <div className="flex items-center justify-center">
                <span className="text-green-500 text-lg mr-2">🎉</span>
                <span className="text-green-700 font-medium">
                  All questions answered! You can now submit your quiz.
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Quiz Instructions */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-800 mb-2">
            Quiz Instructions:
          </h3>
          <ul className="text-sm text-blue-700 list-disc list-inside space-y-1">
            <li>All questions are mandatory and must be answered</li>
            <li>
              You cannot proceed to the next question without answering the
              current one
            </li>
            <li>Use the number navigation to jump between questions</li>
            <li>Green numbers indicate answered questions</li>
            <li>Gray numbers indicate unanswered questions</li>
            <li>
              Submit button will be enabled only when all questions are answered
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
