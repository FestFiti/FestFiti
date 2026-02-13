import React, { useState } from 'react';
import { useEvent } from '../context/eventHooks';
import TicketScanner from '../components/TicketScanner';
import { 
  Shield, 
  Camera, 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  Users,
  Clock,
  Search,
  Plus
} from 'lucide-react';

const TicketGuard = () => {
  const { state, actions } = useEvent();
  const [showScanner, setShowScanner] = useState(false);
  const [activeTab, setActiveTab] = useState('validation');
  const [ticketTypes, setTicketTypes] = useState([]);
  const [ticketIdCounter, setTicketIdCounter] = useState(1000);

  const tabs = [
    { id: 'validation', name: 'TicketGuard', icon: Shield },
    { id: 'create', name: 'Create Ticket', icon: Plus }
  ];

  // Generate unique ticket ID using counter to avoid impure function
  const generateTicketId = () => {
    const eventId = 'EVT001';
    const currentId = ticketIdCounter + 1;
    setTicketIdCounter(currentId);
    return `TCK-${eventId}-${currentId}`;
  };

  // Handle form submission
  const handleCreateTicket = (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const newTicketType = {
      id: `TT-${Date.now()}`,
      eventId: 'EVT001',
      name: formData.get('ticketName'),
      description: formData.get('description'),
      price: parseFloat(formData.get('price')),
      totalQuantity: parseInt(formData.get('quantity')),
      sold: 0,
      maxPerBuyer: parseInt(formData.get('maxPerBuyer')) || 4,
      status: formData.get('status'),
      saleStart: formData.get('saleStart'),
      saleEnd: formData.get('saleEnd'),
      createdDate: new Date().toISOString()
    };

    setTicketTypes([...ticketTypes, newTicketType]);
    
    // Show success message
    alert(`Ticket Type "${newTicketType.name}" created successfully!`);
    
    // Reset form
    e.target.reset();
  };

  const handleOpenScanner = () => {
    setShowScanner(true);
  };

  const handleCloseScanner = () => {
    setShowScanner(false);
  };

  const getRecentLogs = () => {
    // Combine check-ins and fraud logs, sort by time
    const allLogs = [
      ...state.checkInLogs.map(log => ({
        ...log,
        type: 'checkin',
        timestamp: log.checkInTime
      })),
      ...state.fraudLogs.map(log => ({
        ...log,
        type: 'fraud',
        timestamp: log.attemptTime
      }))
    ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    return allLogs.slice(0, 10);
  };

  const getLogIcon = (type) => {
    switch (type) {
      case 'checkin':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'fraud':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getLogColor = (type) => {
    switch (type) {
      case 'checkin':
        return 'border-green-200 bg-green-50';
      case 'fraud':
        return 'border-red-200 bg-red-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const recentLogs = getRecentLogs();

  // Tab Components
  const renderValidationTab = () => (
    <div className="space-y-6">
      {/* Original TicketGuard content */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Ticket Validation</h2>
          <p className="text-gray-600">Secure ticket validation and fraud detection</p>
        </div>
        <button
          onClick={handleOpenScanner}
          className="flex items-center space-x-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Camera className="w-5 h-5" />
          <span>Open Scanner</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-sm font-medium text-green-600">+12%</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {state.ticketStats.usedTickets || 0}
          </div>
          <div className="text-sm text-gray-600">Valid Check-ins</div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
            <span className="text-sm font-medium text-red-600">Alert</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {state.ticketStats.fraudAttempts || 0}
          </div>
          <div className="text-sm text-gray-600">Fraud Attempts</div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
            </div>
            <span className="text-sm font-medium text-yellow-600">Warning</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {state.ticketStats.duplicateAttempts || 0}
          </div>
          <div className="text-sm text-gray-600">Duplicates</div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-sm font-medium text-green-600">Active</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {state.ticketStats.checkInRate || 0}%
          </div>
          <div className="text-sm text-gray-600">Check-in Rate</div>
        </div>
      </div>

      {/* Last Validation Result */}
      {state.lastValidationResult && (
        <div className={`border-2 rounded-lg p-6 ${
          state.lastValidationResult.status === 'VALID' ? 'border-green-200 bg-green-50' :
          state.lastValidationResult.status === 'DUPLICATE' ? 'border-yellow-200 bg-yellow-50' :
          'border-red-200 bg-red-50'
        }`}>
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full flex items-center justify-center bg-white">
              {state.lastValidationResult.status === 'VALID' && <CheckCircle className="w-8 h-8 text-green-500" />}
              {state.lastValidationResult.status === 'DUPLICATE' && <AlertTriangle className="w-8 h-8 text-yellow-500" />}
              {state.lastValidationResult.status === 'INVALID' && <XCircle className="w-8 h-8 text-red-500" />}
            </div>
            <div className="flex-1">
              <div className="text-xl font-bold text-gray-900 mb-1">
                {state.lastValidationResult.status}
              </div>
              <div className="text-gray-700">
                {state.lastValidationResult.message}
              </div>
              {state.lastValidationResult.ticket && (
                <div className="text-sm text-gray-600 mt-2">
                  Ticket: {state.lastValidationResult.ticket.id} • {state.lastValidationResult.ticket.attendeeName}
                </div>
              )}
            </div>
            <button
              onClick={handleOpenScanner}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Scan Another
            </button>
          </div>
        </div>
      )}

      {/* Activity Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                <span>Last 10 activities</span>
              </div>
            </div>
          </div>
          
          <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
            {recentLogs.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No recent activity
              </div>
            ) : (
              recentLogs.map((log, index) => (
                <div key={index} className={`p-4 ${getLogColor(log.type)}`}>
                  <div className="flex items-start space-x-3">
                    {getLogIcon(log.type)}
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900">
                        {log.type === 'checkin' ? `Check-in: ${log.attendeeName}` : `Fraud Attempt: ${log.reason}`}
                      </div>
                      <div className="text-sm text-gray-600">
                        {log.type === 'checkin' ? `Ticket ${log.ticketId}` : `Ticket ${log.ticketId || 'Unknown'}`}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {new Date(log.timestamp).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          {/* Quick Test */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Test</h3>
            <div className="space-y-3">
              <button
                onClick={() => actions.validateTicket('QR001')}
                className="w-full px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-left"
              >
                Test Valid Ticket (QR001)
              </button>
              <button
                onClick={() => actions.validateTicket('QR006')}
                className="w-full px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors text-left"
              >
                Test Duplicate (QR006)
              </button>
              <button
                onClick={() => actions.validateTicket('INVALID001')}
                className="w-full px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-left"
              >
                Test Invalid (INVALID001)
              </button>
            </div>
          </div>

          {/* System Status */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">System Status</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Scanner Status</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                  Active
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Fraud Detection</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                  Enabled
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Database Sync</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                  Live
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCreateTab = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Create Ticket Type</h2>
        <p className="text-gray-600">Define new ticket categories for your event</p>
      </div>
      
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <form onSubmit={handleCreateTicket} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ticket Name *
              </label>
              <input
                type="text"
                name="ticketName"
                placeholder="e.g., VIP, Regular, Early Bird"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                placeholder="Optional description of ticket benefits"
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price (KES) *
                </label>
                <input
                  type="number"
                  name="price"
                  placeholder="5000"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity Available *
                </label>
                <input
                  type="number"
                  name="quantity"
                  placeholder="200"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Per Buyer
                </label>
                <input
                  type="number"
                  name="maxPerBuyer"
                  placeholder="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select 
                  name="status"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="Active">Active</option>
                  <option value="Paused">Paused</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sale Start Date
                </label>
                <input
                  type="date"
                  name="saleStart"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sale End Date
                </label>
                <input
                  type="date"
                  name="saleEnd"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
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
                Save Ticket Type
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Display Created Ticket Types */}
      {ticketTypes.length > 0 && (
        <div className="mt-6 max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Created Ticket Types</h3>
            <div className="space-y-3">
              {ticketTypes.map((ticket) => (
                <div key={ticket.id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-medium text-gray-900">{ticket.name}</h4>
                      <p className="text-sm text-gray-600">{ticket.description}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      ticket.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {ticket.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Price:</span>
                      <span className="font-medium">KES {ticket.price.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Quantity:</span>
                      <span className="font-medium">{ticket.totalQuantity}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Max/Buyer:</span>
                      <span className="font-medium">{ticket.maxPerBuyer}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Sold:</span>
                      <span className="font-medium">{ticket.sold}</span>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Sample Ticket IDs:</span>
                      <div className="text-xs font-mono text-gray-500">
                        {generateTicketId()}, {generateTicketId()}, {generateTicketId()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'validation':
        return renderValidationTab();
      case 'create':
        return renderCreateTab();
      default:
        return renderValidationTab();
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">TicketGuard</h1>
        <p className="text-gray-600">Secure ticket validation and fraud detection</p>
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

      {/* Scanner Modal */}
      {showScanner && (
        <TicketScanner onClose={handleCloseScanner} />
      )}
    </div>
  );
};

export default TicketGuard;
