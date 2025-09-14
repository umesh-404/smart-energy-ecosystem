import React, { useState } from 'react';
import { 
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  UserGroupIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { useTheme } from '../contexts/ThemeContext';

const MilestoneTracker = ({ project }) => {
  const { isDarkMode } = useTheme();
  const [selectedMilestone, setSelectedMilestone] = useState(null);

  const milestones = project.milestones || [
    {
      id: 1,
      title: 'Initial Funding',
      description: 'Raise 25% of total project cost',
      targetAmount: 5000,
      currentAmount: 5000,
      status: 'completed',
      deadline: '2025-01-15',
      contributors: 45
    },
    {
      id: 2,
      title: 'Equipment Procurement',
      description: 'Purchase solar panels and inverters',
      targetAmount: 8000,
      currentAmount: 6500,
      status: 'in-progress',
      deadline: '2025-02-15',
      contributors: 78
    },
    {
      id: 3,
      title: 'Installation Phase',
      description: 'Install solar infrastructure',
      targetAmount: 6000,
      currentAmount: 0,
      status: 'pending',
      deadline: '2025-03-15',
      contributors: 0
    },
    {
      id: 4,
      title: 'Grid Connection',
      description: 'Connect to local power grid',
      targetAmount: 3000,
      currentAmount: 0,
      status: 'pending',
      deadline: '2025-04-15',
      contributors: 0
    }
  ];

  const getMilestoneIcon = (status) => {
    const safeStatus = status || 'pending';
    switch (safeStatus) {
      case 'completed':
        return <CheckCircleIcon className="h-6 w-6 text-green-500" />;
      case 'in-progress':
        return <ClockIcon className="h-6 w-6 text-blue-500" />;
      case 'pending':
        return <ClockIcon className="h-6 w-6 text-gray-400" />;
      case 'failed':
        return <ExclamationTriangleIcon className="h-6 w-6 text-red-500" />;
      default:
        return <ClockIcon className="h-6 w-6 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    const safeStatus = status || 'pending';
    switch (safeStatus) {
      case 'completed':
        return 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300';
      case 'in-progress':
        return 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300';
      case 'pending':
        return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300';
      case 'failed':
        return 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300';
    }
  };

  const MilestoneCard = ({ milestone, index }) => (
    <div 
      className={`p-4 rounded-lg border transition-all duration-200 cursor-pointer ${
        selectedMilestone?.id === milestone.id
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/10'
          : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
      }`}
      onClick={() => setSelectedMilestone(milestone)}
    >
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          {getMilestoneIcon(milestone.status)}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100">
              {milestone.title}
            </h4>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(milestone.status)}`}>
              {(milestone.status || 'pending').replace('-', ' ').toUpperCase()}
            </span>
          </div>
          
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            {milestone.description}
          </p>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Progress:</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {(milestone.currentAmount || 0).toLocaleString()} / {(milestone.targetAmount || 0).toLocaleString()} ETH
              </span>
            </div>
            
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${
                  (milestone.status || 'pending') === 'completed' ? 'bg-green-500' :
                  (milestone.status || 'pending') === 'in-progress' ? 'bg-blue-500' : 'bg-gray-400'
                }`}
                style={{ width: `${Math.min(((milestone.currentAmount || 0) / (milestone.targetAmount || 1)) * 100, 100)}%` }}
              />
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center text-gray-500 dark:text-gray-400">
                <CalendarIcon className="h-4 w-4 mr-1" />
                Due: {milestone.deadline ? new Date(milestone.deadline).toLocaleDateString() : 'TBD'}
              </div>
              <div className="flex items-center text-gray-500 dark:text-gray-400">
                <UserGroupIcon className="h-4 w-4 mr-1" />
                {milestone.contributors || 0} contributors
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const MilestoneDetail = ({ milestone }) => (
    <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <h5 className="font-medium text-gray-900 dark:text-gray-100 mb-3">
        Milestone Details
      </h5>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-gray-500 dark:text-gray-400">Target Amount:</span>
          <div className="font-medium text-gray-900 dark:text-gray-100">
            {(milestone.targetAmount || 0).toLocaleString()} ETH
          </div>
        </div>
        <div>
          <span className="text-gray-500 dark:text-gray-400">Current Amount:</span>
          <div className="font-medium text-gray-900 dark:text-gray-100">
            {(milestone.currentAmount || 0).toLocaleString()} ETH
          </div>
        </div>
        <div>
          <span className="text-gray-500 dark:text-gray-400">Deadline:</span>
          <div className="font-medium text-gray-900 dark:text-gray-100">
            {milestone.deadline ? new Date(milestone.deadline).toLocaleDateString() : 'TBD'}
          </div>
        </div>
        <div>
          <span className="text-gray-500 dark:text-gray-400">Contributors:</span>
          <div className="font-medium text-gray-900 dark:text-gray-100">
            {milestone.contributors || 0}
          </div>
        </div>
      </div>
    </div>
  );

  const completedMilestones = milestones.filter(m => (m.status || 'pending') === 'completed').length;
  const totalMilestones = milestones.length;
  const overallProgress = (completedMilestones / totalMilestones) * 100;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100">
            Project Milestones
          </h3>
          <div className="text-right">
            <div className="text-sm text-gray-500 dark:text-gray-400">Overall Progress</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {overallProgress.toFixed(0)}%
            </div>
          </div>
        </div>
        
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-6">
          <div 
            className="h-3 bg-gradient-to-r from-blue-500 to-green-500 rounded-full transition-all duration-300"
            style={{ width: `${overallProgress}%` }}
          />
        </div>
        
        <div className="space-y-4">
          {milestones.map((milestone, index) => (
            <div key={milestone.id || `milestone-${index}`}>
              <MilestoneCard milestone={milestone} index={index} />
              {selectedMilestone?.id === milestone.id && (
                <MilestoneDetail milestone={milestone} />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MilestoneTracker;