// Budget Tracking Utilities for FestHub
// Comprehensive financial management system

// Mock budget data structure
const mockBudgetData = {
  eventId: "EVT-001",
  totalBudget: 1000000,
  categories: [
    {
      name: "Catering",
      allocated: 300000,
      spent: 345000,
      vendors: [
        { name: "Nairobi Caterers", cost: 200000, paymentStatus: "paid" },
        { name: "Food Trucks Ltd", cost: 145000, paymentStatus: "partially_paid" }
      ]
    },
    {
      name: "Security",
      allocated: 150000,
      spent: 120000,
      vendors: [
        { name: "SecureGuard Services", cost: 120000, paymentStatus: "paid" }
      ]
    },
    {
      name: "Stage & Sound",
      allocated: 250000,
      spent: 200000,
      vendors: [
        { name: "Audio Pro Kenya", cost: 150000, paymentStatus: "paid" },
        { name: "Stage Builders", cost: 50000, paymentStatus: "pending" }
      ]
    },
    {
      name: "Marketing",
      allocated: 100000,
      spent: 85000,
      vendors: [
        { name: "Digital Ads Agency", cost: 60000, paymentStatus: "paid" },
        { name: "Print Media", cost: 25000, paymentStatus: "pending" }
      ]
    },
    {
      name: "Logistics",
      allocated: 120000,
      spent: 95000,
      vendors: [
        { name: "Transport Co", cost: 70000, paymentStatus: "paid" },
        { name: "Storage Solutions", cost: 25000, paymentStatus: "pending" }
      ]
    },
    {
      name: "Contingency",
      allocated: 80000,
      spent: 15000,
      vendors: []
    }
  ],
  ticketRevenue: 6400000,
  totalExpenses: 665000,
  netPosition: 5735000
};

// Calculate total expenses
export const calculateTotalExpenses = (budget = mockBudgetData) => {
  return budget.categories.reduce((total, category) => total + category.spent, 0);
};

// Calculate remaining budget
export const calculateRemainingBudget = (budget = mockBudgetData) => {
  return budget.totalBudget - calculateTotalExpenses(budget);
};

// Calculate category usage percentage
export const calculateCategoryUsage = (category) => {
  return (category.spent / category.allocated) * 100;
};

// Calculate revenue from ticket sales
export const calculateRevenue = (ticketsSold, ticketPrice) => {
  return ticketsSold * ticketPrice;
};

// Detect budget overrun
export const detectBudgetOverrun = (budget = mockBudgetData) => {
  const totalExpenses = calculateTotalExpenses(budget);
  return {
    isOverBudget: totalExpenses > budget.totalBudget,
    overrunAmount: Math.max(0, totalExpenses - budget.totalBudget),
    overrunPercentage: ((totalExpenses - budget.totalBudget) / budget.totalBudget) * 100
  };
};

// Generate AI-powered financial alerts
export const generateFinancialAlerts = (budget = mockBudgetData, ticketsSold = 1422) => {
  const alerts = [];
  const overrun = detectBudgetOverrun(budget);
  
  // Check category overruns
  budget.categories.forEach(category => {
    const usage = calculateCategoryUsage(category);
    if (usage > 100) {
      alerts.push({
        type: 'category_overrun',
        severity: 'danger',
        category: category.name,
        message: `${category.name} costs exceed allocation by ${(usage - 100).toFixed(1)}%`,
        recommendation: `Consider reducing ${category.name} expenses or reallocating budget`,
        impact: 'high'
      });
    } else if (usage > 90) {
      alerts.push({
        type: 'category_warning',
        severity: 'warning',
        category: category.name,
        message: `${category.name} budget at ${usage.toFixed(1)}% capacity`,
        recommendation: `Monitor ${category.name} spending closely`,
        impact: 'medium'
      });
    }
  });
  
  // Total budget alerts
  if (overrun.isOverBudget) {
    alerts.push({
      type: 'total_overrun',
      severity: 'danger',
      category: 'Total Budget',
      message: `Event budget exceeded by KES ${overrun.overrunAmount.toLocaleString()}`,
      recommendation: 'Immediate cost reduction required',
      impact: 'critical'
    });
  }
  
  // Ticket sales impact alerts
  const revenue = calculateRevenue(ticketsSold, 5000); // Assuming KES 5000 ticket price
  
  if (ticketsSold > 2000) {
    alerts.push({
      type: 'ticket_surge',
      severity: 'info',
      category: 'Revenue',
      message: `High ticket sales detected: ${ticketsSold} tickets sold`,
      recommendation: 'Consider increasing security and logistics budget',
      impact: 'positive'
    });
  }
  
  // Profit/Loss projection
  const netPosition = revenue - budget.totalExpenses;
  if (netPosition < 0) {
    alerts.push({
      type: 'loss_projection',
      severity: 'danger',
      category: 'Financial',
      message: `Event projected to lose KES ${Math.abs(netPosition).toLocaleString()}`,
      recommendation: 'Reduce expenses or increase ticket prices',
      impact: 'critical'
    });
  }
  
  return alerts;
};

// Get budget overview with KPIs
export const getBudgetOverview = (budget = mockBudgetData, ticketsSold = 1422) => {
  const totalExpenses = calculateTotalExpenses(budget);
  const remainingBudget = calculateRemainingBudget(budget);
  const revenue = calculateRevenue(ticketsSold, 5000);
  const netPosition = revenue - totalExpenses;
  const usagePercentage = (totalExpenses / budget.totalBudget) * 100;
  
  return {
    totalBudget: budget.totalBudget,
    totalExpenses,
    remainingBudget,
    estimatedProfit: netPosition,
    usagePercentage,
    revenue,
    netPosition,
    status: usagePercentage > 90 ? 'critical' : usagePercentage > 75 ? 'warning' : 'healthy'
  };
};

