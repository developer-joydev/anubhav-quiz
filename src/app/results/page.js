"use client";
import { useEffect, useState } from "react";

export default function ResultsPage() {
  const [resultFiles, setResultFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadResultFiles();
  }, []);

  const loadResultFiles = async () => {
    try {
      // This would typically come from an API that reads the directory
      // For now, we'll simulate it since we can't directly read the public folder
      const response = await fetch("/api/results");
      const files = await response.json();
      setResultFiles(files);
    } catch (error) {
      console.error("Error loading result files:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-xl text-gray-600">Loading results...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            Quiz Results
          </h1>

          {resultFiles.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No result files found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Filename
                    </th>
                    <th className="px-6 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {resultFiles.map((file, index) => (
                    <tr
                      key={index}
                      className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    >
                      <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-800">
                        {file.filename}
                      </td>
                      <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-600">
                        {new Date(file.timestamp).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 border-b border-gray-200 text-sm">
                        <a
                          href={`/results/${file.filename}`}
                          download
                          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                        >
                          Download
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="mt-6">
            <a
              href="/"
              className="px-6 py-2 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700"
            >
              Back to Quiz
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
