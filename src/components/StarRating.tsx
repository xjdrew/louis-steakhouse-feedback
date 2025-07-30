"use client";

import { useState } from "react";

interface StarRatingProps {
  rating: number;
  onRatingChange: (rating: number) => void;
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
}

export default function StarRating({ 
  rating, 
  onRatingChange, 
  size = "md",
  disabled = false 
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);

  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6", 
    lg: "w-8 h-8"
  };

  const handleClick = (newRating: number) => {
    if (!disabled) {
      onRatingChange(newRating);
    }
  };

  const handleMouseEnter = (newRating: number) => {
    if (!disabled) {
      setHoverRating(newRating);
    }
  };

  const handleMouseLeave = () => {
    if (!disabled) {
      setHoverRating(0);
    }
  };

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const isActive = star <= (hoverRating || rating);
        return (
          <button
            key={star}
            type="button"
            onClick={() => handleClick(star)}
            onMouseEnter={() => handleMouseEnter(star)}
            onMouseLeave={handleMouseLeave}
            disabled={disabled}
            className={`transition-all duration-150 touch-manipulation ${
              disabled 
                ? "cursor-default" 
                : "cursor-pointer hover:scale-110 active:scale-125 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 rounded p-1 -m-1"
            }`}
            aria-label={`Rate ${star} out of 5 stars`}
          >
            <svg
              className={`${sizeClasses[size]} transition-colors duration-150 ${
                isActive
                  ? "text-yellow-400"
                  : disabled
                  ? "text-gray-300"
                  : "text-gray-300 hover:text-yellow-300"
              }`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </button>
        );
      })}
      <span className="ml-2 text-sm text-gray-600">
        {rating} / 5
      </span>
    </div>
  );
}