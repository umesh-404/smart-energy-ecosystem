import React, { useState } from 'react';
import { 
  MapPinIcon,
  CurrencyDollarIcon,
  ClockIcon,
  UserGroupIcon,
  ChartBarIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import MilestoneTracker from '../components/MilestoneTracker';

const Crowdfunding = () => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [showInvestModal, setShowInvestModal] = useState(false);
  const [investmentAmount, setInvestmentAmount] = useState('');

  const projects = [
    {
      id: 1,
      name: 'Solar Microgrid - Rural Maharashtra',
      location: 'Maharashtra, India',
      description: 'Community solar project to provide clean energy to 500 rural households',
      requiredTokens: 10000,
      currentProgress: 65,
      investors: 127,
      expectedROI: 12.5,
      riskLevel: 'medium',
      deadline: '2025-03-15',
      milestones: [
        { name: 'Land Acquisition', completed: true, date: '2024-12-01' },
        { name: 'Equipment Procurement', completed: true, date: '2025-01-15' },
        { name: 'Installation Phase 1', completed: false, date: '2025-02-28' },
        { name: 'Grid Connection', completed: false, date: '2025-03-15' }
      ]
    },
    {
      id: 2,
      name: 'Wind Farm Expansion - Gujarat',
      location: 'Gujarat, India',
      description: 'Expansion of existing wind farm to increase capacity by 50MW',
      requiredTokens: 25000,
      currentProgress: 40,
      investors: 89,
      expectedROI: 15.2,
      riskLevel: 'low',
      deadline: '2025-04-30',
      milestones: [
        { name: 'Environmental Clearance', completed: true, date: '2024-11-15' },
        { name: 'Turbine Procurement', completed: false, date: '2025-02-15' },
        { name: 'Infrastructure Setup', completed: false, date: '2025-03-30' },
        { name: 'Commissioning', completed: false, date: '2025-04-30' }
      ]
    },
    {
      id: 3,
      name: 'Small Hydro Project - Himachal Pradesh',
      location: 'Himachal Pradesh, India',
      description: 'Small-scale hydroelectric project for mountain communities',
      requiredTokens: 15000,
      currentProgress: 25,
      investors: 45,
      expectedROI: 18.7,
      riskLevel: 'high',
      deadline: '2025-06-30',
      milestones: [
        { name: 'Feasibility Study', completed: true, date: '2024-10-30' },
        { name: 'Government Approvals', completed: false, date: '2025-01-31' },
        { name: 'Construction', completed: false, date: '2025-05-15' },
        { name: 'Testing & Commissioning', completed: false, date: '2025-06-30' }
      ]
    }
  ];

  const handleInvest = (project) => {
    setSelectedProject(project);
    setShowInvestModal(true);
  };

  const confirmInvestment = () => {
    if (investmentAmount && selectedProject) {
      alert(`Investment confirmed! You invested ${investmentAmount} ET in ${selectedProject.name}`);
      setShowInvestModal(false);
      setInvestmentAmount('');
      setSelectedProject(null);
    }
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const ProjectCard = ({ project }) => (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{project.name}</h3>
          <div className="flex items-center text-gray-600 mb-2">
            <MapPinIcon className="h-4 w-4 mr-1" />
            <span className="text-sm">{project.location}</span>
          </div>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(project.riskLevel)}`}>
          {project.riskLevel.toUpperCase()} RISK
        </span>
      </div>

      <p className="text-gray-600 mb-4">{project.description}</p>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-500">Required Tokens</p>
          <p className="text-lg font-semibold text-gray-900">{project.requiredTokens.toLocaleString()} ET</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Expected ROI</p>
          <p className="text-lg font-semibold text-green-600">{project.expectedROI}%</p>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-500">Progress</span>
          <span className="text-sm font-medium text-gray-900">{project.currentProgress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${project.currentProgress}%` }}
          ></div>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center text-gray-600">
          <UserGroupIcon className="h-4 w-4 mr-1" />
          <span className="text-sm">{project.investors} investors</span>
        </div>
        <div className="flex items-center text-gray-600">
          <ClockIcon className="h-4 w-4 mr-1" />
          <span className="text-sm">Due {new Date(project.deadline).toLocaleDateString()}</span>
        </div>
      </div>

      <button
        onClick={() => handleInvest(project)}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
      >
        Invest Now
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Microgrid Crowdfunding</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Invest in renewable energy projects and earn returns while supporting clean energy</p>
        </div>

        {/* Stats */}
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <ChartBarIcon className="h-8 w-8 text-blue-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Total Projects</p>
                  <p className="text-2xl font-bold text-gray-900">{projects.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <CurrencyDollarIcon className="h-8 w-8 text-green-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Total Raised</p>
                  <p className="text-2xl font-bold text-gray-900">32,500 ET</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <UserGroupIcon className="h-8 w-8 text-purple-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Total Investors</p>
                  <p className="text-2xl font-bold text-gray-900">261</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <SparklesIcon className="h-8 w-8 text-yellow-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Avg. ROI</p>
                  <p className="text-2xl font-bold text-gray-900">15.5%</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Milestone Tracker for Featured Project */}
        {selectedProject && (
          <div className="px-4 py-6 sm:px-0">
            <MilestoneTracker project={selectedProject} />
          </div>
        )}

        {/* Projects Grid */}
        <div className="px-4 py-6 sm:px-0">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Available Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>

        {/* Investment Modal */}
        {showInvestModal && selectedProject && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Invest in Project</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Project:</p>
                    <p className="font-medium">{selectedProject.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Expected ROI:</p>
                    <p className="font-medium text-green-600">{selectedProject.expectedROI}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Risk Level:</p>
                    <p className="font-medium">{selectedProject.riskLevel.toUpperCase()}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Investment Amount (ET)
                    </label>
                    <input
                      type="number"
                      value={investmentAmount}
                      onChange={(e) => setInvestmentAmount(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter amount"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={() => setShowInvestModal(false)}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmInvestment}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Confirm Investment
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

export default Crowdfunding;