// Get detailed category breakdown
export const getCategoryBreakdown = (budget = mockBudgetData) => {
  return budget.categories.map(category => ({
    name: category.name,
    allocated: category.allocated,
    spent: category.spent,
    remaining: category.allocated - category.spent,
    usagePercentage: calculateCategoryUsage(category),
    status: calculateCategoryUsage(category) > 100 ? 'over' : 
             calculateCategoryUsage(category) > 90 ? 'critical' : 
             calculateCategoryUsage(category) > 75 ? 'warning' : 'healthy',
    vendors: category.vendors || [],
    paymentProgress: calculatePaymentProgress(category.vendors || [])
  }));
};

// Calculate vendor payment progress
export const calculatePaymentProgress = (vendors) => {
  if (!vendors || vendors.length === 0) return 0;
  
  const totalCost = vendors.reduce((sum, vendor) => sum + vendor.cost, 0);
  const paidAmount = vendors
    .filter(v => v.paymentStatus === 'paid')
    .reduce((sum, vendor) => sum + vendor.cost, 0);
  
  return (paidAmount / totalCost) * 100;
};

// Simulate budget adjustment based on ticket sales
export const adjustBudgetForTicketSales = (budget = mockBudgetData, ticketsSold) => {
  const capacity = 3000; // Event capacity
  const ticketPercentage = (ticketsSold / capacity) * 100;
  
  let adjustedCategories = [...budget.categories];
  
  // Dynamic adjustment rules
  if (ticketPercentage > 80) {
    // Increase security by 10% for high attendance
    const securityCategory = adjustedCategories.find(cat => cat.name === 'Security');
    if (securityCategory) {
      securityCategory.allocated *= 1.1;
    }
  }
  
  if (ticketPercentage > 60) {
    // Increase catering proportionally
    const cateringCategory = adjustedCategories.find(cat => cat.name === 'Catering');
    if (cateringCategory) {
      const increase = (ticketPercentage - 60) * 0.02; // 2% per percentage point over 60%
      cateringCategory.allocated *= (1 + increase);
    }
  }
  
  // Recalculate total budget
  const newTotalBudget = adjustedCategories.reduce((sum, cat) => sum + cat.allocated, 0);
  
  return {
    ...budget,
    categories: adjustedCategories,
    totalBudget: newTotalBudget
  };
};

// Generate financial activity log
export const generateFinancialActivityLog = (budget = mockBudgetData) => {
  const activities = [];
  
  // Add vendor payment activities
  budget.categories.forEach(category => {
    if (category.vendors) {
      category.vendors.forEach(vendor => {
        activities.push({
          id: `vendor-${vendor.name.replace(/\s+/g, '-')}`,
          timestamp: new Date().toISOString(),
          type: 'vendor_payment',
          category: category.name,
          description: `${vendor.name} payment status: ${vendor.paymentStatus.replace('_', ' ')}`,
          amount: vendor.cost,
          status: vendor.paymentStatus
        });
      });
    }
  });
  
  // Add budget alerts
  const alerts = generateFinancialAlerts(budget);
  alerts.forEach(alert => {
    activities.push({
      id: `alert-${alert.type}`,
      timestamp: new Date().toISOString(),
      type: 'budget_alert',
      category: alert.category,
      description: alert.message,
      severity: alert.severity,
      impact: alert.impact
    });
  });
  
  return activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
};

// Get milestone payment schedule
export const getMilestonePayments = (budget = mockBudgetData) => {
  const milestones = [];
  
  budget.categories.forEach(category => {
    if (category.vendors && category.vendors.length > 0) {
      category.vendors.forEach(vendor => {
        const totalCost = vendor.cost;
        milestones.push({
          vendorName: vendor.name,
          category: category.name,
          totalCost,
          milestones: [
            {
              name: 'Deposit',
              percentage: 30,
              amount: totalCost * 0.3,
              status: 'completed',
              dueDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
              name: 'Progress Payment',
              percentage: 40,
              amount: totalCost * 0.4,
              status: vendor.paymentStatus === 'partially_paid' ? 'completed' : 'pending',
              dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
              name: 'Final Payment',
              percentage: 30,
              amount: totalCost * 0.3,
              status: vendor.paymentStatus === 'paid' ? 'completed' : 'pending',
              dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
            }
          ]
        });
      });
    }
  });
  
  return milestones;
};

// Get budget health score
export const getBudgetHealthScore = (budget = mockBudgetData) => {
  const overview = getBudgetOverview(budget);
  const categoryBreakdown = getCategoryBreakdown(budget);
  
  let score = 100;
  
  // Deduct points for overruns
  const overrunCategories = categoryBreakdown.filter(cat => cat.status === 'over').length;
  score -= overrunCategories * 20;
  
  // Deduct points for critical categories
  const criticalCategories = categoryBreakdown.filter(cat => cat.status === 'critical').length;
  score -= criticalCategories * 10;
  
  // Deduct points for overall budget status
  if (overview.status === 'critical') score -= 15;
  else if (overview.status === 'warning') score -= 5;
  
  return Math.max(0, score);
};

// Export mock data for development
export { mockBudgetData };
