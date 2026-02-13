// Mock data for FestFiti MVP - Simulated backend database

export const mockEventDetails = {
  id: "FEST2024",
  name: "Nairobi Music Festival 2024",
  date: "2024-03-15",
  venue: "Kenyatta International Convention Centre",
  capacity: 5000,
  expectedAttendance: 4500,
  status: "active"
};

export const mockTickets = [
  // Valid tickets (unused)
  { id: "TKT001", qrCode: "QR001", status: "unused", attendeeName: "John Doe", email: "john@example.com", type: "VIP" },
  { id: "TKT002", qrCode: "QR002", status: "unused", attendeeName: "Jane Smith", email: "jane@example.com", type: "Regular" },
  { id: "TKT003", qrCode: "QR003", status: "unused", attendeeName: "Mike Johnson", email: "mike@example.com", type: "Regular" },
  { id: "TKT004", qrCode: "QR004", status: "unused", attendeeName: "Sarah Williams", email: "sarah@example.com", type: "VIP" },
  { id: "TKT005", qrCode: "QR005", status: "unused", attendeeName: "David Brown", email: "david@example.com", type: "Regular" },
  
  // Used tickets (already checked in)
  { id: "TKT006", qrCode: "QR006", status: "used", attendeeName: "Alice Davis", email: "alice@example.com", type: "Regular", checkedInAt: "2024-03-15T10:30:00Z" },
  { id: "TKT007", qrCode: "QR007", status: "used", attendeeName: "Bob Wilson", email: "bob@example.com", type: "VIP", checkedInAt: "2024-03-15T11:15:00Z" },
  { id: "TKT008", qrCode: "QR008", status: "used", attendeeName: "Carol Martinez", email: "carol@example.com", type: "Regular", checkedInAt: "2024-03-15T12:00:00Z" },
  
  // More unused tickets for testing
  { id: "TKT009", qrCode: "QR009", status: "unused", attendeeName: "Tom Anderson", email: "tom@example.com", type: "Regular" },
  { id: "TKT010", qrCode: "QR010", status: "unused", attendeeName: "Lisa Thompson", email: "lisa@example.com", type: "VIP" },
];

export const mockVendors = [
  {
    id: "VND001",
    name: "Safari Catering Co.",
    category: "Catering",
    cost: 150000,
    reliabilityScore: 92,
    sustainabilityScore: 85,
    riskLevel: "low",
    deliveryDate: "2024-03-14",
    status: "confirmed"
  },
  {
    id: "VND002",
    name: "SecureGuard Security",
    category: "Security",
    cost: 80000,
    reliabilityScore: 88,
    sustainabilityScore: 70,
    riskLevel: "low",
    deliveryDate: "2024-03-15",
    status: "confirmed"
  },
  {
    id: "VND003",
    name: "Thunder Sound Systems",
    category: "Stage & Sound",
    cost: 200000,
    reliabilityScore: 65,
    sustainabilityScore: 60,
    riskLevel: "medium",
    deliveryDate: "2024-03-15",
    status: "at_risk"
  },
  {
    id: "VND004",
    name: "EcoEvent Logistics",
    category: "Logistics",
    cost: 75000,
    reliabilityScore: 95,
    sustainabilityScore: 95,
    riskLevel: "low",
    deliveryDate: "2024-03-13",
    status: "completed"
  },
  {
    id: "VND005",
    name: "Budget Lighting Co.",
    category: "Stage & Sound",
    cost: 60000,
    reliabilityScore: 45,
    sustainabilityScore: 40,
    riskLevel: "high",
    deliveryDate: "2024-03-15",
    status: "delayed"
  },
  {
    id: "VND006",
    name: "Green Waste Management",
    category: "Sustainability",
    cost: 25000,
    reliabilityScore: 90,
    sustainabilityScore: 98,
    riskLevel: "low",
    deliveryDate: "2024-03-16",
    status: "confirmed"
  }
];

