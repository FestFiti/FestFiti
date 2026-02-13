import { mockTickets, mockFraudLogs, mockCheckInLogs } from '../data/mockData.js';

// Ticket validation logic
export const validateTicket = (qrCode) => {
  const ticket = mockTickets.find(t => t.qrCode === qrCode);
  
  if (!ticket) {
    return {
      isValid: false,
      status: 'INVALID',
      message: 'Ticket not found in system',
      ticket: null,
      fraudReason: 'invalid_ticket'
    };
  }
  
  if (ticket.status === 'used') {
    // Create fraud log entry
    const fraudLog = {
      id: `FRD${Date.now()}`,
      ticketId: ticket.id,
      qrCode: ticket.qrCode,
      attemptTime: new Date().toISOString(),
      reason: 'duplicate_scan',
      location: 'Main Entrance',
      status: 'flagged'
    };
    
    return {
      isValid: false,
      status: 'DUPLICATE',
      message: 'Ticket has already been used',
      ticket: ticket,
      fraudReason: 'duplicate_scan',
      fraudLog: fraudLog
    };
  }
  
  // Valid ticket - mark as used
  ticket.status = 'used';
  ticket.checkedInAt = new Date().toISOString();
  
  const checkInLog = {
    ticketId: ticket.id,
    attendeeName: ticket.attendeeName,
    checkInTime: ticket.checkedInAt,
    entrance: 'Main'
  };
  
  return {
    isValid: true,
    status: 'VALID',
    message: 'Ticket validated successfully',
    ticket: ticket,
    checkInLog: checkInLog
  };
};

// Get ticket statistics
export const getTicketStats = () => {
  const totalTickets = mockTickets.length;
  const usedTickets = mockTickets.filter(t => t.status === 'used').length;
  const unusedTickets = totalTickets - usedTickets;
  const duplicateAttempts = mockFraudLogs.filter(f => f.reason === 'duplicate_scan').length;
  const invalidAttempts = mockFraudLogs.filter(f => f.reason === 'invalid_ticket').length;
  
  return {
    totalTickets,
    usedTickets,
    unusedTickets,
    duplicateAttempts,
    invalidAttempts,
    checkInRate: ((usedTickets / totalTickets) * 100).toFixed(1),
    fraudAttempts: duplicateAttempts + invalidAttempts
  };
};

// Get capacity information
export const getCapacityInfo = (eventCapacity) => {
  const stats = getTicketStats();
  const capacityPercentage = (stats.usedTickets / eventCapacity) * 100;
  
  let capacityStatus = 'normal';
  if (capacityPercentage >= 90) capacityStatus = 'critical';
  else if (capacityPercentage >= 70) capacityStatus = 'warning';
  
  return {
    currentAttendance: stats.usedTickets,
    capacity: eventCapacity,
    percentage: capacityPercentage.toFixed(1),
    status: capacityStatus,
    remaining: eventCapacity - stats.usedTickets
  };
};

// Get recent check-ins
export const getRecentCheckIns = (limit = 10) => {
  return mockCheckInLogs
    .sort((a, b) => new Date(b.checkInTime) - new Date(a.checkInTime))
    .slice(0, limit);
};

// Get fraud alerts
export const getFraudAlerts = () => {
  return mockFraudLogs
    .sort((a, b) => new Date(b.attemptTime) - new Date(a.attemptTime))
    .slice(0, 5);
};

// Search tickets by attendee name or email
export const searchTickets = (query) => {
  const lowerQuery = query.toLowerCase();
  return mockTickets.filter(ticket => 
    ticket.attendeeName.toLowerCase().includes(lowerQuery) ||
    ticket.email.toLowerCase().includes(lowerQuery) ||
    ticket.id.toLowerCase().includes(lowerQuery)
  );
};

// Get tickets by type
export const getTicketsByType = () => {
  const ticketsByType = {};
  
  mockTickets.forEach(ticket => {
    if (!ticketsByType[ticket.type]) {
      ticketsByType[ticket.type] = { total: 0, used: 0 };
    }
    ticketsByType[ticket.type].total++;
    if (ticket.status === 'used') {
      ticketsByType[ticket.type].used++;
    }
  });
  
  return ticketsByType;
};
