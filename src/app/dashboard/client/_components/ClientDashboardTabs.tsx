import React from 'react';

interface ClientDashboardTabsProps {
  activeTab: 'jobs' | 'bids' | 'hired' | 'payments' | 'ratings';
  setActiveTab: (tab: 'jobs' | 'bids' | 'hired' | 'payments' | 'ratings') => void;
}

const ClientDashboardTabs: React.FC<ClientDashboardTabsProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'jobs', label: 'My Posted Jobs' },
    { id: 'bids', label: 'Bids Received' },
    { id: 'hired', label: 'Hired Freelancers' },
    { id: 'payments', label: 'Payment History' },
    { id: 'ratings', label: 'My Ratings' },
  ];

  return (
    <div className="border-b border-gray-200 mb-6">
      <nav className="-mb-px flex space-x-8" aria-label="Tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)} 
            className={`${
              activeTab === tab.id
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm focus:outline-none transition-colors duration-200`}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default ClientDashboardTabs;