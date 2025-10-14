"use client";
import { subjects } from "@/lib/subjects";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Anubhav
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Test your knowledge across various subjects. Choose a subject to
            start your quiz journey!
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="bg-white rounded-lg p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-blue-600">
              {subjects.length}
            </div>
            <div className="text-gray-600">Subjects</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-green-600">
              {subjects.reduce(
                (total, subject) => total + subject.questionCount,
                0
              )}
              +
            </div>
            <div className="text-gray-600">Questions</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-purple-600">100%</div>
            <div className="text-gray-600">Free</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-orange-600">Instant</div>
            <div className="text-gray-600">Results</div>
          </div>
        </div>

        {/* Subject Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {subjects.map((subject) => (
            <div
              key={subject.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              {/* Subject Icon Header */}
              <div
                className={`bg-gradient-to-r ${subject.color} p-6 text-white`}
              >
                <div className="text-4xl mb-2">{subject.icon}</div>
                <h3 className="text-2xl font-bold">{subject.name}</h3>
              </div>

              {/* Subject Content */}
              <div className="p-6">
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {subject.description}
                </p>

                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-500">
                    {subject.questionCount} questions
                  </span>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                    Multiple Choice
                  </span>
                </div>

                {/* Start Quiz Button */}
                <a
                  href={`/quiz/${subject.id}`}
                  className={`block w-full text-center py-3 px-4 bg-gradient-to-r ${subject.color} text-white font-semibold rounded-lg hover:opacity-90 transition-opacity`}
                >
                  Start Quiz
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Features Section */}
        {/* <div className="mt-16 bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📝</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Choose Subject</h3>
              <p className="text-gray-600">
                Select from various subjects based on your interest
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Take Quiz</h3>
              <p className="text-gray-600">
                Answer multiple choice questions one by one
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Get Results</h3>
              <p className="text-gray-600">
                Download your performance report instantly
              </p>
            </div>
          </div>
        </div> */}

        {/* Footer */}
        <div className="mt-24 text-center text-gray-500">
          <p>©2025 Anubhav Tests. Test your knowledge, enhance your skills.</p>
        </div>
      </div>
    </div>
  );
}
