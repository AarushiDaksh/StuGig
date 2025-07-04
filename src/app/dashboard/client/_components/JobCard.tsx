import React from 'react';
import { Job } from '@/types/clientDashboard';

interface JobCardProps {
  job: Job;
}

const JobCard: React.FC<JobCardProps> = ({ job }) => {
  const statusColor = (status: Job['status']) => {
    switch (status) {
      case 'open': return 'text-blue-500';
      case 'hired': return 'text-yellow-600';
      case 'completed': return 'text-green-600';
      case 'cancelled': return 'text-red-500';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-200">
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{job.title}</h3>
      <p className="text-gray-600 mb-3 line-clamp-2 text-sm">{job.description}</p>
      <div className="flex flex-col gap-1 text-sm text-gray-700 mb-4">
        <span>Budget: <span className="font-medium">${job.budget.toLocaleString()}</span></span>
        <span>Deadline: <span className="font-medium">{new Date(job.deadline).toLocaleDateString()}</span></span>
        <span>Category: <span className="font-medium">{job.category}</span></span>
        <span>Status: <span className={`font-semibold ${statusColor(job.status)}`}>{job.status.charAt(0).toUpperCase() + job.status.slice(1)}</span></span>
      </div>
      <div className="flex justify-end space-x-2">
        <button className="px-3 py-1 text-sm font-medium text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200 transition-colors">
          View Bids ({ 0})
        </button>
        <button className="px-3 py-1 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors">
          Edit
        </button>
      </div>
    </div>
  );
};

export default JobCard;