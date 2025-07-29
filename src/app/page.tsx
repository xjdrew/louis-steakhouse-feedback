"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import CommentCard from "../components/CommentCard";
import RatingFilter from "../components/RatingFilter";
import Pagination from "../components/Pagination";

interface Feedback {
  feedbackId: string;
  name: string | null;
  rating: number;
  content: string;
  diningTime: string | null;
  createdAt: string;
  likes: number;
  dislikes: number;
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export const dynamic = "force-dynamic";

export default function Home() {
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 5,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  });
  const [currentRating, setCurrentRating] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFeedback = async (page: number = 1, rating: string = "all") => {
    setLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "5",
      });
      
      if (rating !== "all") {
        params.append("rating", rating);
      }
      
      // Fetch feedback from the API
      const response = await fetch(`/api/feedback/public?${params}`);
      
      if (!response.ok) {
        console.error("Failed to fetch feedback", response.status, response.statusText);
        throw new Error("Failed to fetch feedback");
      }
      
      const data = await response.json() as { feedback: Feedback[]; pagination: PaginationInfo };
      setFeedback(data?.feedback || []);
      setPagination(data?.pagination || {
        page: 1,
        limit: 5,
        total: 0,
        totalPages: 0,
        hasNext: false,
        hasPrev: false,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setFeedback([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedback();
  }, []);

  const handlePageChange = (page: number) => {
    fetchFeedback(page, currentRating);
  };

  const handleRatingChange = (rating: string) => {
    setCurrentRating(rating);
    fetchFeedback(1, rating);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Louis&apos; Steak House
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            We value your feedback and strive to provide the best dining experience.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <Link
              href="/feedback/submit"
              className="flex justify-center py-3 px-6 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
            >
              Submit Feedback
            </Link>
            
            <Link
              href="/feedback/view"
              className="flex justify-center py-3 px-6 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
            >
              View My Feedback
            </Link>
          </div>
        </div>

        {/* Feedback Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Customer Reviews</h2>
          
          <RatingFilter 
            currentRating={currentRating}
            onRatingChange={handleRatingChange}
          />

          {loading && (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error</h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{error}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {!loading && !error && feedback.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500 text-lg">No feedback found.</p>
              <p className="text-gray-400 text-sm mt-2">
                {currentRating !== "all" ? "Try changing the rating filter." : "Be the first to share your experience!"}
              </p>
            </div>
          )}

          {!loading && !error && feedback.length > 0 && (
            <>
              <div className="space-y-6">
                {feedback.map((item) => (
                  <CommentCard
                    key={item.feedbackId}
                    feedbackId={item.feedbackId}
                    name={item.name}
                    rating={item.rating}
                    content={item.content}
                    diningTime={item.diningTime}
                    createdAt={item.createdAt}
                    likes={item.likes}
                    dislikes={item.dislikes}
                  />
                ))}
              </div>

              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
                onPageChange={handlePageChange}
                hasNext={pagination.hasNext}
                hasPrev={pagination.hasPrev}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
