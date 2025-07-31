"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import StarRating from "@/components/StarRating";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import PageContainer from "@/components/layout/PageContainer";

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
        const errorData = await response.json().catch(() => ({})) as { error?: string };
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
      <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50 rounded-2xl overflow-hidden">
        <CardHeader className="text-center pb-4 pt-6">
          <CardTitle className="text-3xl sm:text-4xl text-gray-900 font-bold tracking-tight">
            Share Your Experience
          </CardTitle>
          <CardDescription className="text-base text-gray-600 mt-2">
            Help us improve your dining experience
          </CardDescription>
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

          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
            <div className="space-y-2 transition-all duration-300">
              <Label htmlFor="name" className="text-base font-medium text-gray-700">
                Name <span className="text-muted-foreground font-normal">(Optional)</span>
              </Label>
              <Input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`text-base rounded-lg border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all ${errors.name ? 'border-red-300' : ''}`}
                placeholder="Enter your name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600 animate-pulse">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2 transition-all duration-300">
              <Label htmlFor="contact" className="text-base font-medium text-gray-700">
                Contact <span className="text-muted-foreground font-normal">(Email/Phone, Optional)</span>
              </Label>
              <Input
                type="text"
                id="contact"
                name="contact"
                value={formData.contact}
                onChange={handleInputChange}
                className={`text-base rounded-lg border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all ${errors.contact ? 'border-red-300' : ''}`}
                placeholder="Enter your email or phone number"
              />
              {errors.contact && (
                <p className="mt-1 text-sm text-red-600 animate-pulse">{errors.contact}</p>
              )}
            </div>

            <div className="space-y-2 transition-all duration-300">
              <Label htmlFor="diningTime" className="text-base font-medium text-gray-700">
                Dining Time <span className="text-muted-foreground font-normal">(Optional)</span>
              </Label>
              <Input
                type="datetime-local"
                id="diningTime"
                name="diningTime"
                value={formData.diningTime}
                onChange={handleInputChange}
                className={`text-base rounded-lg border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all ${errors.diningTime ? 'border-red-300' : ''}`}
              />
              {errors.diningTime && (
                <p className="mt-1 text-sm text-red-600 animate-pulse">{errors.diningTime}</p>
              )}
            </div>

            <div className="space-y-2 transition-all duration-300">
              <Label className="text-base font-medium text-gray-700">
                Rating <span className="text-destructive">*</span>
              </Label>
              <div className="py-3">
                <StarRating
                  rating={formData.rating}
                  onRatingChange={handleRatingChange}
                  size="lg"
                />
              </div>
              {errors.rating && (
                <p className="mt-1 text-sm text-red-600 animate-pulse">{errors.rating}</p>
              )}
            </div>

            <div className="space-y-2 transition-all duration-300">
              <Label htmlFor="content" className="text-base font-medium text-gray-700">
                Feedback <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="content"
                name="content"
                required
                value={formData.content}
                onChange={handleInputChange}
                rows={6}
                className={`text-base resize-none rounded-lg border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all ${errors.content ? 'border-red-300' : ''}`}
                placeholder="Please share your dining experience... (minimum 10 characters)"
              />
              <div className="flex justify-between items-center">
                {errors.content && (
                  <p className="text-sm text-red-600 animate-pulse">{errors.content}</p>
                )}
                <p className="text-sm text-muted-foreground ml-auto">
                  {formData.content.length} characters
                </p>
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <Button
                type="submit"
                disabled={isSubmitting || submitMessage?.type === 'success'}
                className="w-full text-base py-6 rounded-xl font-medium transition-all duration-300 hover:shadow-lg"
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
                className="w-full text-base py-6 rounded-xl font-medium transition-all duration-300 hover:shadow-md"
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