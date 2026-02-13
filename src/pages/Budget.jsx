import React, { useState } from 'react';
import { useEvent } from '../context/eventHooks';
import { calculateRevenue } from '../utils/budgetUtils';
import {
  DollarSign,
  TrendingUp,
  AlertTriangle,
  PieChart,
  CreditCard,
  Users,
  Calendar,
  Activity,
  Target,
  Zap,
  Settings,
  Calculator
} from 'lucide-react';

const Budget = () => {
  const { state } = useEvent();
  const [activeTab, setActiveTab] = useState('setup');
  const [budgetSetup, setBudgetSetup] = useState({
    totalBudget: 1000000,
    contingency: 100000,
    categories: [
      { name: 'Catering', allocated: 300000, spent: 0 },
      { name: 'Security', allocated: 150000, spent: 0 },
      { name: 'Stage & Sound', allocated: 250000, spent: 0 },
      { name: 'Marketing', allocated: 100000, spent: 0 },
      { name: 'Logistics', allocated: 100000, spent: 0 }
    ]
  });

  const tabs = [
    { id: 'setup', name: 'Setup Budget', icon: Calculator },
    { id: 'tracking', name: 'Budget Tracking', icon: PieChart }
  ];

  // Handle budget setup
  const handleBudgetSetup = (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const totalBudget = parseFloat(formData.get('totalBudget'));
    const contingencyPercentage = parseFloat(formData.get('contingency')) || 10;
    
    // Calculate category allocations
    const categories = [
      { name: 'Catering', allocated: parseFloat(formData.get('catering')) || 0, spent: 0 },
      { name: 'Security', allocated: parseFloat(formData.get('security')) || 0, spent: 0 },
      { name: 'Stage & Sound', allocated: parseFloat(formData.get('stage')) || 0, spent: 0 },
      { name: 'Marketing', allocated: parseFloat(formData.get('marketing')) || 0, spent: 0 },
      { name: 'Logistics', allocated: parseFloat(formData.get('logistics')) || 0, spent: 0 }
    ];
    
    const totalAllocated = categories.reduce((sum, cat) => sum + cat.allocated, 0);
    
    // Validate budget doesn't exceed total
    if (totalAllocated > totalBudget) {
      alert('Allocated amount exceeds total budget!');
      return;
    }
    
    const newBudgetSetup = {
      totalBudget,
      contingency: totalBudget * (contingencyPercentage / 100),
      categories
    };
    
    setBudgetSetup(newBudgetSetup);
    setActiveTab('tracking');
    
    alert('Budget setup completed successfully!');
  };

  // Get budget data
  const ticketsSold = state.ticketStats.totalTickets;
  const ticketPrice = 5000; // KES 5000 per ticket
  const revenue = calculateRevenue(ticketsSold, ticketPrice);

  // Calculate totals from budget setup
  const totalAllocated = budgetSetup.categories.reduce((sum, cat) => sum + cat.allocated, 0);
  const totalSpent = budgetSetup.categories.reduce((sum, cat) => sum + cat.spent, 0);
  const remainingBudget = budgetSetup.totalBudget - totalSpent - budgetSetup.contingency;

  // Tab Components
  const renderSetupTab = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Budget Setup</h2>
        <p className="text-gray-600">Define the financial structure for your event</p>
      </div>
      
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <form onSubmit={handleBudgetSetup} className="space-y-6">
            {/* Total Budget */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total Event Budget (KES) *
              </label>
              <input
                type="number"
                name="totalBudget"
                defaultValue={budgetSetup.totalBudget}
                placeholder="1000000"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            {/* Contingency */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contingency Percentage (%)
              </label>
              <input
                type="number"
                name="contingency"
                defaultValue="10"
                placeholder="10"
                min="0"
                max="50"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <p className="text-sm text-gray-500 mt-1">
                This amount is reserved for emergencies
              </p>
            </div>

            {/* Category Allocations */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Allocate Budget by Category</h3>
              <div className="space-y-4">
                {budgetSetup.categories.map((category) => (
                  <div key={category.name}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {category.name} (KES)
                    </label>
                    <input
                      type="number"
                      name={category.name.toLowerCase().replace(' & ', '').replace(' ', '')}
                      defaultValue={category.allocated}
                      placeholder="0"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Budget Summary */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Budget:</span>
                  <span className="font-medium">KES {budgetSetup.totalBudget.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Allocated:</span>
                  <span className={`font-medium ${totalAllocated > budgetSetup.totalBudget ? 'text-red-600' : 'text-green-600'}`}>
                    KES {totalAllocated.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Contingency:</span>
                  <span className="font-medium">KES {(budgetSetup.totalBudget * 0.1).toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-200">
              <button
                type="button"
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Save Budget
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  const renderTrackingTab = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Budget Tracking</h2>
        <p className="text-gray-600">Monitor spending and revenue in real-time</p>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-sm font-medium text-blue-600">Total</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            KES {budgetSetup.totalBudget.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">Total Budget</div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-sm font-medium text-green-600">Revenue</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            KES {revenue.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">Ticket Revenue</div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-red-600" />
            </div>
            <span className="text-sm font-medium text-red-600">Spent</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            KES {totalSpent.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">Total Expenses</div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6 text-yellow-600" />
            </div>
            <span className="text-sm font-medium text-yellow-600">Remaining</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            KES {remainingBudget.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">Available Budget</div>
        </div>
      </div>

      {/* Budget Usage Progress Bar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Budget Usage</h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Overall Usage</span>
              <span className={`font-medium ${
                (totalSpent / budgetSetup.totalBudget) > 0.9 ? 'text-red-600' :
                (totalSpent / budgetSetup.totalBudget) > 0.7 ? 'text-yellow-600' :
                'text-green-600'
              }`}>
                {Math.round((totalSpent / budgetSetup.totalBudget) * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div 
                className={`h-4 rounded-full transition-all duration-300 ${
                  (totalSpent / budgetSetup.totalBudget) > 0.9 ? 'bg-red-600' :
                  (totalSpent / budgetSetup.totalBudget) > 0.7 ? 'bg-yellow-600' :
                  'bg-green-600'
                }`}
                style={{ width: `${Math.min((totalSpent / budgetSetup.totalBudget) * 100, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Category Breakdown Grid */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Breakdown</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {budgetSetup.categories.map((category) => {
            const usage = category.spent / category.allocated;
            return (
              <div key={category.name} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900">{category.name}</h4>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    usage > 1 ? 'bg-red-100 text-red-800' :
                    usage > 0.9 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {usage > 1 ? 'Over' : usage > 0.9 ? 'Near Limit' : 'On Track'}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Allocated:</span>
                    <span className="font-medium">KES {category.allocated.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Spent:</span>
                    <span className="font-medium">KES {category.spent.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Remaining:</span>
                    <span className="font-medium">KES {(category.allocated - category.spent).toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        usage > 1 ? 'bg-red-600' :
                        usage > 0.9 ? 'bg-yellow-600' :
                        'bg-green-600'
                      }`}
                      style={{ width: `${Math.min(usage * 100, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Revenue vs Expense Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue vs Expenses</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">KES {revenue.toLocaleString()}</div>
            <div className="text-sm text-green-700">Total Revenue</div>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <div className="text-2xl font-bold text-red-600">KES {totalSpent.toLocaleString()}</div>
            <div className="text-sm text-red-700">Total Expenses</div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className={`text-2xl font-bold ${revenue - totalSpent >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
              KES {(revenue - totalSpent).toLocaleString()}
            </div>
            <div className="text-sm text-blue-700">Net Position</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'setup':
        return renderSetupTab();
      case 'tracking':
        return renderTrackingTab();
      default:
        return renderSetupTab();
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Budget Management</h1>
        <p className="text-gray-600">Setup and track your event budget</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div>
        {renderTabContent()}
      </div>
    </div>
  );
};

export default Budget;
