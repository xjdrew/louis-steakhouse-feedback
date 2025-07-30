import Link from "next/link";
import { useState } from "react";

interface CommentCardProps {
  feedbackId: string;
  name: string | null;
  rating: number;
  content: string;
  diningTime: string | null;
  createdAt: string;
  likes: number;
  dislikes: number;
  isDetailView?: boolean;
}

export default function CommentCard({
  feedbackId,
  name,
  rating,
  content,
  diningTime,
  createdAt,
  likes: initialLikes,
  dislikes: initialDislikes,
  isDetailView = false,
}: CommentCardProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [dislikes, setDislikes] = useState(initialDislikes);
  const [isLiking, setIsLiking] = useState(false);
  const [isDisliking, setIsDisliking] = useState(false);

  const handleLike = async () => {
    if (isLiking) return;
    
    setIsLiking(true);
    try {
      const response = await fetch(`/api/feedback/${feedbackId}/like`, {
        method: 'POST',
      });
      
      if (response.ok) {
        const data = await response.json() as { likes: number; dislikes: number };
        setLikes(data.likes);
        setDislikes(data.dislikes);
      }
    } catch (error) {
      console.error('Failed to like:', error);
    } finally {
      setIsLiking(false);
    }
  };

  const handleDislike = async () => {
    if (isDisliking) return;
    
    setIsDisliking(true);
    try {
      const response = await fetch(`/api/feedback/${feedbackId}/dislike`, {
        method: 'POST',
      });
      
      if (response.ok) {
        const data = await response.json() as { likes: number; dislikes: number };
        setLikes(data.likes);
        setDislikes(data.dislikes);
      }
    } catch (error) {
      console.error('Failed to dislike:', error);
    } finally {
      setIsDisliking(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDiningTime = (dateString: string | null) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-5 h-5 ${
              star <= rating ? "text-yellow-400" : "text-gray-300"
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-200">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
            <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
              {name || "Anonymous"}
            </h3>
            <div className="flex items-center">
              {renderStars(rating)}
            </div>
          </div>
          
          {diningTime && (
            <p className="text-xs sm:text-sm text-gray-500 mb-2">
              Dined on {formatDiningTime(diningTime)}
            </p>
          )}
        </div>
        
        <span className="text-xs text-gray-400 self-start sm:self-auto whitespace-nowrap">
          {formatDate(createdAt)}
        </span>
      </div>

      <p className={`text-gray-700 text-sm sm:text-base mb-4 ${isDetailView ? '' : 'line-clamp-3'}`}>{content}</p>

      {/* Like/Dislike Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-4 pt-4 border-t border-gray-100 gap-3 sm:gap-0">
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={handleLike}
            disabled={isLiking}
            className={`flex items-center gap-1 px-3 py-2 sm:py-1 rounded-full text-sm transition-colors touch-manipulation ${
              isLiking
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-green-50 text-green-700 hover:bg-green-100 active:bg-green-200"
            }`}
          >
            <svg
              className="w-4 h-4"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
            </svg>
            <span className="font-medium">{likes}</span>
          </button>
          
          <button
            onClick={handleDislike}
            disabled={isDisliking}
            className={`flex items-center gap-1 px-3 py-2 sm:py-1 rounded-full text-sm transition-colors touch-manipulation ${
              isDisliking
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-red-50 text-red-700 hover:bg-red-100 active:bg-red-200"
            }`}
          >
            <svg
              className="w-4 h-4 transform rotate-180"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
            </svg>
            <span className="font-medium">{dislikes}</span>
          </button>
        </div>

        {!isDetailView && (
          <Link
            href={`/feedback/${feedbackId}`}
            className="inline-flex items-center justify-center sm:justify-start text-blue-600 hover:text-blue-800 active:text-blue-900 text-sm font-medium py-2 px-3 sm:px-0 rounded-md sm:rounded-none hover:bg-blue-50 sm:hover:bg-transparent transition-colors touch-manipulation"
          >
            Read more
            <svg
              className="w-4 h-4 ml-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        )}
      </div>
    </div>
  );
}