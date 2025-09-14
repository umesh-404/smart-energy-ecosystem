import React, { useState } from 'react';
import { 
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';
import OracleStatus from '../components/OracleStatus';

const OutageCompensation = () => {
  const [selectedOutage, setSelectedOutage] = useState(null);
  const [showClaimModal, setShowClaimModal] = useState(false);

  const outages = [
    {
      id: 1,
      date: '2025-01-10',
      location: 'Mumbai, Maharashtra',
      duration: '4 hours 30 minutes',
      affectedUsers: 1250,
      tokensCompensated: 2.5,
      status: 'resolved',
      description: 'Power outage due to transformer failure in Bandra area',
      compensationRate: 2, // tokens per hour
      totalCompensation: 3125
    },
    {
      id: 2,
      date: '2025-01-08',
      location: 'Delhi, NCR',
      duration: '2 hours 15 minutes',
      affectedUsers: 890,
      tokensCompensated: 2.0,
      status: 'resolved',
      description: 'Scheduled maintenance causing temporary power cut',
      compensationRate: 2,
      totalCompensation: 1780
    },
    {
      id: 3,
      date: '2025-01-05',
      location: 'Bangalore, Karnataka',
      duration: '6 hours 45 minutes',
      affectedUsers: 2100,
      tokensCompensated: 2.0,
      status: 'resolved',
      description: 'Severe weather conditions causing grid instability',
      compensationRate: 2,
      totalCompensation: 4200
    },
    {
      id: 4,
      date: '2025-01-12',
      location: 'Chennai, Tamil Nadu',
      duration: '3 hours 20 minutes',
      affectedUsers: 1560,
      tokensCompensated: 2.0,
      status: 'pending',
      description: 'Equipment malfunction at substation',
      compensationRate: 2,
      totalCompensation: 3120
    }
  ];

  const userCompensations = [
    {
      outageId: 1,
      date: '2025-01-10',
      location: 'Mumbai, Maharashtra',
      duration: '4 hours 30 minutes',
      amount: 9.0, // 4.5 hours * 2 tokens/hour
      claimed: true,
      claimDate: '2025-01-11'
    },
    {
      outageId: 2,
      date: '2025-01-08',
      location: 'Delhi, NCR',
      duration: '2 hours 15 minutes',
      amount: 4.5, // 2.25 hours * 2 tokens/hour
      claimed: true,
      claimDate: '2025-01-09'
    },
    {
      outageId: 4,
      date: '2025-01-12',
      location: 'Chennai, Tamil Nadu',
      duration: '3 hours 20 minutes',
      amount: 6.7, // 3.33 hours * 2 tokens/hour
      claimed: false,
      claimDate: null
    }
  ];

  const handleClaimCompensation = (compensation) => {
    setSelectedOutage(compensation);
    setShowClaimModal(true);
  };

  const confirmClaim = () => {
    if (selectedOutage) {
      alert(`Compensation claimed! You received ${selectedOutage.amount} ET for the outage on ${selectedOutage.date}`);
      setShowClaimModal(false);
      setSelectedOutage(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'resolved': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'investigating': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'resolved': return <CheckCircleIcon className="h-5 w-5" />;
      case 'pending': return <ClockIcon className="h-5 w-5" />;
      case 'investigating': return <ExclamationTriangleIcon className="h-5 w-5" />;
      default: return <ClockIcon className="h-5 w-5" />;
    }
  };

  const OutageCard = ({ outage }) => (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Outage #{outage.id}
          </h3>
          <div className="flex items-center text-gray-600 mb-2">
            <MapPinIcon className="h-4 w-4 mr-1" />
            <span className="text-sm">{outage.location}</span>
          </div>
        </div>
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(outage.status)}`}>
          {getStatusIcon(outage.status)}
          <span className="ml-1">{outage.status.toUpperCase()}</span>
        </span>
      </div>

      <p className="text-gray-600 mb-4">{outage.description}</p>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-500">Date</p>
          <p className="text-sm font-medium text-gray-900">{new Date(outage.date).toLocaleDateString()}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Duration</p>
          <p className="text-sm font-medium text-gray-900">{outage.duration}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Affected Users</p>
          <p className="text-sm font-medium text-gray-900">{outage.affectedUsers.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Total Compensation</p>
          <p className="text-sm font-medium text-green-600">{outage.totalCompensation.toLocaleString()} ET</p>
        </div>
      </div>
    </div>
  );

  const CompensationCard = ({ compensation }) => (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Outage #{compensation.outageId}
          </h3>
          <div className="flex items-center text-gray-600 mb-2">
            <MapPinIcon className="h-4 w-4 mr-1" />
            <span className="text-sm">{compensation.location}</span>
          </div>
        </div>
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          compensation.claimed ? 'text-green-600 bg-green-100' : 'text-yellow-600 bg-yellow-100'
        }`}>
          {compensation.claimed ? <CheckCircleIcon className="h-4 w-4 mr-1" /> : <ClockIcon className="h-4 w-4 mr-1" />}
          {compensation.claimed ? 'CLAIMED' : 'PENDING'}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-500">Date</p>
          <p className="text-sm font-medium text-gray-900">{new Date(compensation.date).toLocaleDateString()}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Duration</p>
          <p className="text-sm font-medium text-gray-900">{compensation.duration}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Compensation Amount</p>
          <p className="text-lg font-semibold text-green-600">{compensation.amount} ET</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Claim Date</p>
          <p className="text-sm font-medium text-gray-900">
            {compensation.claimDate ? new Date(compensation.claimDate).toLocaleDateString() : 'Not claimed'}
          </p>
        </div>
      </div>

      {!compensation.claimed && (
        <button
          onClick={() => handleClaimCompensation(compensation)}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
        >
          Claim Compensation
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Outage Compensation</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Track power outages and claim automatic compensation for service disruptions</p>
        </div>

        {/* Oracle Status */}
        <div className="px-4 py-6 sm:px-0">
          <OracleStatus />
        </div>

        {/* Stats */}
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <ExclamationTriangleIcon className="h-8 w-8 text-red-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Total Outages</p>
                  <p className="text-2xl font-bold text-gray-900">{outages.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <UserGroupIcon className="h-8 w-8 text-blue-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Total Affected</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {outages.reduce((sum, outage) => sum + outage.affectedUsers, 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <CurrencyDollarIcon className="h-8 w-8 text-green-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Total Compensation</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {outages.reduce((sum, outage) => sum + outage.totalCompensation, 0).toLocaleString()} ET
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <CheckCircleIcon className="h-8 w-8 text-purple-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Resolved Outages</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {outages.filter(outage => outage.status === 'resolved').length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Your Compensations */}
        <div className="px-4 py-6 sm:px-0">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Compensations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userCompensations.map((compensation, index) => (
              <CompensationCard key={index} compensation={compensation} />
            ))}
          </div>
        </div>

        {/* All Outages */}
        <div className="px-4 py-6 sm:px-0">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">All Outage Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {outages.map((outage) => (
              <OutageCard key={outage.id} outage={outage} />
            ))}
          </div>
        </div>

        {/* Claim Modal */}
        {showClaimModal && selectedOutage && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Claim Compensation</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Outage Date:</p>
                    <p className="font-medium">{new Date(selectedOutage.date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Location:</p>
                    <p className="font-medium">{selectedOutage.location}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Duration:</p>
                    <p className="font-medium">{selectedOutage.duration}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Compensation Amount:</p>
                    <p className="text-xl font-bold text-green-600">{selectedOutage.amount} ET</p>
                  </div>
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={() => setShowClaimModal(false)}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmClaim}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Claim Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OutageCompensation;