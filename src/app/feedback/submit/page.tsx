"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import StarRating from "@/components/StarRating";

export default function SubmitFeedback() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    diningTime: "",
    rating: 5,
    content: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [submitMessage, setSubmitMessage] = useState<{type: 'success' | 'error', message: string} | null>(null);

  // Set default dining time to current date/time
  useEffect(() => {
    const now = new Date();
    const localDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);
    setFormData(prev => ({
      ...prev,
      diningTime: localDateTime
    }));
  }, []);

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.content.trim()) {
      newErrors.content = "Feedback is required";
    } else if (formData.content.trim().length < 10) {
      newErrors.content = "Feedback must be at least 10 characters";
    }

    if (formData.contact && formData.contact.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const phoneRegex = /^[\+]?[\d\s\-\(\)]+$/;
      
      if (!emailRegex.test(formData.contact) && !phoneRegex.test(formData.contact)) {
        newErrors.contact = "Please enter a valid email or phone number";
      }
    }

    if (formData.rating < 1 || formData.rating > 5) {
      newErrors.rating = "Rating must be between 1 and 5";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitMessage(null);
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json() as { feedbackId: string };
        setSubmitMessage({ 
          type: 'success', 
          message: 'Thank you for your feedback! Redirecting to your feedback page...' 
        });
        
        // Redirect to comment detail page after 2 seconds
        setTimeout(() => {
          router.push(`/feedback/${result.feedbackId}`);
        }, 2000);
      } else {
        const errorData = await response.json().catch(() => ({}));
        setSubmitMessage({ 
          type: 'error', 
          message: errorData.error || "Failed to submit feedback. Please try again." 
        });
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      setSubmitMessage({ 
        type: 'error', 
        message: "An error occurred. Please check your connection and try again." 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "rating" ? parseInt(value) : value,
    }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleRatingChange = (rating: number) => {
    setFormData(prev => ({
      ...prev,
      rating
    }));
    
    if (errors.rating) {
      setErrors(prev => ({
        ...prev,
        rating: ""
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-4 sm:px-6 py-6 sm:py-8">
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
              Submit Your Feedback
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              Help us improve your dining experience
            </p>
          </div>

          {/* Success/Error Message */}
          {submitMessage && (
            <div className={`p-4 rounded-md mb-6 ${
              submitMessage.type === 'success' 
                ? 'bg-green-50 border border-green-200' 
                : 'bg-red-50 border border-red-200'
            }`}>
              <div className="flex">
                <div className="ml-3">
                  <p className={`text-sm font-medium ${
                    submitMessage.type === 'success' ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {submitMessage.message}
                  </p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Name (Optional)
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full px-3 py-3 sm:py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base sm:text-sm ${
                  errors.name ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="contact"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Contact (Email/Phone) (Optional)
              </label>
              <input
                type="text"
                id="contact"
                name="contact"
                value={formData.contact}
                onChange={handleInputChange}
                className={`w-full px-3 py-3 sm:py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base sm:text-sm ${
                  errors.contact ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.contact && (
                <p className="mt-1 text-sm text-red-600">{errors.contact}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="diningTime"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Dining Time (Optional)
              </label>
              <input
                type="datetime-local"
                id="diningTime"
                name="diningTime"
                value={formData.diningTime}
                onChange={handleInputChange}
                className={`w-full px-3 py-3 sm:py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base sm:text-sm ${
                  errors.diningTime ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.diningTime && (
                <p className="mt-1 text-sm text-red-600">{errors.diningTime}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rating *
              </label>
              <StarRating
                rating={formData.rating}
                onRatingChange={handleRatingChange}
                size="lg"
              />
              {errors.rating && (
                <p className="mt-1 text-sm text-red-600">{errors.rating}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="content"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Feedback *
              </label>
              <textarea
                id="content"
                name="content"
                required
                value={formData.content}
                onChange={handleInputChange}
                rows={4}
                className={`w-full px-3 py-3 sm:py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base sm:text-sm resize-y ${
                  errors.content ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Please share your dining experience... (minimum 10 characters)"
              />
              <div className="flex justify-between items-center mt-1">
                {errors.content && (
                  <p className="text-sm text-red-600">{errors.content}</p>
                )}
                <p className="text-xs text-gray-500 ml-auto">
                  {formData.content.length} characters
                </p>
              </div>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <button
                type="submit"
                disabled={isSubmitting || submitMessage?.type === 'success'}
                className="w-full flex justify-center items-center py-4 sm:py-3 px-4 border border-transparent rounded-md shadow-sm text-base sm:text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out touch-manipulation"
              >
                {isSubmitting && (
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                {isSubmitting ? "Submitting..." : "Submit Feedback"}
              </button>

              <Link
                href="/"
                className="w-full flex justify-center py-4 sm:py-3 px-4 border border-gray-300 rounded-md shadow-sm text-base sm:text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 active:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out touch-manipulation"
              >
                Back to Home
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}