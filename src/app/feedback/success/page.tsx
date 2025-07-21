"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function FeedbackSuccess() {
  const searchParams = useSearchParams();
  const feedbackId = searchParams.get("id");

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Thank You!
            </h1>
            
            <p className="text-gray-600 mb-6">
              Your feedback has been successfully submitted.
            </p>
            
            {feedbackId && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-600 mb-2">
                  Your feedback ID is:
                </p>
                <p className="text-lg font-mono font-semibold text-gray-900 break-all">
                  {feedbackId}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Save this ID to check the status of your feedback later.
                </p>
              </div>
            )}
            
            <div className="space-y-4">
              <Link
                href="/feedback/view"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
              >
                Check Feedback Status
              </Link>
              
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