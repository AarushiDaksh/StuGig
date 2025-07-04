export interface Job {
  _id: string;
  title: string;
  description: string;
  budget: number;
  deadline: string; 
  category: string;
  status: 'open' | 'hired' | 'completed' | 'cancelled';
  files?: string[]; 
  createdAt: string; 
}

export interface Bid {
  _id: string;
  jobId: string;
  freelancerId: string;
  freelancerName: string; 
  freelancerProfilePic?: string; 
  proposal: string;
  quote: number;
  estimatedDelivery: string; 
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string; 
}

export interface HiredFreelancer {
  _id: string; 
  jobId: string;
  jobTitle: string; 
  freelancerId: string;
  freelancerName: string;
  freelancerProfilePic?: string; 
  hiredDate: string; 
  status: 'in-progress' | 'completed' | 'cancelled'; 
  
}

export interface PaymentTransaction {
  _id: string;
  jobId: string;
  jobTitle: string; 
  amount: number; 
  commission: number; 
  netAmountToFreelancer?: number; 
  transactionDate: string; 
  status: 'pending' | 'completed' | 'refunded';
  stripeChargeId?: string; 
}

export interface Review {
  _id: string;
  jobId: string;
  jobTitle: string; 
  reviewerId: string; 
  revieweeId: string; 
  revieweeName: string; 
  rating: number; 
  feedback: string;
  createdAt: string; 
}


export interface ClientDashboardData {
  postedJobs: Job[];
  bidsReceived: Bid[];
  hiredFreelancers: HiredFreelancer[];
  paymentHistory: PaymentTransaction[];
  givenRatings: Review[];
}