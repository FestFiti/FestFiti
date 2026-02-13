import React, { useState } from 'react';
import { useEvent } from '../context/eventHooks';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Ticket,
  Clock,
  Plus,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import {
  EVENT_STATUSES,
  EVENT_TYPES,
  getStatusColor,
  getStatusText,
  createNewEvent,
  validateEventData,
  getEventSummary,
  generateActivityLog
} from '../utils/eventUtils';

const Events = () => {
  const { state, actions } = useEvent();
  const navigate = useNavigate();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    type: EVENT_TYPES.CONCERT,
    location: '',
    date: '',
    time: '',
    capacity: '',
    baseBudget: '',
    ticketPrice: ''
  });

  const [formErrors, setFormErrors] = useState([]);

  // Get all events (current + stored events + mock upcoming)
  const allEvents = [
    // Current main event from state
    {
      ...state.eventDetails,
      id: 'EVT001',
      status: EVENT_STATUSES.LIVE,
      ticketsSold: state.ticketStats.totalTickets,
      ticketsCheckedIn: state.ticketStats.checkedIn,
      vendorCount: state.vendors.length,
      fraudAttempts: state.fraudLogs.length,
      sustainabilityScore: state.sustainabilityMetrics.sustainabilityScore,
      totalExpenses: state.budgetOverview.used
    },
    // Events created by user stored in state
    ...state.events,
    // Mock upcoming events for demo purposes
    ...[
      {
        id: 'EVT002',
        name: 'Nairobi Tech Summit 2024',
        type: EVENT_TYPES.CORPORATE,
        location: 'KICC',
        date: '2024-04-20',
        time: '09:00',
        capacity: 3000,
        ticketPrice: 5000,
        baseBudget: 1500000,
        status: EVENT_STATUSES.DRAFT,
        ticketsSold: 450,
        ticketsCheckedIn: 0,
        vendorCount: 8,
        fraudAttempts: 0,
        sustainabilityScore: 72,
        totalExpenses: 450000
      },
      {
        id: 'EVT003',
        name: 'Coastal Music Festival',
        type: EVENT_TYPES.FESTIVAL,
        location: 'Mombasa Beach Arena',
        date: '2024-05-15',
        time: '16:00',
        capacity: 8000,
        ticketPrice: 2000,
        baseBudget: 2500000,
        status: EVENT_STATUSES.DRAFT,
        ticketsSold: 1200,
        ticketsCheckedIn: 0,
        vendorCount: 15,
        fraudAttempts: 0,
        sustainabilityScore: 68,
        totalExpenses: 800000
      }
    ]
  ];

  const handleCreateEvent = () => {
    const errors = validateEventData(formData);
    
    if (errors.length > 0) {
      setFormErrors(errors);
      return;
    }

    // Create new event using utility function
    const newEvent = createNewEvent(formData);

    // Add event to state using context action
    actions.addEvent(newEvent);

    // Reset form
    setFormData({
      name: '',
      type: EVENT_TYPES.CONCERT,
      location: '',
      date: '',
      time: '',
      capacity: '',
      baseBudget: '',
      ticketPrice: ''
    });
    setFormErrors([]);
    setShowCreateModal(false);
  };

  const handleManageEvent = (event) => {
    navigate(`/manage-event/${event.id}`);
  };

  const getEventIcon = (type) => {
    switch (type) {
      case EVENT_TYPES.WEDDING:
        return <Calendar className="w-5 h-5" />;
      case EVENT_TYPES.CONCERT:
        return <Ticket className="w-5 h-5" />;
      case EVENT_TYPES.CORPORATE:
        return <Users className="w-5 h-5" />;
      case EVENT_TYPES.FESTIVAL:
        return <TrendingUp className="w-5 h-5" />;
      default:
        return <Calendar className="w-5 h-5" />;
    }
  };

  if (selectedEvent) {
    return <EventDetail event={selectedEvent} onBack={() => setSelectedEvent(null)} />;
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Event Management</h1>
          <p className="text-gray-600">Create and manage your events</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center space-x-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Create Event</span>
        </button>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allEvents.map((event) => {
          const summary = getEventSummary(event);
          
          return (
            <div key={event.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              {/* Event Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600">
                    {getEventIcon(event.type)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{event.name}</h3>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(event.status)}`}>
                      {getStatusText(event.status)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Event Details */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  {new Date(event.date).toLocaleDateString()} at {event.time}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="w-4 h-4 mr-2" />
                  {event.location}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="w-4 h-4 mr-2" />
                  {event.ticketsSold}/{event.capacity} attendees
                </div>
              </div>

              {/* Progress Bars */}
              <div className="space-y-2 mb-4">
                <div>
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>Capacity</span>
                    <span>{summary.capacityUsage.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        summary.capacityUsage >= 90 ? 'bg-red-500' :
                        summary.capacityUsage >= 70 ? 'bg-yellow-500' :
                        'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(summary.capacityUsage, 100)}%` }}
                    />
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>Budget</span>
                    <span>{summary.budgetUsage.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        summary.budgetUsage >= 100 ? 'bg-red-500' :
                        summary.budgetUsage >= 80 ? 'bg-yellow-500' :
                        'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(summary.budgetUsage, 100)}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Alerts */}
              <div className="flex items-center space-x-2 mb-4">
                {summary.hasFraudAlerts && (
                  <div className="flex items-center text-red-600 text-xs">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    {event.fraudAttempts} fraud alerts
                  </div>
                )}
                {summary.isOverBudget && (
                  <div className="flex items-center text-red-600 text-xs">
                    <XCircle className="w-3 h-3 mr-1" />
                    Over budget
                  </div>
                )}
                {summary.isNearCapacity && (
                  <div className="flex items-center text-yellow-600 text-xs">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    Near capacity
                  </div>
                )}
              </div>

              {/* Action Button */}
              <button
                onClick={() => handleManageEvent(event)}
                className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Manage Event
              </button>
            </div>
          );
        })}
      </div>

      {/* Create Event Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Create New Event</h2>
            
            {formErrors.length > 0 && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <ul className="text-sm text-red-800 space-y-1">
                  {formErrors.map((error, index) => (
                    <li key={index}>• {error}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Event Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter event name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Event Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value={EVENT_TYPES.CONCERT}>Concert</option>
                  <option value={EVENT_TYPES.WEDDING}>Wedding</option>
                  <option value={EVENT_TYPES.CORPORATE}>Corporate</option>
                  <option value={EVENT_TYPES.FESTIVAL}>Festival</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter location"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({...formData, time: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Maximum Capacity</label>
                <input
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => setFormData({...formData, capacity: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter capacity"
                  min="1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Base Budget (KES)</label>
                <input
                  type="number"
                  value={formData.baseBudget}
                  onChange={(e) => setFormData({...formData, baseBudget: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter budget"
                  min="1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ticket Price (KES)</label>
                <input
                  type="number"
                  value={formData.ticketPrice}
                  onChange={(e) => setFormData({...formData, ticketPrice: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter ticket price"
                  min="0"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateEvent}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Create Event
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Event Detail Component
const EventDetail = ({ event, onBack }) => {
  const [activeTab, setActiveTab] = useState('overview');
  
  const summary = getEventSummary(event);
  const activityLog = generateActivityLog(event);

  const tabs = [
    { id: 'overview', name: 'Overview', icon: <Calendar className="w-4 h-4" /> },
    { id: 'tickets', name: 'Tickets', icon: <Ticket className="w-4 h-4" /> },
    { id: 'vendors', name: 'Vendors', icon: <Users className="w-4 h-4" /> },
    { id: 'budget', name: 'Budget', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'sustainability', name: 'Sustainability', icon: <CheckCircle className="w-4 h-4" /> },
    { id: 'activity', name: 'Activity Log', icon: <Clock className="w-4 h-4" /> }
  ];

  return (
    <div className="space-y-6">
      {/* Event Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="text-gray-600 hover:text-gray-900"
            >
              ← Back to Events
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{event.name}</h1>
              <div className="flex items-center space-x-4 mt-1">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(event.status)}`}>
                  {getStatusText(event.status)}
                </span>
                <span className="text-sm text-gray-600">
                  {new Date(event.date).toLocaleDateString()} at {event.time}
                </span>
                <span className="text-sm text-gray-600">{event.location}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Summary KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-gray-900">{summary.capacityUsage.toFixed(1)}%</div>
            <div className="text-sm text-gray-600">Capacity Used</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-gray-900">{summary.budgetUsage.toFixed(1)}%</div>
            <div className="text-sm text-gray-600">Budget Used</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-gray-900">{event.vendorCount}</div>
            <div className="text-sm text-gray-600">Vendors</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-gray-900">{event.fraudAttempts}</div>
            <div className="text-sm text-gray-600">Fraud Alerts</div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.icon}
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'overview' && <OverviewTab event={event} summary={summary} />}
          {activeTab === 'tickets' && <TicketsTab event={event} />}
          {activeTab === 'vendors' && <VendorsTab event={event} />}
          {activeTab === 'budget' && <BudgetTab event={event} />}
          {activeTab === 'sustainability' && <SustainabilityTab event={event} />}
          {activeTab === 'activity' && <ActivityTab activities={activityLog} />}
        </div>
      </div>
    </div>
  );
};

// Tab Components
const OverviewTab = ({ event, summary }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Capacity Overview</h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Tickets Sold</span>
            <span className="font-medium">{event.ticketsSold}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Checked In</span>
            <span className="font-medium">{event.ticketsCheckedIn}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Remaining</span>
            <span className="font-medium">{summary.ticketsRemaining}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Check-in Rate</span>
            <span className="font-medium">{summary.checkInRate.toFixed(1)}%</span>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Budget Overview</h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Base Budget</span>
            <span className="font-medium">KES {event.baseBudget.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Expenses</span>
            <span className="font-medium">KES {event.totalExpenses.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Remaining</span>
            <span className="font-medium">KES {(event.baseBudget - event.totalExpenses).toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Revenue</span>
            <span className="font-medium">KES {summary.revenue.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const TicketsTab = ({ event }) => (
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <h3 className="text-lg font-semibold text-gray-900">Ticket Management</h3>
      <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
        Open TicketGuard
      </button>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="text-2xl font-bold text-blue-900">{event.ticketsSold}</div>
        <div className="text-sm text-blue-700">Total Tickets Sold</div>
      </div>
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="text-2xl font-bold text-green-900">{event.ticketsCheckedIn}</div>
        <div className="text-sm text-green-700">Checked In</div>
      </div>
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="text-2xl font-bold text-red-900">{event.fraudAttempts}</div>
        <div className="text-sm text-red-700">Fraud Attempts</div>
      </div>
    </div>
  </div>
);

const VendorsTab = ({ event }) => (
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <h3 className="text-lg font-semibold text-gray-900">Vendor Management</h3>
      <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
        Add Vendor
      </button>
    </div>
    
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
      <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
      <h4 className="text-lg font-medium text-gray-900 mb-2">{event.vendorCount} Vendors Assigned</h4>
      <p className="text-gray-600">View detailed vendor information in the Vendors module</p>
    </div>
  </div>
);

const BudgetTab = ({ event }) => (
  <div className="space-y-4">
    <h3 className="text-lg font-semibold text-gray-900">Budget Management</h3>
    
    <div className="space-y-4">
      <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
        <span className="text-gray-600">Base Budget</span>
        <span className="text-xl font-bold text-gray-900">KES {event.baseBudget.toLocaleString()}</span>
      </div>
      
      <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
        <span className="text-gray-600">Total Expenses</span>
        <span className="text-xl font-bold text-gray-900">KES {event.totalExpenses.toLocaleString()}</span>
      </div>
      
      <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
        <span className="text-gray-600">Remaining Budget</span>
        <span className="text-xl font-bold text-green-600">KES {(event.baseBudget - event.totalExpenses).toLocaleString()}</span>
      </div>
    </div>
  </div>
);

const SustainabilityTab = ({ event }) => (
  <div className="space-y-4">
    <h3 className="text-lg font-semibold text-gray-900">Sustainability Metrics</h3>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="text-2xl font-bold text-green-900">{event.sustainabilityScore}/100</div>
        <div className="text-sm text-green-700">Sustainability Score</div>
      </div>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="text-2xl font-bold text-blue-900">75%</div>
        <div className="text-sm text-blue-700">Eco-Certified Vendors</div>
      </div>
    </div>
  </div>
);

const ActivityTab = ({ activities }) => (
  <div className="space-y-4">
    <h3 className="text-lg font-semibold text-gray-900">Activity Log</h3>
    
    <div className="space-y-3">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
          <Clock className="w-4 h-4 text-gray-400 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-gray-900">{activity.description}</p>
            <p className="text-xs text-gray-500">{new Date(activity.timestamp).toLocaleString()}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default Events;