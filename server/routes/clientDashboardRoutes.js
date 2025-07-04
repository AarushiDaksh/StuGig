const express = require('express');
const router = express.Router();

const Job = require('../models/Job'); 
const Bid = require('../models/Bid'); 
const Hired = require('../models/Hired'); 
const Payment = require('../models/Payment'); 
const Review = require('../models/Review'); 


const authMiddleware = (req, res, next) => {
 
  req.user = { id: 'YOUR_CLIENT_USER_ID' }; 
  if (!req.user || !req.user.id) {
    return res.status(401).json({ message: 'Authentication required. Client ID not found.' });
  }
  next();
};

router.get('/client/jobs', authMiddleware, async (req, res) => {
  try {
    const clientId = req.user.id;
    
    const postedJobs = await Job.find({ clientId: clientId }).sort({ createdAt: -1 });
    res.json(postedJobs);
  } catch (error) {
    console.error("Backend Error: Failed to fetch client's posted jobs:", error);
    res.status(500).json({ message: "Failed to fetch posted jobs", error: error.message });
  }
});


router.get('/client/bids-received', authMiddleware, async (req, res) => {
  try {
    const clientId = req.user.id;
    // First, find all jobs posted by this client
    const clientJobs = await Job.find({ clientId: clientId }).select('_id');
    const jobIds = clientJobs.map(job => job._id);

    // Then, find bids where the jobId is one of the client's job IDs
    const bidsReceived = await Bid.find({ jobId: { $in: jobIds } })
                                  .populate('freelancerId', 'username email profilePic')
                                  .sort({ createdAt: -1 });

    
    const formattedBids = bidsReceived.map(bid => ({
      ...bid.toObject(),
      freelancerName: bid.freelancerId ? bid.freelancerId.username : 'N/A',
      freelancerProfilePic: bid.freelancerId ? bid.freelancerId.profilePic : undefined,
    }));

    res.json(formattedBids);
  } catch (error) {
    console.error("Backend Error: Failed to fetch bids received:", error);
    res.status(500).json({ message: "Failed to fetch bids received", error: error.message });
  }
});


router.get('/client/hired-freelancers', authMiddleware, async (req, res) => {
  try {
    const clientId = req.user.id;
   
    const clientJobs = await Job.find({ clientId: clientId }).select('_id title');
    const jobMap = new Map(clientJobs.map(job => [job._id.toString(), job.title]));

    
    const hiredFreelancers = await Hired.find({ jobId: { $in: Array.from(jobMap.keys()) } })
                                       .populate('freelancerId', 'username profilePic')
                                       .sort({ hiredDate: -1 });

    
    const formattedHired = hiredFreelancers.map(hired => ({
      _id: hired._id,
      jobId: hired.jobId,
      jobTitle: jobMap.get(hired.jobId.toString()) || 'Unknown Job',
      freelancerId: hired.freelancerId ? hired.freelancerId._id : undefined,
      freelancerName: hired.freelancerId ? hired.freelancerId.username : 'N/A',
      freelancerProfilePic: hired.freelancerId ? hired.freelancerId.profilePic : undefined,
      hiredDate: hired.hiredDate,
      status: hired.status,
    }));

    res.json(formattedHired);
  } catch (error) {
    console.error("Backend Error: Failed to fetch hired freelancers:", error);
    res.status(500).json({ message: "Failed to fetch hired freelancers", error: error.message });
  }
});


router.get('/client/payment-history', authMiddleware, async (req, res) => {
  try {
    const clientId = req.user.id;
    
    const paymentHistory = await Payment.find({ payerId: clientId })
                                        .populate('jobId', 'title') 
                                        .sort({ transactionDate: -1 });

    const formattedPayments = paymentHistory.map(payment => ({
      _id: payment._id,
      jobId: payment.jobId._id,
      jobTitle: payment.jobId ? payment.jobId.title : 'Unknown Job',
      amount: payment.amount,
      commission: payment.commission || 0, 
      netAmountToFreelancer: payment.netAmountToFreelancer,
      transactionDate: payment.transactionDate,
      status: payment.status,
      stripeChargeId: payment.stripeChargeId,
    }));

    res.json(formattedPayments);
  } catch (error) {
    console.error("Backend Error: Failed to fetch payment history:", error);
    res.status(500).json({ message: "Failed to fetch payment history", error: error.message });
  }
});


router.get('/client/given-ratings', authMiddleware, async (req, res) => {
  try {
    const clientId = req.user.id;
    
    const givenRatings = await Review.find({ reviewerId: clientId })
                                     .populate('jobId', 'title') 
                                     .populate('revieweeId', 'username') 
                                     .sort({ createdAt: -1 });

    const formattedRatings = givenRatings.map(rating => ({
      _id: rating._id,
      jobId: rating.jobId._id,
      jobTitle: rating.jobId ? rating.jobId.title : 'Unknown Job',
      reviewerId: rating.reviewerId,
      revieweeId: rating.revieweeId ? rating.revieweeId._id : undefined,
      revieweeName: rating.revieweeId ? rating.revieweeId.username : 'N/A',
      rating: rating.rating,
      feedback: rating.feedback,
      createdAt: rating.createdAt,
    }));

    res.json(formattedRatings);
  } catch (error) {
    console.error("Backend Error: Failed to fetch given ratings:", error);
    res.status(500).json({ message: "Failed to fetch given ratings", error: error.message });
  }
});

module.exports = router;