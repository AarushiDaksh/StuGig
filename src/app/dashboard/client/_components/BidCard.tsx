import React from 'react';
import { Bid } from '@/types/clientDashboard';

interface BidCardProps {
  bid: Bid;
}

const BidCard: React.FC<BidCardProps> = ({ bid }) => {
  const statusColor = (status: Bid['status']) => {
    switch (status) {
      case 'pending': return 'text-yellow-600';
      case 'accepted': return 'text-green-600';
      case 'rejected': return 'text-red-500';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">Bid for: <span className="text-indigo-600">Job ID: {bid.jobId}</span></h3>
      <p className="text-gray-700 text-base mb-2">By: <span className="font-medium">{bid.freelancerName || 'N/A'}</span></p>
      <p className="text-gray-600 text-sm mb-3 line-clamp-2">Proposal: {bid.proposal}</p>
      <div className="flex flex-col gap-1 text-sm text-gray-700 mb-4">
        <span>Quote: <span className="font-medium">${bid.quote.toLocaleString()}</span></span>
        <span>Est. Delivery: <span className="font-medium">{bid.estimatedDelivery}</span></span>
        <span>Status: <span className={`font-semibold ${statusColor(bid.status)}`}>{bid.status.charAt(0).toUpperCase() + bid.status.slice(1)}</span></span>
      </div>
      <div className="flex justify-end space-x-2">
        {bid.status === 'pending' && (
          <>
            <button className="px-3 py-1 text-sm font-medium text-green-700 bg-green-100 rounded-md hover:bg-green-200 transition-colors">
              Accept
            </button>
            <button className="px-3 py-1 text-sm font-medium text-red-700 bg-red-100 rounded-md hover:bg-red-200 transition-colors">
              Reject
            </button>
          </>
        )}
        <button className="px-3 py-1 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors">
          View Profile
        </button>
      </div>
    </div>
  );
};

export default BidCard;