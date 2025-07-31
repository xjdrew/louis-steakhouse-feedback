"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import StarRating from "@/components/StarRating";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PageContainer from "@/components/layout/PageContainer";
import { validateFeedbackForm, hasValidationErrors, type FeedbackFormData, type ValidationError } from "@/lib/validation";

export default function SubmitFeedback() {
  const router = useRouter();
  const [formData, setFormData] = useState<FeedbackFormData>({
    name: "",
    contact: "",
    diningTime: "",
    rating: 5,
    content: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<ValidationError>({});
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
    const newErrors = validateFeedbackForm(formData);
    setErrors(newErrors);
    return !hasValidationErrors(newErrors);
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
    <PageContainer maxWidth="md" padding="md">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl sm:text-2xl text-gray-900">
            Submit Your Feedback
          </CardTitle>
          <p className="text-sm sm:text-base text-gray-600">
            Help us improve your dining experience
          </p>
        </CardHeader>
        <CardContent>

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
              <Label htmlFor="name">
                Name (Optional)
              </Label>
              <Input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={errors.name ? 'border-red-300' : ''}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            <div>
              <Label htmlFor="contact">
                Contact (Email/Phone) (Optional)
              </Label>
              <Input
                type="text"
                id="contact"
                name="contact"
                value={formData.contact}
                onChange={handleInputChange}
                className={errors.contact ? 'border-red-300' : ''}
              />
              {errors.contact && (
                <p className="mt-1 text-sm text-red-600">{errors.contact}</p>
              )}
            </div>

            <div>
              <Label htmlFor="diningTime">
                Dining Time (Optional)
              </Label>
              <Input
                type="datetime-local"
                id="diningTime"
                name="diningTime"
                value={formData.diningTime}
                onChange={handleInputChange}
                className={errors.diningTime ? 'border-red-300' : ''}
              />
              {errors.diningTime && (
                <p className="mt-1 text-sm text-red-600">{errors.diningTime}</p>
              )}
            </div>

            <div>
              <Label className="mb-2">
                Rating *
              </Label>
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
              <Label htmlFor="content">
                Feedback *
              </Label>
              <Textarea
                id="content"
                name="content"
                required
                value={formData.content}
                onChange={handleInputChange}
                rows={4}
                className={errors.content ? 'border-red-300' : ''}
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
              <Button
                type="submit"
                disabled={isSubmitting || submitMessage?.type === 'success'}
                className="w-full"
                size="lg"
              >
                {isSubmitting && (
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                {isSubmitting ? "Submitting..." : "Submit Feedback"}
              </Button>

              <Button
                asChild
                variant="outline"
                className="w-full"
                size="lg"
              >
                <Link href="/">
                  Back to Home
                </Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </PageContainer>
  );
}