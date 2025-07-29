"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import CommentCard from "@/components/CommentCard";

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

export default function FeedbackDetailPage() {
  const params = useParams();
  const feedbackId = params.id as string;
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeedback = async () => {
      if (!feedbackId) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`/api/feedback/${feedbackId}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Feedback not found");
          }
          throw new Error("Failed to fetch feedback");
        }
        
        const data = await response.json() as Feedback;
        setFeedback(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchFeedback();
  }, [feedbackId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-md p-6">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
                <div className="mt-4">
                  <Link
                    href="/"
                    className="inline-flex items-center px-3 py-2 border border-red-300 shadow-sm text-sm leading-4 font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    ← Back to Home
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!feedback) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center py-8">
            <p className="text-gray-500 text-lg">Feedback not found.</p>
            <div className="mt-4">
              <Link
                href="/"
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                ← Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 mb-4"
          >
            ← Back to Reviews
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">
            Customer Review
          </h1>
          <p className="text-gray-600 mt-2">
            Detailed view of customer feedback
          </p>
        </div>

        {/* Feedback Detail */}
        <div className="bg-white rounded-lg shadow-sm">
          <CommentCard
            feedbackId={feedback.feedbackId}
            name={feedback.name}
            rating={feedback.rating}
            content={feedback.content}
            diningTime={feedback.diningTime}
            createdAt={feedback.createdAt}
            likes={feedback.likes}
            dislikes={feedback.dislikes}
            isDetailView={true}
          />
        </div>

        {/* Social Sharing */}
        <div className="mt-6 p-4 bg-white rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Share this review</h3>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => {
                const url = window.location.href;
                const text = `Check out this review for Louis' Steak House: "${feedback.content.substring(0, 100)}..."`;
                if (navigator.share) {
                  navigator.share({ title: "Customer Review", text, url });
                } else {
                  navigator.clipboard.writeText(`${text} ${url}`);
                  alert("Link copied to clipboard!");
                }
              }}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              📋 Copy Link
            </button>
            
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out this review for Louis' Steak House`)}&url=${encodeURIComponent(window.location.href)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              🐦 Twitter
            </a>
            
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              📘 Facebook
            </a>
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-8 flex justify-center">
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            View All Reviews
          </Link>
        </div>
      </div>
    </div>
  );
}