// src/app/dashboard/client/_components/GivenRatingsDisplay.tsx
import React from 'react';
import { Review } from '@/types/clientDashboard';
import { StarIcon } from '@heroicons/react/20/solid'; 

interface GivenRatingsDisplayProps {
  rating: Review;
}

const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => (
        <StarIcon
          key={i}
          className={`h-5 w-5 ${
            rating > i ? 'text-yellow-400' : 'text-gray-300'
          }`}
          aria-hidden="true"
        />
      ))}
    </div>
  );
};

const GivenRatingsDisplay: React.FC<GivenRatingsDisplayProps> = ({ rating }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">For Job: <span className="text-indigo-600">{rating.jobTitle || `ID: ${rating.jobId}`}</span></h3>
      <p className="text-gray-700 text-base mb-2">To Freelancer: <span className="font-medium">{rating.revieweeName || 'N/A'}</span></p>
      <div className="mb-3">
        <StarRating rating={rating.rating} />
      </div>
      <p className="text-gray-600 text-sm italic mb-3">"{rating.feedback}"</p>
      <div className="text-right text-xs text-gray-500">
        Reviewed on: {new Date(rating.createdAt).toLocaleDateString()}
      </div>
    </div>
  );
};

export default GivenRatingsDisplay;