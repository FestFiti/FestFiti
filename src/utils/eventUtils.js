// Event Management Utilities

export const EVENT_STATUSES = {
  DRAFT: 'draft',
  LIVE: 'live', 
  ONGOING: 'ongoing',
  COMPLETED: 'completed'
};

export const EVENT_TYPES = {
  WEDDING: 'wedding',
  CONCERT: 'concert',
  CORPORATE: 'corporate',
  FESTIVAL: 'festival'
};

export const getStatusColor = (status) => {
  switch (status) {
    case EVENT_STATUSES.DRAFT:
      return 'bg-gray-100 text-gray-800 border-gray-200';
    case EVENT_STATUSES.LIVE:
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case EVENT_STATUSES.ONGOING:
      return 'bg-green-100 text-green-800 border-green-200';
    case EVENT_STATUSES.COMPLETED:
      return 'bg-gray-800 text-white border-gray-900';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export const getStatusText = (status) => {
  switch (status) {
    case EVENT_STATUSES.DRAFT:
      return 'Draft';
    case EVENT_STATUSES.LIVE:
      return 'Live';
    case EVENT_STATUSES.ONGOING:
      return 'Ongoing';
    case EVENT_STATUSES.COMPLETED:
      return 'Completed';
    default:
      return 'Unknown';
  }
};

export const updateEventStatus = (event, newStatus) => {
  const updatedEvent = {
    ...event,
    status: newStatus,
    updatedAt: new Date().toISOString()
  };

  // Add status change to activity log
  const statusChangeEntry = {
    id: `ACT-${Date.now()}`,
    timestamp: new Date().toISOString(),
    type: 'status_change',
    description: `Event status changed from ${getStatusText(event.status)} to ${getStatusText(newStatus)}`,
    details: {
      oldStatus: event.status,
      newStatus: newStatus
    }
  };

  return { updatedEvent, statusChangeEntry };
};

export const calculateCapacityUsage = (event) => {
  if (!event.capacity || event.capacity === 0) return 0;
  return ((event.ticketsSold || 0) / event.capacity) * 100;
};

export const calculateEventBudgetUsage = (event) => {
  if (!event.baseBudget || event.baseBudget === 0) return 0;
  return ((event.totalExpenses || 0) / event.baseBudget) * 100;
};

export const generateActivityLog = (event) => {
  const activities = [];
  
  // Add event creation log
  activities.push({
    id: `ACT-${event.id}-creation`,
    timestamp: event.createdAt || new Date().toISOString(),
    type: 'event_created',
    description: `Event "${event.name}" created`,
    details: {
      eventType: event.type,
      capacity: event.capacity,
      location: event.location
    }
  });

  // Add ticket sales activities
  if (event.ticketsSold > 0) {
    activities.push({
      id: `ACT-${event.id}-tickets`,
      timestamp: new Date().toISOString(),
      type: 'ticket_sales',
      description: `${event.ticketsSold} tickets sold`,
      details: {
        ticketsSold: event.ticketsSold,
        capacity: event.capacity,
        percentage: calculateCapacityUsage(event)
      }
    });
  }

  // Add vendor activities
  if (event.vendorCount > 0) {
    activities.push({
      id: `ACT-${event.id}-vendors`,
      timestamp: new Date().toISOString(),
      type: 'vendors_added',
      description: `${event.vendorCount} vendors assigned to event`,
      details: {
        vendorCount: event.vendorCount
      }
    });
  }

  // Add fraud alerts if any
  if (event.fraudAttempts > 0) {
    activities.push({
      id: `ACT-${event.id}-fraud`,
      timestamp: new Date().toISOString(),
      type: 'fraud_alert',
      description: `${event.fraudAttempts} fraud attempts detected`,
      details: {
        fraudAttempts: event.fraudAttempts
      }
    });
  }

  // Sort by timestamp (most recent first)
  return activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
};

export const createNewEvent = (eventData) => {
  const newEvent = {
    id: `EVT-${Date.now()}`,
    name: eventData.name,
    type: eventData.type,
    location: eventData.location,
    date: eventData.date,
    time: eventData.time,
    capacity: parseInt(eventData.capacity),
    ticketPrice: parseFloat(eventData.ticketPrice) || 0,
    baseBudget: parseFloat(eventData.baseBudget),
    status: EVENT_STATUSES.DRAFT,
    ticketsSold: 0,
    ticketsCheckedIn: 0,
    vendorCount: 0,
    fraudAttempts: 0,
    sustainabilityScore: 0,
    totalExpenses: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  return newEvent;
};

export const validateEventData = (eventData) => {
  const errors = [];

  if (!eventData.name || eventData.name.trim() === '') {
    errors.push('Event name is required');
  }

  if (!eventData.type) {
    errors.push('Event type is required');
  }

  if (!eventData.location || eventData.location.trim() === '') {
    errors.push('Location is required');
  }

  if (!eventData.date) {
    errors.push('Date is required');
  }

  if (!eventData.time) {
    errors.push('Time is required');
  }

  if (!eventData.capacity || parseInt(eventData.capacity) <= 0) {
    errors.push('Capacity must be greater than 0');
  }

  if (!eventData.baseBudget || parseFloat(eventData.baseBudget) <= 0) {
    errors.push('Base budget must be greater than 0');
  }

  return errors;
};

export const getEventSummary = (event) => {
  return {
    capacityUsage: calculateCapacityUsage(event),
    budgetUsage: calculateEventBudgetUsage(event),
    ticketsRemaining: event.capacity - event.ticketsSold,
    checkInRate: event.ticketsSold > 0 ? (event.ticketsCheckedIn / event.ticketsSold) * 100 : 0,
    revenue: event.ticketsSold * event.ticketPrice,
    projectedRevenue: event.capacity * event.ticketPrice,
    isOverBudget: calculateEventBudgetUsage(event) > 100,
    isNearCapacity: calculateCapacityUsage(event) > 90,
    hasFraudAlerts: event.fraudAttempts > 0
  };
};
