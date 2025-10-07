import QuestionsList from "@/components/QuestionsList";
import Link from "next/link";
import { Suspense } from "react";

type Question = {
  _id: string;
  question: string;
  answer: string;
  category: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
};

// Fetch questions on the server
async function getQuestions(): Promise<Question[]> {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";
    const response = await fetch(`${baseUrl}/questions`, {
      next: { revalidate: 3600 }, // ISR: Revalidate every 60 seconds
    });

    if (!response.ok) {
      throw new Error("Failed to fetch questions");
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error("Error fetching questions:", error);
    return [];
  }
}

// This is now a Server Component with ISR
export default async function Home() {
  const questions = await getQuestions();

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4 shadow-lg">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">
            Interview Questions
          </h1>
          <p className="text-base text-gray-600 max-w-2xl mx-auto">
            Browse through our curated collection of technical interview
            questions
          </p>
        </div>

        {/* Client-side filtering component */}
        <Suspense
          fallback={
            <div className="flex flex-col justify-center items-center py-12">
              <div className="relative">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200"></div>
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600 absolute top-0 left-0"></div>
              </div>
              <p className="mt-3 text-gray-600 font-medium">
                Loading questions...
              </p>
            </div>
          }
        >
          <QuestionsList initialQuestions={questions} />
        </Suspense>
      </div>
    </main>
  );
}
