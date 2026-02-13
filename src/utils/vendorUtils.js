import { mockVendors } from '../data/mockData.js';

// Get vendor statistics
export const getVendorStats = () => {
  const totalVendors = mockVendors.length;
  const lowRiskVendors = mockVendors.filter(v => v.riskLevel === 'low').length;
  const mediumRiskVendors = mockVendors.filter(v => v.riskLevel === 'medium').length;
  const highRiskVendors = mockVendors.filter(v => v.riskLevel === 'high').length;
  const averageReliability = mockVendors.reduce((sum, v) => sum + v.reliabilityScore, 0) / totalVendors;
  const averageSustainability = mockVendors.reduce((sum, v) => sum + v.sustainabilityScore, 0) / totalVendors;
  
  return {
    totalVendors,
    riskDistribution: {
      low: lowRiskVendors,
      medium: mediumRiskVendors,
      high: highRiskVendors
    },
    averageReliability: averageReliability.toFixed(1),
    averageSustainability: averageSustainability.toFixed(1),
    riskPercentage: ((highRiskVendors / totalVendors) * 100).toFixed(1)
  };
};

// Get vendors by category
export const getVendorsByCategory = () => {
  const categories = {};
  
  mockVendors.forEach(vendor => {
    if (!categories[vendor.category]) {
      categories[vendor.category] = [];
    }
    categories[vendor.category].push(vendor);
  });
  
  // Calculate category stats
  Object.keys(categories).forEach(category => {
    const vendors = categories[category];
    categories[category] = {
      vendors,
      totalCost: vendors.reduce((sum, v) => sum + v.cost, 0),
      averageReliability: (vendors.reduce((sum, v) => sum + v.reliabilityScore, 0) / vendors.length).toFixed(1),
      riskCount: vendors.filter(v => v.riskLevel !== 'low').length,
      averageSustainability: (vendors.reduce((sum, v) => sum + v.sustainabilityScore, 0) / vendors.length).toFixed(1)
    };
  });
  
  return categories;
};

// Get at-risk vendors
export const getAtRiskVendors = () => {
  return mockVendors
    .filter(vendor => vendor.riskLevel === 'high' || vendor.riskLevel === 'medium')
    .sort((a, b) => {
      // Sort by risk level first, then by reliability score
      const riskOrder = { high: 3, medium: 2, low: 1 };
      if (riskOrder[b.riskLevel] !== riskOrder[a.riskLevel]) {
        return riskOrder[b.riskLevel] - riskOrder[a.riskLevel];
      }
      return a.reliabilityScore - b.reliabilityScore;
    });
};

// Get vendor performance metrics
export const getVendorPerformance = (vendorId) => {
  const vendor = mockVendors.find(v => v.id === vendorId);
  if (!vendor) return null;
  
  const performanceGrade = getPerformanceGrade(vendor.reliabilityScore, vendor.sustainabilityScore);
  const riskAssessment = getRiskAssessment(vendor);
  
  return {
    ...vendor,
    performanceGrade,
    riskAssessment,
    recommendations: getVendorRecommendations(vendor)
  };
};

// Calculate performance grade
const getPerformanceGrade = (reliability, sustainability) => {
  const average = (reliability + sustainability) / 2;
  
  if (average >= 90) return { grade: 'A+', color: 'green', description: 'Excellent' };
  if (average >= 80) return { grade: 'A', color: 'green', description: 'Very Good' };
  if (average >= 70) return { grade: 'B', color: 'blue', description: 'Good' };
  if (average >= 60) return { grade: 'C', color: 'yellow', description: 'Average' };
  if (average >= 50) return { grade: 'D', color: 'orange', description: 'Below Average' };
  return { grade: 'F', color: 'red', description: 'Poor' };
};

