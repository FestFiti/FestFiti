import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Calendar, 
  DollarSign, 
  Users, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown,
  Edit3,
  Archive,
  Plus,
  Settings,
  ChevronDown
} from 'lucide-react';

const ManageEvent = () => {
  const { eventId } = useParams();
  const [activeTab, setActiveTab] = useState('overview');
  const [showQuickActions, setShowQuickActions] = useState(false);

  // Mock event data - in real app, this would come from API
  const getEventData = (id) => {
    const events = {
      'EVT001': {
        name: 'Nairobi Music Festival 2024',
        status: 'live',
        date: '15/03/2024',
        capacity: 5000,
        ticketsSold: 2100,
        budgetUsed: 0,
        fraudAlerts: 3,
        revenue: 1260000,
        totalBudget: 1000000,
        totalSpent: 0,
        vendorsAssigned: 4,
        highRiskVendors: 1,
        sustainabilityScore: 68
      },
      'EVT002': {
        name: 'Tech Conference 2024',
        status: 'upcoming',
        date: '20/04/2024',
        capacity: 2000,
        ticketsSold: 800,
        budgetUsed: 45,
        fraudAlerts: 0,
        revenue: 480000,
        totalBudget: 500000,
        totalSpent: 225000,
        vendorsAssigned: 6,
        highRiskVendors: 0,
        sustainabilityScore: 72
      }
    };
    return events[id] || events['EVT001']; // Default to EVT001 if not found
  };

  // Initialize event data based on URL parameter
  const [eventData] = useState(() => {
    return getEventData(eventId);
  });

  const tabs = [
    { id: 'overview', name: 'Overview', icon: null },
    { id: 'budget', name: 'Budget', icon: DollarSign },
    { id: 'vendors', name: 'Vendors', icon: Users },
    { id: 'tickets', name: 'Tickets', icon: null },
    { id: 'fraud', name: 'Fraud', icon: AlertTriangle },
    { id: 'sustainability', name: 'Sustainability', icon: null },
    { id: 'activity', name: 'Activity Log', icon: null }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'live': return 'bg-green-100 text-green-800 border-green-200';
      case 'upcoming': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTicketProgress = () => {
    return (eventData.ticketsSold / eventData.capacity) * 100;
  };

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* Event Health Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Tickets Sold Card */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-900">Tickets Sold</h4>
            <div className="text-sm text-gray-500">42%</div>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-2">
            {eventData.ticketsSold.toLocaleString()} / {eventData.capacity.toLocaleString()}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-blue-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${getTicketProgress()}%` }}
            />
          </div>
        </div>

        {/* Budget Used Card */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-900">Budget Used</h4>
            <div className="text-sm text-gray-500">0%</div>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-2">
            {eventData.budgetUsed}%
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-3">Budget not set up</p>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Setup Budget
            </button>
          </div>
        </div>

        {/* Revenue Card */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-900">Revenue</h4>
            <div className="flex items-center text-green-600">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span className="text-sm">Up</span>
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-2">
            KES {eventData.revenue.toLocaleString()}
          </div>
        </div>

        {/* Fraud Alerts Card */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-900">Fraud Alerts</h4>
            <div className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded">
              {eventData.fraudAlerts} Alerts
            </div>
          </div>
          <div className="text-2xl font-bold text-red-600 mb-2">
            {eventData.fraudAlerts}
          </div>
          <button className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
            Review Fraud Alerts
          </button>
        </div>

        {/* Vendors Assigned Card */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-900">Vendors Assigned</h4>
            <div className="text-sm text-gray-500">1 High Risk</div>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-2">
            {eventData.vendorsAssigned}
          </div>
          <div className="text-sm text-gray-600">
            1 vendor needs attention
          </div>
        </div>

        {/* Sustainability Score Card */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-900">Sustainability Score</h4>
            <div className="text-sm text-gray-500">68%</div>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-2">
            {eventData.sustainabilityScore}%
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-green-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${eventData.sustainabilityScore}%` }}
            />
          </div>
        </div>
      </div>

      {/* Financial Snapshot Panel */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Financial Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-sm text-gray-600 mb-1">Total Budget</div>
            <div className="text-xl font-bold text-gray-900">KES {eventData.totalBudget.toLocaleString()}</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-600 mb-1">Total Spent</div>
            <div className="text-xl font-bold text-gray-900">KES {eventData.totalSpent.toLocaleString()}</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-600 mb-1">Remaining Balance</div>
            <div className="text-xl font-bold text-gray-900">KES {(eventData.totalBudget - eventData.totalSpent).toLocaleString()}</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-600 mb-1">Net Position</div>
            <div className="text-xl font-bold text-green-600">KES {(eventData.revenue - eventData.totalSpent).toLocaleString()}</div>
          </div>
        </div>
      </div>

      {/* Alerts Section */}
      {eventData.fraudAlerts > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <div>
              <h4 className="text-red-800 font-semibold">{eventData.fraudAlerts} suspicious ticket transactions detected</h4>
              <p className="text-red-700 text-sm mt-1">Review Now</p>
            </div>
          </div>
        </div>
      )}

      {/* Vendor Summary Panel */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Vendor Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">{eventData.vendorsAssigned}</div>
            <div className="text-sm text-gray-600">Total vendors assigned</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">{eventData.highRiskVendors}</div>
            <div className="text-sm text-gray-600">High-risk vendor warning</div>
          </div>
        </div>
      </div>

      {/* Quick Actions Panel */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center">
            <Plus className="w-4 h-4 mr-2" />
            Add Vendor
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center">
            <Plus className="w-4 h-4 mr-2" />
            Setup Budget
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center">
            <Plus className="w-4 h-4 mr-2" />
            Create Ticket Type
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center">
            <Plus className="w-4 h-4 mr-2" />
            Review Fraud Alerts
          </button>
        </div>
      </div>
    </div>
  );

  const renderBudgetTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Budget Management</h3>
        
        {/* Budget Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">KES {eventData.totalBudget.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Total Allocated</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">KES {eventData.totalSpent.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Total Spent</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">KES {(eventData.totalBudget - eventData.totalSpent).toLocaleString()}</div>
            <div className="text-sm text-gray-600">Remaining</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">{eventData.budgetUsed}%</div>
            <div className="text-sm text-gray-600">Usage %</div>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="space-y-4">
          <h4 className="text-md font-semibold text-gray-900">Category Breakdown</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-gray-900">Catering</span>
                <span className="text-sm text-gray-600">KES 300,000</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '30%' }}></div>
              </div>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-gray-900">Security</span>
                <span className="text-sm text-gray-600">KES 150,000</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '15%' }}></div>
              </div>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-gray-900">Stage & Sound</span>
                <span className="text-sm text-gray-600">KES 250,000</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '25%' }}></div>
              </div>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-gray-900">Marketing</span>
                <span className="text-sm text-gray-600">KES 100,000</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full" style={{ width: '10%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Revenue vs Expense */}
        <div className="mt-6">
          <h4 className="text-md font-semibold text-gray-900 mb-4">Revenue vs Expenses</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">KES {eventData.revenue.toLocaleString()}</div>
              <div className="text-sm text-green-700">Total Revenue</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">KES {eventData.totalSpent.toLocaleString()}</div>
              <div className="text-sm text-red-700">Total Expenses</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderVendorsTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Vendor Management</h3>
        
        {/* Vendor Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h4 className="font-semibold text-gray-900">Elite Catering</h4>
                <p className="text-sm text-gray-600">Catering Services</p>
              </div>
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">Active</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Reliability:</span>
                <span className="font-medium text-green-600">82/100</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Contract:</span>
                <span className="font-medium">KES 350,000</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Milestone:</span>
                <span className="font-medium">30%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '30%' }}></div>
              </div>
            </div>
            <button className="w-full mt-3 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
              View Details
            </button>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h4 className="font-semibold text-gray-900">SecureGuard Ltd</h4>
                <p className="text-sm text-gray-600">Security Services</p>
              </div>
              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded">At Risk</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Reliability:</span>
                <span className="font-medium text-yellow-600">58/100</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Contract:</span>
                <span className="font-medium">KES 150,000</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Milestone:</span>
                <span className="font-medium">45%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '45%' }}></div>
              </div>
            </div>
            <button className="w-full mt-3 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
              View Details
            </button>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h4 className="font-semibold text-gray-900">SoundWave Pro</h4>
                <p className="text-sm text-gray-600">Stage & Sound</p>
              </div>
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">Active</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Reliability:</span>
                <span className="font-medium text-green-600">91/100</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Contract:</span>
                <span className="font-medium">KES 250,000</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Milestone:</span>
                <span className="font-medium">60%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '60%' }}></div>
              </div>
            </div>
            <button className="w-full mt-3 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
              View Details
            </button>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h4 className="font-semibold text-gray-900">Marketing Masters</h4>
                <p className="text-sm text-gray-600">Promotion</p>
              </div>
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">Active</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Reliability:</span>
                <span className="font-medium text-green-600">88/100</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Contract:</span>
                <span className="font-medium">KES 100,000</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Milestone:</span>
                <span className="font-medium">75%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '75%' }}></div>
              </div>
            </div>
            <button className="w-full mt-3 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
              View Details
            </button>
          </div>
        </div>

        {/* Vendor Summary */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">{eventData.vendorsAssigned}</div>
            <div className="text-sm text-gray-600">Total Vendors</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">{eventData.highRiskVendors}</div>
            <div className="text-sm text-gray-600">High Risk</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">KES 850,000</div>
            <div className="text-sm text-gray-600">Total Contracts</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTicketsTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Ticket Management</h3>
        
        {/* Ticket Types Table */}
        <div className="mb-6">
          <h4 className="text-md font-semibold text-gray-900 mb-3">Ticket Types</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ticket Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sold</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fraud Flags</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">VIP Pass</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">KES 10,000</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">150</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">KES 1,500,000</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">General Admission</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">KES 5,000</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">1,800</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">KES 9,000,000</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">1</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Student Pass</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">KES 2,000</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">150</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">KES 300,000</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">0</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Sales Performance */}
        <div className="mb-6">
          <h4 className="text-md font-semibold text-gray-900 mb-3">Sales Performance</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">{eventData.ticketsSold.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Total Tickets Sold</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">{getTicketProgress().toFixed(1)}%</div>
              <div className="text-sm text-gray-600">% Capacity</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">KES {eventData.revenue.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Total Revenue</div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Create Ticket Type
          </button>
          <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
            Adjust Pricing
          </button>
          <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
            Export Sales Data
          </button>
        </div>
      </div>
    </div>
  );

  const renderFraudTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Fraud Detection</h3>
        
        {/* Fraud Summary */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <div className="text-2xl font-bold text-red-600">Medium</div>
            <div className="text-sm text-red-700">Fraud Risk Level</div>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <div className="text-2xl font-bold text-red-600">{eventData.fraudAlerts}</div>
            <div className="text-sm text-red-700">Total Flags</div>
          </div>
        </div>

        {/* Fraud Table */}
        <div className="mb-6">
          <h4 className="text-md font-semibold text-gray-900 mb-3">Suspicious Transactions</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ticket ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Buyer Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Method</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk Level</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Flag Reason</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">TCK-2024-001</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">John Doe</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Credit Card</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded">High</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Multiple IP addresses</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-900 text-sm">Mark Legitimate</button>
                      <button className="text-red-600 hover:text-red-900 text-sm">Block</button>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">TCK-2024-002</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Jane Smith</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Mobile Money</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded">Medium</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Unusual purchase pattern</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-900 text-sm">Mark Legitimate</button>
                      <button className="text-red-600 hover:text-red-900 text-sm">Block</button>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">TCK-2024-003</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Mike Johnson</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Bank Transfer</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded">Medium</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Suspicious email domain</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-900 text-sm">Mark Legitimate</button>
                      <button className="text-red-600 hover:text-red-900 text-sm">Block</button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3">
          <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
            Block All Suspicious
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Mark All Legitimate
          </button>
          <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
            Export Fraud Report
          </button>
        </div>
      </div>
    </div>
  );

  const renderSustainabilityTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Sustainability Tracking</h3>
        
        {/* Sustainability Score */}
        <div className="mb-6 text-center">
          <div className="text-4xl font-bold text-gray-900 mb-2">{eventData.sustainabilityScore}%</div>
          <div className="text-sm text-gray-600">Sustainability Score</div>
          <div className="w-full bg-gray-200 rounded-full h-4 max-w-md mx-auto mt-3">
            <div 
              className="bg-green-500 h-4 rounded-full transition-all duration-500"
              style={{ width: `${eventData.sustainabilityScore}%` }}
            />
          </div>
        </div>

        {/* Sustainability Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">75%</div>
            <div className="text-sm text-green-700">Eco Vendor Ratio</div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">Active</div>
            <div className="text-sm text-blue-700">Waste Plan Status</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">2.5 tons</div>
            <div className="text-sm text-purple-700">Carbon Offset</div>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">A+</div>
            <div className="text-sm text-yellow-700">Environmental Rating</div>
          </div>
        </div>

        {/* Detailed Metrics */}
        <div className="space-y-4">
          <h4 className="text-md font-semibold text-gray-900">Environmental Impact</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-gray-900">Energy Usage</span>
                <span className="text-sm text-green-600">Low</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '25%' }}></div>
              </div>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-gray-900">Waste Management</span>
                <span className="text-sm text-green-600">Excellent</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-gray-900">Local Sourcing</span>
                <span className="text-sm text-green-600">High</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '70%' }}></div>
              </div>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-gray-900">Carbon Footprint</span>
                <span className="text-sm text-yellow-600">Moderate</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '45%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3">
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            Generate Sustainability Report
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Offset Carbon Emissions
          </button>
          <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
            Update Sustainability Goals
          </button>
        </div>
      </div>
    </div>
  );

  const renderActivityTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity Log</h3>
        
        {/* Filter Options */}
        <div className="mb-4 flex flex-wrap gap-2">
          <button className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded">All</button>
          <button className="px-3 py-1 bg-gray-100 text-gray-600 text-sm font-medium rounded hover:bg-gray-200">Financial</button>
          <button className="px-3 py-1 bg-gray-100 text-gray-600 text-sm font-medium rounded hover:bg-gray-200">Vendor</button>
          <button className="px-3 py-1 bg-gray-100 text-gray-600 text-sm font-medium rounded hover:bg-gray-200">Ticket</button>
          <button className="px-3 py-1 bg-gray-100 text-gray-600 text-sm font-medium rounded hover:bg-gray-200">Security</button>
        </div>

        {/* Activity Timeline */}
        <div className="space-y-3">
          <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-900">Event created successfully</div>
              <div className="text-xs text-gray-500">2 hours ago</div>
              <div className="text-xs text-gray-600 mt-1">Nairobi Music Festival 2024 setup with 5,000 capacity</div>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-900">Budget configured</div>
              <div className="text-xs text-gray-500">1 hour ago</div>
              <div className="text-xs text-gray-600 mt-1">Total budget: KES 1,000,000 allocated across 4 categories</div>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-900">Vendor Elite Catering assigned</div>
              <div className="text-xs text-gray-500">45 minutes ago</div>
              <div className="text-xs text-gray-600 mt-1">Contract: KES 350,000 | Reliability: 82/100</div>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-900">Vendor SoundWave Pro assigned</div>
              <div className="text-xs text-gray-500">40 minutes ago</div>
              <div className="text-xs text-gray-600 mt-1">Contract: KES 250,000 | Reliability: 91/100</div>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-900">Ticket surge detected</div>
              <div className="text-xs text-gray-500">30 minutes ago</div>
              <div className="text-xs text-gray-600 mt-1">500 tickets sold in last 15 minutes - VIP Pass nearly sold out</div>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-900">Fraud flag triggered</div>
              <div className="text-xs text-gray-500">25 minutes ago</div>
              <div className="text-xs text-gray-600 mt-1">Ticket TCK-2024-001 flagged for multiple IP addresses</div>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-900">Vendor SecureGuard Ltd assigned</div>
              <div className="text-xs text-gray-500">20 minutes ago</div>
              <div className="text-xs text-gray-600 mt-1">Contract: KES 150,000 | Reliability: 58/100 (At Risk)</div>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-900">Milestone completed</div>
              <div className="text-xs text-gray-500">15 minutes ago</div>
              <div className="text-xs text-gray-600 mt-1">Elite Catering - Initial payment received (30% complete)</div>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-900">Vendor Marketing Masters assigned</div>
              <div className="text-xs text-gray-500">10 minutes ago</div>
              <div className="text-xs text-gray-600 mt-1">Contract: KES 100,000 | Reliability: 88/100</div>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-900">Budget adjustment requested</div>
              <div className="text-xs text-gray-500">5 minutes ago</div>
              <div className="text-xs text-gray-600 mt-1">Stage & Sound category increased by KES 50,000</div>
            </div>
          </div>
        </div>

        {/* Load More */}
        <div className="text-center mt-6">
          <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
            Load More Activities
          </button>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview': return renderOverviewTab();
      case 'budget': return renderBudgetTab();
      case 'vendors': return renderVendorsTab();
      case 'tickets': return renderTicketsTab();
      case 'fraud': return renderFraudTab();
      case 'sustainability': return renderSustainabilityTab();
      case 'activity': return renderActivityTab();
      default: return renderOverviewTab();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Event Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            {/* Left Section */}
            <div className="flex items-center space-x-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{eventData.name}</h1>
                <div className="flex items-center space-x-2 mt-1">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(eventData.status)}`}>
                    {eventData.status.toUpperCase()}
                  </span>
                  <span className="text-sm text-gray-600">{eventData.date}</span>
                  <span className="text-sm text-gray-600">| Capacity: {eventData.capacity.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-3">
              <button className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center">
                <Edit3 className="w-4 h-4 mr-2" />
                Edit Event
              </button>
              <button className="px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center">
                <Archive className="w-4 h-4 mr-2" />
                Archive Event
              </button>
              <div className="relative">
                <button 
                  onClick={() => setShowQuickActions(!showQuickActions)}
                  className="px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Quick Actions
                  <ChevronDown className="w-4 h-4 ml-1" />
                </button>
                {showQuickActions && (
                  <div className="absolute right-0 top-12 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                    <div className="py-2">
                      <button className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors">Send Announcement</button>
                      <button className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors">Export Data</button>
                      <button className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors">Event Settings</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.icon && <tab.icon className="w-4 h-4 mr-2" />}
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Dynamic Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default ManageEvent;
