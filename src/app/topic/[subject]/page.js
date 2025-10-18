"use client";
import { fetchTopics } from "@/lib/loadData";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Topic = () => {
  const params = useParams();
  const router = useRouter();
  const [topics, setTopics] = useState([]);

  const subjectId = params.subject;

  useEffect(() => {
    const fetchData = async () => {
      const topicList = await fetchTopics();
      setTopics(topicList || []);
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-end items-center mb-3">
          <div className="flex space-x-4">
            <button
              onClick={() => router.back()}
              className="px-6 py-2 bg-gray-500 text-white rounded-lg font-medium hover:bg-gray-600"
            >
              Back to Subjects
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {topics
            .filter((topic) => topic?.subject._id === subjectId)
            .map((topic) => (
              <div
                key={topic._id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                {/* Subject Icon Header */}
                <div
                  className={`bg-gradient-to-r ${topic?.subject?.color} p-6 text-white`}
                >
                  {/* <div className="text-4xl mb-2">🍞</div> */}
                  <h3 className="text-2xl font-bold">{topic.title}</h3>
                </div>

                {/* Subject Content */}
                <div className="p-6">
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {topic?.description}
                  </p>

                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-gray-500">
                      {topic?.totalQuestions} questions
                    </span>
                    <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
                      Test Pending
                    </span>
                  </div>

                  {/* Start Quiz Button */}
                  <a
                    href={`/topic/${subjectId}/${topic._id}`}
                    className={`block w-full text-center py-3 px-4 bg-gradient-to-r ${topic?.subject?.color} text-white font-semibold rounded-lg hover:opacity-90 transition-opacity`}
                  >
                    Start Test
                  </a>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Topic;
