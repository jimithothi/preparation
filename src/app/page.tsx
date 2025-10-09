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
      process.env.NEXT_PUBLIC_API_URL;
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
       <div className="border-b border-gray-200 pb-6 mb-8">
  <h1 className="text-4xl font-semibold text-gray-900 mb-2">
    Interview Questions
  </h1>
  <p className="text-gray-500">
    Curated collection of technical interview questions
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
