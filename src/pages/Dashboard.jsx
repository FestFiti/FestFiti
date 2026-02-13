import React, { useState } from 'react';
import { useEvent } from '../context/eventHooks';
import KPIcard from '../components/KPIcard';
import ChartCard from '../components/ChartCard';
import CapacityTracker from '../components/CapacityTracker';
import { 
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Minimize2,
  Maximize2
} from 'lucide-react';

const Dashboard = () => {
  const { state } = useEvent();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  // Collapsed state - only show icons
  if (isMinimized) {
    return (
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={toggleMinimize}
          className="bg-white rounded-lg shadow-lg border border-gray-200 p-3 hover:bg-gray-50 transition-colors"
        >
          <Maximize2 className="w-5 h-5 text-gray-600" />
        </button>
      </div>
    );
  }

  // Collapsed state - only show KPI cards with text
  if (isCollapsed) {
    return (
      <div className="space-y-6">
        {/* Header with expand button */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Event Dashboard</h1>
            <p className="text-gray-600">See how your event is performing in real-time</p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleMinimize}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-2 hover:bg-gray-50 transition-colors"
              title="Minimize dashboard"
            >
              <Minimize2 className="w-4 h-4 text-gray-600" />
            </button>
            <button
              onClick={toggleCollapse}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-2 hover:bg-gray-50 transition-colors"
              title="Expand dashboard"
            >
              <ChevronDown className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Compact KPI Cards */}
        <div className="grid grid-cols-5 gap-2">
          <div className="bg-blue-100 rounded-lg p-3 text-center hover:bg-blue-200 transition-colors cursor-pointer">
            <div className="text-sm font-medium text-blue-600">Tickets</div>
            <div className="text-lg font-bold text-blue-800">1250</div>
          </div>
          <div className="bg-green-100 rounded-lg p-3 text-center hover:bg-green-200 transition-colors cursor-pointer">
            <div className="text-sm font-medium text-green-600">Checked In</div>
            <div className="text-lg font-bold text-green-800">875</div>
          </div>
          <div className="bg-red-100 rounded-lg p-3 text-center hover:bg-red-200 transition-colors cursor-pointer">
            <div className="text-sm font-medium text-red-600">Fraud</div>
            <div className="text-lg font-bold text-red-800">3</div>
          </div>
          <div className="bg-yellow-100 rounded-lg p-3 text-center hover:bg-yellow-200 transition-colors cursor-pointer">
            <div className="text-sm font-medium text-yellow-600">Budget</div>
            <div className="text-lg font-bold text-yellow-800">65%</div>
          </div>
          <div className="bg-orange-100 rounded-lg p-3 text-center hover:bg-orange-200 transition-colors cursor-pointer">
            <div className="text-sm font-medium text-orange-600">Risks</div>
            <div className="text-lg font-bold text-orange-800">2</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header with Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Event Dashboard</h1>
          <p className="text-gray-600">See how your event is performing in real-time</p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={toggleCollapse}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-2 hover:bg-gray-50 transition-colors"
            title="Collapse to icons"
          >
            <ChevronUp className="w-4 h-4 text-gray-600" />
          </button>
          <button
            onClick={toggleMinimize}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-2 hover:bg-gray-50 transition-colors"
            title="Minimize dashboard"
          >
            <Minimize2 className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <KPIcard
          title="Tickets Sold"
          value={state.ticketStats.totalTickets || 1250}
          color="blue"
          trend="up"
          trendValue="+12%"
          subtitle="Great sales momentum this week"
        />
        
        <KPIcard
          title="Checked In"
          value={state.ticketStats.usedTickets || 875}
          color="green"
          trend="up"
          trendValue="+8%"
          subtitle={`${state.ticketStats.checkInRate || 70}% of attendees have arrived`}
        />
        
        <KPIcard
          title="Fraud Attempts"
          value={state.ticketStats.fraudAttempts || 3}
          color="red"
          trend={state.ticketStats.fraudAttempts > 0 ? "up" : "down"}
          trendValue={state.ticketStats.fraudAttempts > 0 ? "+2" : "0"}
          subtitle="Security system blocked these attempts"
        />
        
        <KPIcard
          title="Budget Used"
          value={`${state.budgetOverview.usagePercentage || 65}%`}
          color="yellow"
          trend="up"
          trendValue="+5%"
          subtitle={`You've spent KES ${(state.budgetOverview.used || 650000).toLocaleString()} so far`}
        />
        
        <KPIcard
          title="Vendor Risks"
          value={state.vendorStats.riskDistribution?.high || 2}
          color="orange"
          trend="down"
          trendValue="-1"
          subtitle="Vendors that need your attention"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ticket Sales Chart */}
        <ChartCard
          title="Ticket Sales Trend"
          subtitle="How your tickets are selling each day"
          type="line"
          data={state.ticketSales}
          dataKey="sales"
          xAxisKey="date"
          color="#3b82f6"
          height={300}
        />

        {/* Vendor Risk Distribution */}
        <ChartCard
          title="Vendor Risk Distribution"
          subtitle="Which vendors need your attention most"
          type="pie"
          data={[
            { name: 'Low Risk', value: state.vendorStats.riskDistribution?.low || 12 },
            { name: 'Medium Risk', value: state.vendorStats.riskDistribution?.medium || 4 },
            { name: 'High Risk', value: state.vendorStats.riskDistribution?.high || 2 }
          ]}
          dataKey="value"
          color="#3b82f6"
          height={300}
        />
      </div>

      {/* Capacity and Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Capacity Tracker */}
        <div className="lg:col-span-2">
          <CapacityTracker
            current={state.capacityInfo.currentAttendance || 0}
            capacity={state.capacityInfo.capacity || 0}
            percentage={state.capacityInfo.percentage || 0}
          />
        </div>

        {/* Recent Alerts */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">What Needs Your Attention</h3>
          
          {state.notifications.length === 0 ? (
            <div className="space-y-3">
              <div className="p-3 rounded-lg border bg-yellow-50 border-yellow-200">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">Catering budget running low</div>
                    <div className="text-sm text-gray-600">You've used 95% of catering allocation</div>
                  </div>
                </div>
              </div>
              
              <div className="p-3 rounded-lg border bg-red-50 border-red-200">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">Security vendor delayed</div>
                    <div className="text-sm text-gray-600">Response time is 2 hours behind schedule</div>
                  </div>
                </div>
              </div>
              
              <div className="p-3 rounded-lg border bg-blue-50 border-blue-200">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">VIP check-in needs staff</div>
                    <div className="text-sm text-gray-600">Wait time is 15 minutes at VIP entrance</div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {state.notifications.slice(0, 5).map((notification, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border ${
                    notification.type === 'error' ? 'bg-red-50 border-red-200' :
                    notification.type === 'warning' ? 'bg-yellow-50 border-yellow-200' :
                    'bg-blue-50 border-blue-200'
                  }`}
                >
                  <div className="flex items-start space-x-2">
                    <AlertTriangle className={`w-4 h-4 mt-0.5 ${
                      notification.type === 'error' ? 'text-red-500' :
                      notification.type === 'warning' ? 'text-yellow-500' :
                      'text-blue-500'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900">
                        {notification.title}
                      </div>
                      <div className="text-xs text-gray-600 mt-1">
                        {notification.message}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {new Date(notification.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="text-sm text-gray-600 mb-1">Event Date</div>
          <div className="text-lg font-semibold text-gray-900">
            {new Date(state.eventDetails.date).toLocaleDateString()}
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="text-sm text-gray-600 mb-1">Venue</div>
          <div className="text-lg font-semibold text-gray-900">
            {state.eventDetails.venue}
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="text-sm text-gray-600 mb-1">Expected Attendance</div>
          <div className="text-lg font-semibold text-gray-900">
            {state.eventDetails.expectedAttendance?.toLocaleString()}
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="text-sm text-gray-600 mb-1">Sustainability Score</div>
          <div className="text-lg font-semibold text-gray-900">
            {state.sustainabilityMetrics.sustainabilityScore}/100
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
