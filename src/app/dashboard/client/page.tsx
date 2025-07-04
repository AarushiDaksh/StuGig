// src/app/dashboard/client/page.tsx
'use client'; // This is a Client Component

import { useState } from 'react';
import useClientDashboardData from '@/hooks/useClientDashboardData'; 
import LoadingSpinner from '@/components/LoadingSpinner'; 
import ClientDashboardTabs from './_components/ClientDashboardTabs';
import JobCard from './_components/JobCard';
import BidCard from './_components/BidCard';
import HiredFreelancerCard from './_components/HiredFreelancerCard';
import PaymentHistoryTable from './_components/PaymentHistoryTable';
import GivenRatingsDisplay from './_components/GivenRatingsDisplay';
import { Job, Bid, HiredFreelancer, PaymentTransaction, Review } from '@/types/clientDashboard'; 

type Tab = 'jobs' | 'bids' | 'hired' | 'payments' | 'ratings';

export default function ClientDashboardPage() {
  const { data, loading, error } = useClientDashboardData();
  const [activeTab, setActiveTab] = useState<Tab>('jobs'); 

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center py-8 text-lg font-semibold">Error: {error}</div>;
  }

  
  if (!data) {
    return <div className="text-center py-8 text-gray-600">No dashboard data available.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-8">Your Client Dashboard</h1>

      <ClientDashboardTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="mt-8 bg-white p-6 rounded-lg shadow-xl">
        {activeTab === 'jobs' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Posted Jobs</h2>
            {data.postedJobs.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.postedJobs.map((job) => (
                  <JobCard key={job._id} job={job} />
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-center py-4">
                You haven't posted any jobs yet. <a href="/jobs/new" className="text-indigo-600 hover:underline font-medium">Post a new job now!</a>
              </p>
            )}
          </div>
        )}

        {activeTab === 'bids' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Bids Received</h2>
            {data.bidsReceived.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.bidsReceived.map((bid) => (
                  <BidCard key={bid._id} bid={bid} />
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-center py-4">
                No bids have been received for your jobs yet.
              </p>
            )}
          </div>
        )}

        {activeTab === 'hired' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Hired Freelancers</h2>
            {data.hiredFreelancers.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.hiredFreelancers.map((hired) => (
                  <HiredFreelancerCard key={hired._id} hired={hired} />
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-center py-4">
                You haven't hired any freelancers yet.
              </p>
            )}
          </div>
        )}

        {activeTab === 'payments' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Payment History</h2>
            {data.paymentHistory.length > 0 ? (
              <PaymentHistoryTable transactions={data.paymentHistory} />
            ) : (
              <p className="text-gray-600 text-center py-4">
                No payment history available.
              </p>
            )}
          </div>
        )}

        {activeTab === 'ratings' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Given Ratings</h2>
            {data.givenRatings.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.givenRatings.map((rating) => (
                  <GivenRatingsDisplay key={rating._id} rating={rating} />
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-center py-4">
                You haven't given any ratings yet.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}