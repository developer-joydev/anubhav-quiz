import { fetchResults } from "@/lib/loadData";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Results = ({ onRestart, topic, questions }) => {
  const router = useRouter();
  const [results, setResults] = useState([]);
  useEffect(() => {
    const loadResults = async () => {
      const resultsData = await fetchResults(topic?._id);
      setResults(resultsData);
    };
    loadResults();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Quiz Results</h2>
        <div className="flex items-center justify-between mb-4">
          <div className="text-lg font-bold text-blue-500">{topic?.title}</div>
          <div className="flex gap-4 items-center">
            <button
              onClick={onRestart}
              className="px-6 py-2 bg-red-200 text-red-600 border border-red-600 rounded-lg font-medium hover:bg-white hover:text-red-700 cursor-pointer"
            >
              Restart Quiz
            </button>
            <button
              onClick={() => router.push("/")}
              className="px-6 py-2 bg-green-100 text-green-600 border border-green-600 rounded-lg font-medium hover:bg-white hover:text-green-700 cursor-pointer"
            >
              Back to Subjects
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
          <div className="bg-white rounded-lg p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-blue-600">
              {results?.totalQuestions}
            </div>
            <div className="text-gray-600">মোট প্রশ্ন</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-green-600">
              {results?.correctAnswers}
            </div>
            <div className="text-gray-600">সঠিক উত্তর</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-purple-600">
              {results?.wrongAnswers}
            </div>
            <div className="text-gray-600">ভুল উত্তর</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-orange-600">
              {results?.percentage}%
            </div>
            <div className="text-gray-600">Percentage</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center shadow-sm">
            <div
              className={`text-2xl font-bold ${
                results?.percentage <= 80 ? "text-red-600" : "text-green-600"
              }`}
            >
              {results?.percentage <= 80 ? "FAIL" : "PASS"}
            </div>
            <div className="text-gray-600">Result</div>
          </div>
        </div>

        {/* Question answer table */}
        <div className="relative">
          <table className="w-full table-auto text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3 w-[45%]">
                  প্রশ্ন
                </th>
                <th scope="col" className="px-6 py-3 w-[20%]">
                  সঠিক উত্তর
                </th>
                <th scope="col" className="px-6 py-3 w-[20%]">
                  তোমার উত্তর
                </th>
                <th scope="col" className="px-6 py-3 w-[15%]">
                  ঠিক / ভুল
                </th>
              </tr>
            </thead>
            <tbody>
              {questions.map((question) => (
                <tr
                  key={question._id}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200"
                >
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {question.question}
                  </th>
                  <td className="px-6 py-4">{question.correctAnswer}</td>
                  <td className="px-6 py-4">{question.userAnswer}</td>
                  <td className="px-6 py-4">
                    {question.correctAnswer === question.userAnswer
                      ? "✅ ঠিক"
                      : "❌ ভুল"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Results;
