import React from 'react';
import { HiredFreelancer } from '@/types/clientDashboard';

interface HiredFreelancerCardProps {
  hired: HiredFreelancer;
}

const HiredFreelancerCard: React.FC<HiredFreelancerCardProps> = ({ hired }) => {
  const statusColor = (status: HiredFreelancer['status']) => {
    switch (status) {
      case 'in-progress': return 'text-blue-500';
      case 'completed': return 'text-green-600';
      case 'cancelled': return 'text-red-500';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">Job: <span className="text-indigo-600">{hired.jobTitle || `ID: ${hired.jobId}`}</span></h3>
      <p className="text-gray-700 text-base mb-2">Freelancer: <span className="font-medium">{hired.freelancerName || 'N/A'}</span></p>
      <div className="flex flex-col gap-1 text-sm text-gray-700 mb-4">
        <span>Hired On: <span className="font-medium">{new Date(hired.hiredDate).toLocaleDateString()}</span></span>
        <span>Status: <span className={`font-semibold ${statusColor(hired.status)}`}>{hired.status.charAt(0).toUpperCase() + hired.status.slice(1)}</span></span>
      </div>
      <div className="flex justify-end space-x-2">
        {hired.status === 'in-progress' && (
          <button className="px-3 py-1 text-sm font-medium text-green-700 bg-green-100 rounded-md hover:bg-green-200 transition-colors">
            Mark as Complete
          </button>
        )}
        <button className="px-3 py-1 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors">
          View Chat
        </button>
      </div>
    </div>
  );
};

export default HiredFreelancerCard;