import { getTicketStats, getCapacityInfo } from './ticketUtils.js';
import { getBudgetOverview, generateFinancialAlerts } from './budgetUtils.js';
import { mockVendors, mockSustainabilityMetrics, mockEventDetails } from '../data/mockData.js';

// FestBuddy AI response generator
export const generateAIResponse = (userMessage) => {
  const message = userMessage.toLowerCase();
  
  // Ticket-related queries
  if (message.includes('ticket') || message.includes('sold') || message.includes('sales')) {
    if (message.includes('how many') || message.includes('count')) {
      const stats = getTicketStats();
      return {
        type: 'ticket_stats',
        message: `We've sold ${stats.totalTickets} tickets so far. ${stats.usedTickets} guests have checked in (${stats.checkInRate}% check-in rate).`,
        data: stats
      };
    }
  }
  
  // Budget-related queries
  if (message.includes('budget') || message.includes('spending') || message.includes('cost')) {
    if (message.includes('over') || message.includes('exceed')) {
      const overview = getBudgetOverview();
      const alerts = generateFinancialAlerts();
      
      if (overview.status === 'critical' || overview.status === 'warning') {
        return {
          type: 'budget_warning',
          message: `⚠️ Yes, we need to monitor our budget. We've used ${overview.usagePercentage}% of our total budget (KES ${overview.used.toLocaleString()} of KES ${overview.total.toLocaleString()}).`,
          data: { overview, alerts }
        };
      } else {
        return {
          type: 'budget_status',
          message: `✅ Our budget is healthy. We've used ${overview.usagePercentage}% of our total budget (KES ${overview.used.toLocaleString()} of KES ${overview.total.toLocaleString()}).`,
          data: overview
        };
      }
    }
    
    const overview = getBudgetOverview();
    return {
      type: 'budget_overview',
      message: `Current budget status: KES ${overview.used.toLocaleString()} used of KES ${overview.total.toLocaleString()} total (${overview.usagePercentage}%). KES ${overview.remaining.toLocaleString()} remaining.`,
      data: overview
    };
  }
  
  // Fraud-related queries
  if (message.includes('fraud') || message.includes('fake') || message.includes('duplicate')) {
    const stats = getTicketStats();
    if (stats.fraudAttempts > 0) {
      return {
        type: 'fraud_alert',
        message: `⚠️ Yes, we've detected ${stats.fraudAttempts} fraud attempts: ${stats.duplicateAttempts} duplicate scans and ${stats.invalidAttempts} invalid tickets. TicketGuard is working properly.`,
        data: { fraudAttempts: stats.fraudAttempts, duplicateAttempts: stats.duplicateAttempts, invalidAttempts: stats.invalidAttempts }
      };
    } else {
      return {
        type: 'fraud_status',
        message: `✅ No fraud attempts detected so far. TicketGuard is keeping your event secure.`,
        data: { fraudAttempts: 0 }
      };
    }
  }
  
  // Vendor-related queries
  if (message.includes('vendor') || message.includes('supplier')) {
    if (message.includes('risk') || message.includes('risky') || message.includes('problem')) {
      const riskyVendors = mockVendors.filter(v => v.riskLevel === 'high' || v.riskLevel === 'medium');
      if (riskyVendors.length > 0) {
        const vendorList = riskyVendors.map(v => `${v.name} (${v.riskLevel} risk)`).join(', ');
        return {
          type: 'vendor_risk',
          message: `⚠️ ${riskyVendors.length} vendors need attention: ${vendorList}. I recommend contacting them immediately.`,
          data: riskyVendors
        };
      }
    }
    
    const reliableVendors = mockVendors.filter(v => v.reliabilityScore >= 80).length;
    return {
      type: 'vendor_status',
      message: `We have ${mockVendors.length} vendors contracted. ${reliableVendors} have high reliability scores (80%+). Most vendors are performing well.`,
      data: { total: mockVendors.length, reliable: reliableVendors }
    };
  }
  
  // Attendance/prediction queries
  if (message.includes('attendance') || message.includes('predict') || message.includes('expect')) {
    const capacity = getCapacityInfo(mockEventDetails.capacity);
    const stats = getTicketStats();
    
    return {
      type: 'attendance_prediction',
      message: `Based on current sales, I predict ${stats.totalTickets} attendees (${((stats.totalTickets / mockEventDetails.capacity) * 100).toFixed(1)}% of capacity). Current check-in: ${capacity.currentAttendance}.`,
      data: { predicted: stats.totalTickets, capacity: mockEventDetails.capacity, currentCheckIn: capacity.currentAttendance }
    };
  }
  
  // Sustainability queries
  if (message.includes('sustainability') || message.includes('waste') || message.includes('eco')) {
    const metrics = mockSustainabilityMetrics;
    return {
      type: 'sustainability',
      message: `Our sustainability score is ${metrics.sustainabilityScore}/100. We've reduced waste by ${metrics.wasteReduction}% and ${metrics.ecoVendorPercentage}% of our vendors are eco-certified.`,
      data: metrics
    };
  }
  
  // Event status queries
  if (message.includes('status') || message.includes('how') || message.includes('overview')) {
    const stats = getTicketStats();
    const budget = getBudgetOverview();
    const capacity = getCapacityInfo(mockEventDetails.capacity);
    
    return {
      type: 'event_overview',
      message: `🎉 Event is running smoothly! ${stats.usedTickets} guests checked in, ${budget.usagePercentage}% budget used, ${capacity.percentage}% capacity filled. ${stats.fraudAttempts} fraud attempts blocked.`,
      data: { stats, budget, capacity }
    };
  }
  
  // Default response
  return {
    type: 'general',
    message: `I can help you with ticket sales, budget status, fraud detection, vendor management, attendance predictions, and sustainability metrics. What would you like to know about ${mockEventDetails.name}?`,
    suggestions: [
      "How many tickets have been sold?",
      "Are we over budget?",
      "Is there any ticket fraud?",
      "Which vendor is risky?",
      "What is the predicted attendance?"
    ]
  };
};

// Get suggested quick prompts for the chat interface
export const getQuickPrompts = () => [
  "How many tickets have been sold?",
  "Are we over budget?",
  "Is there any ticket fraud?",
  "Which vendor is risky?",
  "What is the predicted attendance?",
  "Show sustainability metrics",
  "What's the event status?",
  "Any vendor issues?"
];

// Simulate typing delay for chat experience
export const simulateTypingDelay = () => {
  return new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1500));
};

// Format AI response for display
export const formatAIResponse = (response) => {
  const timestamp = new Date().toLocaleTimeString();
  
  return {
    id: `ai_${Date.now()}`,
    type: 'ai',
    content: response.message,
    timestamp,
    dataType: response.type,
    data: response.data || null,
    suggestions: response.suggestions || []
  };
};

// Get contextual help based on current page
export const getContextualHelp = (currentPage) => {
  const helpMessages = {
    dashboard: "This is your command center. You can see real-time metrics, ticket sales trends, and quick alerts here.",
    ticketguard: "TicketGuard prevents fraud by validating each ticket. Scan QR codes to check in guests and detect duplicates.",
    vendors: "Monitor your vendor performance here. Watch for reliability scores and risk indicators.",
    budget: "Track your event spending across all categories. Set alerts to prevent overruns.",
    sustainability: "Measure your event's environmental impact. Track waste reduction and eco-vendor performance.",
    festbuddy: "I'm FestBuddy! Ask me anything about your event using natural language."
  };
  
  return helpMessages[currentPage] || "How can I help you manage your event today?";
};
