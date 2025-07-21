"use client";

import { useState } from "react";
import Link from "next/link";

interface Feedback {
  feedbackId: string;
  name: string | null;
  rating: number;
  content: string;
  status: string;
  response: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function ViewFeedback() {
  const [feedbackId, setFeedbackId] = useState("");
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackId.trim()) {
      setError("Please enter a feedback ID");
      return;
    }

    setLoading(true);
    setError("");
    setFeedback(null);

    try {
      const response = await fetch(`/api/feedback?id=${encodeURIComponent(feedbackId.trim())}`);
      
      if (response.ok) {
        const data = await response.json();
        setFeedback(data);
      } else if (response.status === 404) {
        setError("Feedback not found. Please check your ID and try again.");
      } else {
        setError("An error occurred while fetching your feedback.");
      }
    } catch (error) {
      console.error("Error fetching feedback:", error);
      setError("An error occurred while fetching your feedback.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      unprocessed: "bg-yellow-100 text-yellow-800",
      processing: "bg-blue-100 text-blue-800",
      processed: "bg-green-100 text-green-800",
    };

    const statusText = {
      unprocessed: "Unprocessed",
      processing: "Processing",
      processed: "Processed",
    };

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          statusStyles[status as keyof typeof statusStyles] || "bg-gray-100 text-gray-800"
        }`}
      >
        {statusText[status as keyof typeof statusText] || status}
      </span>
    );
  };

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <svg
        key={i}
        className={`w-5 h-5 ${
          i < rating ? "text-yellow-400" : "text-gray-300"
        }`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                View Your Feedback
              </h1>
              <p className="text-gray-600">
                Enter your feedback ID to check the status
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mb-8">
              <div className="flex gap-4">
                <input
                  type="text"
                  value={feedbackId}
                  onChange={(e) => setFeedbackId(e.target.value)}
                  placeholder="Enter your feedback ID"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Searching..." : "Search"}
                </button>
              </div>
            </form>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {feedback && (
              <div className="border rounded-lg p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Feedback Details
                  </h2>
                  {getStatusBadge(feedback.status)}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">ID:</span>
                    <p className="text-gray-900 font-mono break-all">{feedback.feedbackId}</p>
                  </div>
                  
                  {feedback.name && (
                    <div>
                      <span className="font-medium text-gray-700">Name:</span>
                      <p className="text-gray-900">{feedback.name}</p>
                    </div>
                  )}
                  
                  <div>
                    <span className="font-medium text-gray-700">Rating:</span>
                    <div className="flex items-center mt-1">
                      {getRatingStars(feedback.rating)}
                      <span className="ml-2 text-gray-600">({feedback.rating}/5)</span>
                    </div>
                  </div>
                  
                  <div>
                    <span className="font-medium text-gray-700">Submitted:</span>
                    <p className="text-gray-900">
                      {new Date(feedback.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div>
                  <span className="font-medium text-gray-700">Feedback:</span>
                  <p className="text-gray-900 mt-1 whitespace-pre-wrap">
                    {feedback.content}
                  </p>
                </div>

                {feedback.response && (
                  <div className="border-t pt-4">
                    <span className="font-medium text-gray-700">Our Response:</span>
                    <p className="text-gray-900 mt-1 whitespace-pre-wrap">
                      {feedback.response}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      Last updated: {new Date(feedback.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
            )}

            <div className="mt-8">
              <Link
                href="/"
                className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}