export const mockBudget = {
  total: 800000,
  used: 590000,
  remaining: 210000,
  categories: {
    catering: { allocated: 200000, used: 150000, percentage: 75 },
    security: { allocated: 100000, used: 80000, percentage: 80 },
    stageSound: { allocated: 300000, used: 260000, percentage: 87 },
    logistics: { allocated: 120000, used: 75000, percentage: 63 },
    sustainability: { allocated: 50000, used: 25000, percentage: 50 },
    contingency: { allocated: 30000, used: 0, percentage: 0 }
  },
  alerts: [
    { category: "stageSound", message: "Stage & Sound budget at 87% capacity", severity: "warning" },
    { category: "logistics", message: "Logistics spending within limits", severity: "success" }
  ]
};

export const mockFraudLogs = [
  {
    id: "FRD001",
    ticketId: "TKT006",
    qrCode: "QR006",
    attemptTime: "2024-03-15T14:30:00Z",
    reason: "duplicate_scan",
    location: "Main Entrance",
    status: "flagged"
  },
  {
    id: "FRD002",
    ticketId: "UNKNOWN001",
    qrCode: "INVALID001",
    attemptTime: "2024-03-15T15:15:00Z",
    reason: "invalid_ticket",
    location: "VIP Entrance",
    status: "blocked"
  },
  {
    id: "FRD003",
    ticketId: "TKT007",
    qrCode: "QR007",
    attemptTime: "2024-03-15T16:00:00Z",
    reason: "duplicate_scan",
    location: "Main Entrance",
    status: "flagged"
  }
];

export const mockSustainabilityMetrics = {
  predictedWaste: 850, // kg
  actualWaste: 720, // kg (mock actual data)
  wasteReduction: 15.3, // percentage
  ecoVendorPercentage: 67,
  sustainabilityScore: 78,
  carbonFootprint: 2.4, // tons CO2
  recyclingRate: 82,
  vendorEcoRatings: [
    { vendorId: "VND001", name: "Safari Catering Co.", rating: 85 },
    { vendorId: "VND002", name: "SecureGuard Security", rating: 70 },
    { vendorId: "VND003", name: "Thunder Sound Systems", rating: 60 },
    { vendorId: "VND004", name: "EcoEvent Logistics", rating: 95 },
    { vendorId: "VND005", name: "Budget Lighting Co.", rating: 40 },
    { vendorId: "VND006", name: "Green Waste Management", rating: 98 }
  ]
};

export const mockTicketSales = [
  { date: "2024-02-01", sales: 120 },
  { date: "2024-02-05", sales: 200 },
  { date: "2024-02-10", sales: 350 },
  { date: "2024-02-15", sales: 500 },
  { date: "2024-02-20", sales: 750 },
  { date: "2024-02-25", sales: 980 },
  { date: "2024-03-01", sales: 1200 },
  { date: "2024-03-05", sales: 1450 },
  { date: "2024-03-10", sales: 1680 },
  { date: "2024-03-14", sales: 1890 }
];

export const mockCheckInLogs = [
  { ticketId: "TKT006", attendeeName: "Alice Davis", checkInTime: "2024-03-15T10:30:00Z", entrance: "Main" },
  { ticketId: "TKT007", attendeeName: "Bob Wilson", checkInTime: "2024-03-15T11:15:00Z", entrance: "VIP" },
  { ticketId: "TKT008", attendeeName: "Carol Martinez", checkInTime: "2024-03-15T12:00:00Z", entrance: "Main" }
];

// Export all data as a single object for easy import
export const mockData = {
  eventDetails: mockEventDetails,
  tickets: mockTickets,
  vendors: mockVendors,
  budget: mockBudget,
  fraudLogs: mockFraudLogs,
  sustainabilityMetrics: mockSustainabilityMetrics,
  ticketSales: mockTicketSales,
  checkInLogs: mockCheckInLogs
};
