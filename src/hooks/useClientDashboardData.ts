'use client'; 

import { useState, useEffect } from 'react';
import axiosInstance from '@/lib/axiosInstance';
import { ClientDashboardData, Job, Bid, HiredFreelancer, PaymentTransaction, Review } from '@/types/clientDashboard';
import axios from 'axios'; 

const useClientDashboardData = () => {
  const [data, setData] = useState<ClientDashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [
          jobsRes,
          bidsRes,
          hiredRes,
          paymentsRes,
          ratingsRes,
        ] = await Promise.all([
          axiosInstance.get<Job[]>('/client/jobs'), 
          axiosInstance.get<Bid[]>('/client/bids-received'), 
          axiosInstance.get<HiredFreelancer[]>('/client/hired-freelancers'), 
          axiosInstance.get<PaymentTransaction[]>('/client/payment-history'), 
          axiosInstance.get<Review[]>('/client/given-ratings'), 
        ]);

        setData({
          postedJobs: jobsRes.data,
          bidsReceived: bidsRes.data,
          hiredFreelancers: hiredRes.data,
          paymentHistory: paymentsRes.data,
          givenRatings: ratingsRes.data,
        });
      } catch (err) {
        if (axios.isAxiosError(err)) {
          
          setError(err.response?.data?.message || err.message || 'Failed to fetch dashboard data.');
        } else {
          setError('An unexpected error occurred while fetching dashboard data.');
        }
        console.error("Error fetching client dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []); 

  return { data, loading, error };
};

export default useClientDashboardData;