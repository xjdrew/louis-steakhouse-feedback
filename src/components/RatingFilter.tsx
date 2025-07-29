"use client";

interface RatingFilterProps {
  currentRating: string;
  onRatingChange: (rating: string) => void;
}

export default function RatingFilter({
  currentRating,
  onRatingChange,
}: RatingFilterProps) {
  const ratings = [
    { value: "all", label: "All Ratings" },
    { value: "5", label: "5 Stars" },
    { value: "4", label: "4 Stars" },
    { value: "3", label: "3 Stars" },
    { value: "2", label: "2 Stars" },
    { value: "1", label: "1 Star" },
  ];

  return (
    <div className="mb-6">
      <label htmlFor="rating-filter" className="block text-sm font-medium text-gray-700 mb-2">
        Filter by Rating
      </label>
      <select
        id="rating-filter"
        value={currentRating}
        onChange={(e) => onRatingChange(e.target.value)}
        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
      >
        {ratings.map((rating) => (
          <option key={rating.value} value={rating.value}>
            {rating.label}
          </option>
        ))}
      </select>
    </div>
  );
}