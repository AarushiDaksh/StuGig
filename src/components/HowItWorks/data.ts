import { Step } from './types';

export const clientSteps: Step[] = [
  {
    id: 1,
    title: "Post a Job",
    subtitle:
      "Need help with a logo, assignment, or landing page? Start by posting your freelance job.",
    description: [
      "Select a category like Design, Writing, or Tech",
      "Describe your project with budget and deadline",
      "Receive bids from qualified student freelancers"
    ],
    image: "/icons/post-job.svg",
    imageAlt: "Posting job illustration",
  },
  {
    id: 2,
    title: "Get Matched with Freelancers",
    subtitle:
      "StuGig uses AI to connect you with the best-matched student freelancers based on skills and reviews.",
    description: [
      "Review proposals with quotes & delivery time",
      "Chat in real-time to negotiate terms",
      "Hire your preferred freelancer securely"
    ],
    image: "/icons/get-matched.svg",
    imageAlt: "Matching freelancers illustration",
  },
  {
    id: 3,
    title: "Pay & Review",
    subtitle:
      "Track job progress, make secure payments, and leave feedback after completion.",
    description: [
      "Payments held securely until delivery",
      "Leave ratings for communication and quality",
      "Build your trusted client history"
    ],
    image: "/icons/pay-review.svg",
    imageAlt: "Secure payment and review illustration",
  },
];

export const freelancerSteps: Step[] = [
  {
    id: 1,
    title: "Set Up Your Profile",
    subtitle:
      "Showcase your skills, add a portfolio, and set your availability.",
    description: [
      "Choose categories you're confident in",
      "Upload examples or certifications",
      "Enable notifications for job alerts"
    ],
    image: "/icons/setup-profile.svg",
    imageAlt: "Freelancer profile setup illustration",
  },
  {
    id: 2,
    title: "Browse & Apply to Jobs",
    subtitle:
      "View jobs that match your skills and submit tailored proposals.",
    description: [
      "Filter by category, budget, or deadline",
      "Craft persuasive proposals with pricing",
      "Engage with clients via chat"
    ],
    image: "/icons/browse-jobs.svg",
    imageAlt: "Browsing jobs illustration",
  },
  {
    id: 3,
    title: "Deliver Work & Earn",
    subtitle:
      "Complete projects, get paid securely, and grow your reputation.",
    description: [
      "Submit work via the dashboard",
      "Get paid once the client approves",
      "Receive ratings and repeat opportunities"
    ],
    image: "/icons/deliver-earn.svg",
    imageAlt: "Earning as a freelancer illustration",
  },
];
