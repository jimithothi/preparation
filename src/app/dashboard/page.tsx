"use client";

import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import ProtectedRoute from "@/components/ProtectedRoute";
import RichTextEditor from "@/components/RichTextEditor";
import { useAuth } from "@/contexts/AuthContext";
import { API_URL } from "@/config/api";
import { authFetch } from "@/lib/auth-fetch";

type Question = {
  _id?: string;
  question: string;
  answer: string;
  category: string;
  tags: string[];
  createdAt?: string;
  updatedAt?: string;
};

// Yup validation schema
const questionSchema = Yup.object({
  question: Yup.string()
    .required("Question is required")
    .min(10, "Question must be at least 10 characters")
    .max(500, "Question must not exceed 500 characters"),
  answer: Yup.string()
    .required("Answer is required")
    .min(20, "Answer must be at least 20 characters"),
  category: Yup.string()
    .required("Category is required")
    .min(2, "Category must be at least 2 characters"),
  tags: Yup.string()
    .required("At least one tag is required")
    .test("has-tags", "Please enter at least one tag", (value) => {
      if (!value) return false;
      const tags = value.split(",").map((t) => t.trim()).filter(Boolean);
      return tags.length > 0;
    }),
});

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Formik setup
  const formik = useFormik({
    initialValues: {
      question: "",
      answer: "",
      category: "",
      tags: "",
    },
    validationSchema: questionSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      setError(null);
      setSuccess(null);

      try {
        const tagsArray = values.tags
          .split(",")
          .map((tag) => tag.trim().toLowerCase())
          .filter(Boolean);

        const payload = {
          question: values.question,
          answer: values.answer,
          category: values.category,
          tags: tagsArray,
        };

        const url = editingId
          ? `${API_URL}/question/${editingId}`
          : `${API_URL}/question`;

        const method = editingId ? "PUT" : "POST";

        const response = await authFetch(url, {
          method,
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error("Failed to save question");
        }

        setSuccess(
          editingId
            ? "Question updated successfully!"
            : "Question created successfully!"
        );

        resetForm();
        setEditingId(null);
        fetchQuestions();
      } catch (err) {
        console.error("Error saving question:", err);
        setError("Failed to save question. Please try again.");
      } finally {
        setSubmitting(false);
      }
    },
  });


  const fetchQuestions = async () => {
    try {
      const response = await authFetch(`${API_URL}/questions`);
      if (!response.ok) {
        throw new Error("Failed to fetch questions");
      }
      const data = await response.json();
      setQuestions(data.data || []);
    } catch (err) {
      console.error("Error fetching questions:", err);
    }
  };

  const handleEdit = (question: Question) => {
    formik.setValues({
      question: question.question,
      answer: question.answer,
      category: question.category,
      tags: question.tags.join(", "),
    });
    setEditingId(question._id || null);
    setError(null);
    setSuccess(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    formik.resetForm();
    setEditingId(null);
    setError(null);
    setSuccess(null);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-1">
                  Admin Panel
                </h1>
                <p className="text-base text-gray-600">
                  Manage interview questions
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
                <button
                  onClick={logout}
                  className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Form Section */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {editingId ? "Edit Question" : "Add New Question"}
              </h2>

              {error && (
                <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              {success && (
                <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-sm text-green-700">{success}</p>
                </div>
              )}

              <form onSubmit={formik.handleSubmit} className="space-y-4">
                {/* Question Field */}
                <div>
                  <label
                    htmlFor="question"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Question <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="question"
                    name="question"
                    value={formik.values.question}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full px-4 py-2.5 text-gray-900 border rounded-lg focus:outline-none focus:ring-2 ${
                      formik.touched.question && formik.errors.question
                        ? "border-red-300 focus:ring-red-500"
                        : "border-gray-300 focus:ring-blue-500"
                    }`}
                    placeholder="Enter your question"
                  />
                  {formik.touched.question && formik.errors.question && (
                    <p className="mt-1 text-sm text-red-600">
                      {formik.errors.question}
                    </p>
                  )}
                </div>

                {/* Answer Field */}
                <div>
                  <label
                    htmlFor="answer"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Answer <span className="text-red-500">*</span>
                  </label>
                  <RichTextEditor
                    value={formik.values.answer}
                    onChange={(value) => formik.setFieldValue("answer", value)}
                    error={
                      formik.touched.answer && formik.errors.answer
                        ? formik.errors.answer
                        : undefined
                    }
                  />
                </div>

                {/* Category Field */}
                <div>
                  <label
                    htmlFor="category"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Category <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="category"
                    name="category"
                    value={formik.values.category}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full px-4 py-2.5 text-gray-900 border rounded-lg focus:outline-none focus:ring-2 ${
                      formik.touched.category && formik.errors.category
                        ? "border-red-300 focus:ring-red-500"
                        : "border-gray-300 focus:ring-blue-500"
                    }`}
                    placeholder="e.g., Technical, Behavioral"
                  />
                  {formik.touched.category && formik.errors.category && (
                    <p className="mt-1 text-sm text-red-600">
                      {formik.errors.category}
                    </p>
                  )}
                </div>

                {/* Tags Field */}
                <div>
                  <label
                    htmlFor="tags"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Tags <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="tags"
                    name="tags"
                    value={formik.values.tags}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full px-4 py-2.5 text-gray-900 border rounded-lg focus:outline-none focus:ring-2 ${
                      formik.touched.tags && formik.errors.tags
                        ? "border-red-300 focus:ring-red-500"
                        : "border-gray-300 focus:ring-blue-500"
                    }`}
                    placeholder="e.g., javascript, api, react"
                  />
                  {formik.touched.tags && formik.errors.tags && (
                    <p className="mt-1 text-sm text-red-600">{formik.errors.tags}</p>
                  )}
                  <p className="mt-1 text-xs text-gray-500">
                    Separate tags with commas
                  </p>
                </div>

                {/* Submit Buttons */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={formik.isSubmitting}
                    className="flex-1 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {formik.isSubmitting
                      ? "Saving..."
                      : editingId
                        ? "Update Question"
                        : "Add Question"}
                  </button>
                  {editingId && (
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="px-6 py-3 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Questions List Section */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Questions List
                </h2>
                <button
                  onClick={fetchQuestions}
                  className="px-4 py-2 bg-blue-100 text-blue-700 text-sm font-medium rounded-lg hover:bg-blue-200 transition-colors"
                >
                  Refresh
                </button>
              </div>

              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {questions.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">
                    No questions yet. Add your first question!
                  </p>
                ) : (
                  questions.map((q) => (
                    <div
                      key={q._id}
                      className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
                    >
                      <h3 className="font-medium text-gray-900 mb-2">
                        {q.question}
                      </h3>
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {q.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded-md"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">
                          {q.category}
                        </span>
                        <button
                          onClick={() => handleEdit(q)}
                          className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}