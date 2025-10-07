"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';

type Question = {
  _id: string;
  question: string;
  answer: string;
  category: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
};

export default function Home() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter states
  const [searchTags, setSearchTags] = useState<string>('');
  const [searchCategory, setSearchCategory] = useState<string>('');
  const [searchQuestion, setSearchQuestion] = useState<string>('');

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        
        // Build query parameters
        const params = new URLSearchParams();
        if (searchTags.trim()) {
          params.append('tags', searchTags.trim());
        }
        if (searchCategory.trim()) {
          params.append('category', searchCategory.trim());
        }
        if (searchQuestion.trim()) {
          params.append('question', searchQuestion.trim());
        }
        
        const queryString = params.toString();
        const url = `/api/questions${queryString ? `?${queryString}` : ''}`;
        
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Failed to fetch questions');
        }
        const data = await response.json();
        setQuestions(data.data || []);
      } catch (err) {
        console.error('Error fetching questions:', err);
        setError('Failed to load questions. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [searchTags, searchCategory, searchQuestion]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Trigger search by updating state (already handled by useEffect)
  };

  const handleClearFilters = () => {
    setSearchTags('');
    setSearchCategory('');
    setSearchQuestion('');
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">Interview Questions</h1>
          <p className="text-base text-gray-600 max-w-2xl mx-auto">Browse through our curated collection of technical interview questions</p>
          
          {/* Search Form */}
          <div className="mt-6 max-w-7xl mx-auto">
            <div className="bg-white rounded-xl shadow-md p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* Tags Filter */}
                <div>
                  <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                    Tags
                  </label>
                  <input
                    id="tags"
                    type="text"
                    value={searchTags}
                    onChange={(e) => setSearchTags(e.target.value)}
                    placeholder="e.g., javascript, api"
                    className="w-full px-4 py-2.5 text-gray-900 placeholder-gray-400 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Category Filter */}
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <input
                    id="category"
                    type="text"
                    value={searchCategory}
                    onChange={(e) => setSearchCategory(e.target.value)}
                    placeholder="e.g., Technical"
                    className="w-full px-4 py-2.5 text-gray-900 placeholder-gray-400 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Question Search */}
                <div>
                  <label htmlFor="question" className="block text-sm font-medium text-gray-700 mb-2">
                    Question
                  </label>
                  <input
                    id="question"
                    type="text"
                    value={searchQuestion}
                    onChange={(e) => setSearchQuestion(e.target.value)}
                    placeholder="Search in questions..."
                    className="w-full px-4 py-2.5 text-gray-900 placeholder-gray-400 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Clear Filters Button */}
              {(searchTags || searchCategory || searchQuestion) && (
                <div className="flex justify-end mt-3">
                  <button
                    type="button"
                    onClick={handleClearFilters}
                    className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Clear Filters
                  </button>
                </div>
              )}
            </div>

            {/* Active Filters Display */}
            {(searchTags || searchCategory || searchQuestion) && (
              <div className="mt-3 flex flex-wrap gap-2 items-center">
                <span className="text-sm font-medium text-gray-600">Active Filters:</span>
                {searchTags && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                    </svg>
                    Tags: {searchTags}
                  </span>
                )}
                {searchCategory && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                    </svg>
                    Category: {searchCategory}
                  </span>
                )}
                {searchQuestion && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                    </svg>
                    Question: {searchQuestion}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Content Section */}
        {error ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        ) : loading ? (
          <div className="flex flex-col justify-center items-center py-12">
            <div className="relative">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200"></div>
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600 absolute top-0 left-0"></div>
            </div>
            <p className="mt-3 text-gray-600 font-medium">Loading questions...</p>
          </div>
        ) : questions.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl shadow-sm">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
              <svg
                className="w-10 h-10 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No questions found</h3>
            <p className="text-gray-500">Try adjusting your search or filter to find what you're looking for.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {questions.map((q, index) => (
              <div 
                key={q._id} 
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Question Header */}
                <div className="px-5 py-4 border-b border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 leading-relaxed">{q.question}</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {q.tags.map((tag) => (
                      <span
                        key={`${q._id}-${tag}`}
                        className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
                
                {/* Answer Section */}
                <div className="px-5 py-4">
                  <div 
                    className="text-gray-700 leading-relaxed answer-content"
                    dangerouslySetInnerHTML={{ __html: q.answer }}
                  />
                </div>
                
                {/* Footer */}
                <div className="bg-gray-50 px-5 py-3 border-t border-gray-100">
                  <div className="flex flex-wrap justify-between items-center gap-2 text-sm">
                    <span className="inline-flex items-center text-gray-600">
                      <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                      <span className="font-medium">{q.category}</span>
                    </span>
                    <span className="inline-flex items-center text-gray-500">
                      <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {new Date(q.createdAt).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