// Get risk assessment
const getRiskAssessment = (vendor) => {
  const factors = [];
  
  if (vendor.reliabilityScore < 60) {
    factors.push({ type: 'reliability', severity: 'high', message: 'Low reliability score' });
  } else if (vendor.reliabilityScore < 80) {
    factors.push({ type: 'reliability', severity: 'medium', message: 'Moderate reliability score' });
  }
  
  if (vendor.sustainabilityScore < 50) {
    factors.push({ type: 'sustainability', severity: 'medium', message: 'Low sustainability score' });
  }
  
  if (vendor.status === 'delayed') {
    factors.push({ type: 'delivery', severity: 'high', message: 'Delivery delayed' });
  } else if (vendor.status === 'at_risk') {
    factors.push({ type: 'delivery', severity: 'medium', message: 'Delivery at risk' });
  }
  
  const overallRisk = factors.length === 0 ? 'low' : 
                      factors.some(f => f.severity === 'high') ? 'high' : 'medium';
  
  return {
    level: overallRisk,
    factors,
    recommendation: overallRisk === 'high' ? 'Immediate attention required' :
                     overallRisk === 'medium' ? 'Monitor closely' : 'On track'
  };
};

// Get vendor recommendations
const getVendorRecommendations = (vendor) => {
  const recommendations = [];
  
  if (vendor.reliabilityScore < 70) {
    recommendations.push({
      type: 'performance',
      priority: 'high',
      message: 'Consider backup vendor due to reliability concerns'
    });
  }
  
  if (vendor.sustainabilityScore < 60) {
    recommendations.push({
      type: 'sustainability',
      priority: 'medium',
      message: 'Request sustainability improvements or consider alternatives'
    });
  }
  
  if (vendor.status === 'delayed') {
    recommendations.push({
      type: 'delivery',
      priority: 'high',
      message: 'Contact immediately to resolve delivery delays'
    });
  }
  
  if (vendor.riskLevel === 'medium') {
    recommendations.push({
      type: 'monitoring',
      priority: 'medium',
      message: 'Increase monitoring and communication frequency'
    });
  }
  
  return recommendations;
};

// Get vendor cost analysis
export const getVendorCostAnalysis = () => {
  const totalCost = mockVendors.reduce((sum, v) => sum + v.cost, 0);
  const categoryBreakdown = {};
  
  mockVendors.forEach(vendor => {
    if (!categoryBreakdown[vendor.category]) {
      categoryBreakdown[vendor.category] = { total: 0, count: 0, vendors: [] };
    }
    categoryBreakdown[vendor.category].total += vendor.cost;
    categoryBreakdown[vendor.category].count++;
    categoryBreakdown[vendor.category].vendors.push(vendor);
  });
  
  // Calculate percentages
  Object.keys(categoryBreakdown).forEach(category => {
    categoryBreakdown[category].percentage = ((categoryBreakdown[category].total / totalCost) * 100).toFixed(1);
    categoryBreakdown[category].averageCost = Math.round(categoryBreakdown[category].total / categoryBreakdown[category].count);
  });
  
  return {
    totalCost,
    categoryBreakdown,
    averageVendorCost: Math.round(totalCost / mockVendors.length)
  };
};

// Search vendors
export const searchVendors = (query) => {
  const lowerQuery = query.toLowerCase();
  return mockVendors.filter(vendor => 
    vendor.name.toLowerCase().includes(lowerQuery) ||
    vendor.category.toLowerCase().includes(lowerQuery) ||
    vendor.id.toLowerCase().includes(lowerQuery)
  );
};

// Get vendor timeline
export const getVendorTimeline = () => {
  const timeline = mockVendors
    .map(vendor => ({
      ...vendor,
      deliveryDate: new Date(vendor.deliveryDate),
      daysUntilDelivery: Math.ceil((new Date(vendor.deliveryDate) - new Date()) / (1000 * 60 * 60 * 24))
    }))
    .sort((a, b) => a.deliveryDate - b.deliveryDate);
  
  return timeline.map(vendor => ({
    id: vendor.id,
    name: vendor.name,
    category: vendor.category,
    deliveryDate: vendor.deliveryDate.toLocaleDateString(),
    daysUntilDelivery: vendor.daysUntilDelivery,
    status: vendor.daysUntilDelivery < 0 ? 'overdue' : 
            vendor.daysUntilDelivery <= 3 ? 'urgent' : 
            vendor.daysUntilDelivery <= 7 ? 'soon' : 'ontrack',
    riskLevel: vendor.riskLevel
  }));
};

// Get top performing vendors
export const getTopPerformingVendors = (limit = 5) => {
  return mockVendors
    .map(vendor => ({
      ...vendor,
      performanceScore: (vendor.reliabilityScore + vendor.sustainabilityScore) / 2
    }))
    .sort((a, b) => b.performanceScore - a.performanceScore)
    .slice(0, limit);
};
