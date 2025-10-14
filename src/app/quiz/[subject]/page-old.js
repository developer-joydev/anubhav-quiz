// app/quiz/[subject]/page.js
import { getSubjectById } from "@/lib/subjects";
import QuizClient from "./QuizClient";

export async function generateStaticParams() {
  // Define all subjects you want to pre-generate
  const subjects = ["math", "science", "bengali", "english", "computer"];

  return subjects.map((subject) => ({
    subject: subject,
  }));
}

// Fetch questions at build time for static generation
async function getQuestions(subjectId) {
  try {
    const response = await fetch(
      `http://localhost:3000/api/questions?subject=${subjectId}`,
      {
        // For static export, we need to fetch at build time
        next: { revalidate: 3600 }, // Optional: revalidate in seconds
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch questions: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching questions:", error);
    return [];
  }
}

export default async function QuizPage({ params }) {
  const { subject: subjectId } = await params;
  console.log("### Rendering QuizPage for params:", subjectId);
  // const subjectId = await params.subject;
  const subject = getSubjectById(subjectId);

  // If subject doesn't exist, show 404
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
          <a
            href="/"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
          >
            Back to Home
          </a>
        </div>
      </div>
    );
  }

  // Fetch questions at build time for static generation
  const questions = await getQuestions(subjectId);

  return (
    <QuizClient
      subject={subject}
      initialQuestions={questions}
      subjectId={subjectId}
    />
  );
}
