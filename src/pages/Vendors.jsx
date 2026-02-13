import React, { useState } from 'react';
import { useEvent } from '../context/eventHooks';
import VendorCard from '../components/VendorCard';
import { getVendorsByCategory } from '../utils/vendorUtils';
import { 
  Users, 
  AlertTriangle, 
  Check, 
  Star,
  Filter,
  Search,
  Plus,
  UserPlus
} from 'lucide-react';

const Vendors = () => {
  const { state } = useEvent();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showRiskOnly, setShowRiskOnly] = useState(false);
  const [activeTab, setActiveTab] = useState('directory');
  const [vendors, setVendors] = useState(state.vendors || []);
  const [vendorIdCounter, setVendorIdCounter] = useState(1000);

  const tabs = [
    { id: 'directory', name: 'Directory', icon: Users },
    { id: 'onboarding', name: 'Onboard Vendor', icon: UserPlus }
  ];

  // Generate unique vendor ID
  const generateVendorId = () => {
    const currentId = vendorIdCounter + 1;
    setVendorIdCounter(currentId);
    return `VND-${String(currentId).padStart(3, '0')}`;
  };

  // Handle vendor onboarding
  const handleOnboardVendor = (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const sustainabilityPractices = formData.getAll('sustainability');
    
    const newVendor = {
      id: generateVendorId(),
      name: formData.get('businessName'),
      contact: {
        name: formData.get('contactName'),
        phone: formData.get('phone'),
        email: formData.get('email')
      },
      category: formData.get('category'),
      serviceDescription: formData.get('serviceDescription'),
      averageCost: parseFloat(formData.get('averageCost')),
      sustainabilityScore: sustainabilityPractices.length * 20, // Each practice adds 20 points
      yearsExperience: parseInt(formData.get('yearsExperience')),
      insuranceVerified: formData.get('insurance') === 'on',
      reliabilityScore: 75, // Default score for new vendors
      pastDelays: 0,
      riskLevel: 'low',
      createdDate: new Date().toISOString()
    };

    setVendors([...vendors, newVendor]);
    
    // Show success message
    alert(`Vendor "${newVendor.name}" successfully onboarded!`);
    
    // Reset form
    e.target.reset();
  };

  const categories = getVendorsByCategory();
  
  let filteredVendors = vendors;

  // Filter by category
  if (selectedCategory !== 'all') {
    filteredVendors = filteredVendors.filter(vendor => vendor.category === selectedCategory);
  }

  // Filter by search
  if (searchQuery) {
    filteredVendors = filteredVendors.filter(vendor =>
      vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  // Filter by risk
  if (showRiskOnly) {
    filteredVendors = filteredVendors.filter(vendor => vendor.riskLevel !== 'low');
  }

  const categoryOptions = ['all', ...Object.keys(categories)];

  // Tab Components
  const renderDirectoryTab = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-sm font-medium text-blue-600">Total</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {vendors.length || 0}
          </div>
          <div className="text-sm text-gray-600">Total Vendors</div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <span className="text-sm font-medium text-red-600">Alert</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {vendors.filter(v => v.riskLevel === 'high').length}
          </div>
          <div className="text-sm text-gray-600">High Risk</div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
            </div>
            <span className="text-sm font-medium text-yellow-600">Warning</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {vendors.filter(v => v.riskLevel === 'medium').length}
          </div>
          <div className="text-sm text-gray-600">Medium Risk</div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Star className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-sm font-medium text-green-600">Good</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {Math.round(vendors.reduce((acc, v) => acc + v.reliabilityScore, 0) / vendors.length) || 0}%
          </div>
          <div className="text-sm text-gray-600">Avg Reliability</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          {/* Search */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search vendors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {categoryOptions.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
            </div>

            {/* Risk Filter */}
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showRiskOnly}
                onChange={(e) => setShowRiskOnly(e.target.checked)}
                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700">Show at-risk only</span>
            </label>
          </div>
        </div>
      </div>

      {/* Vendor Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVendors.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No vendors found</h3>
            <p className="text-gray-600">
              Try adjusting your filters or search criteria
            </p>
          </div>
        ) : (
          filteredVendors.map(vendor => (
            <VendorCard key={vendor.id} vendor={vendor} />
          ))
        )}
      </div>
    </div>
  );

  const renderOnboardingTab = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Vendor Onboarding</h2>
        <p className="text-gray-600">Add new vendors to your system</p>
      </div>
      
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <form onSubmit={handleOnboardVendor} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Name *
                </label>
                <input
                  type="text"
                  name="businessName"
                  placeholder="e.g., Elite Catering Services"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Person Name *
                </label>
                <input
                  type="text"
                  name="contactName"
                  placeholder="e.g., John Smith"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="0700123456"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="info@vendor.com"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vendor Category *
              </label>
              <select
                name="category"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Select Category</option>
                <option value="Catering">Catering</option>
                <option value="Security">Security</option>
                <option value="Stage & Sound">Stage & Sound</option>
                <option value="Decor">Decor</option>
                <option value="Photography">Photography</option>
                <option value="Transport">Transport</option>
                <option value="Cleaning">Cleaning</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service Description
              </label>
              <textarea
                name="serviceDescription"
                placeholder="Describe the services offered by this vendor"
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Average Service Cost (KES) *
                </label>
                <input
                  type="number"
                  name="averageCost"
                  placeholder="100000"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Years of Experience *
                </label>
                <input
                  type="number"
                  name="yearsExperience"
                  placeholder="5"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sustainability Practices
              </label>
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input type="checkbox" name="sustainability" value="recycling" className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500" />
                  <span className="text-sm text-gray-700">Uses recyclable materials</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" name="sustainability" value="energy" className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500" />
                  <span className="text-sm text-gray-700">Energy-efficient equipment</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" name="sustainability" value="local" className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500" />
                  <span className="text-sm text-gray-700">Sources locally</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" name="sustainability" value="waste" className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500" />
                  <span className="text-sm text-gray-700">Waste reduction practices</span>
                </label>
              </div>
            </div>

            <div>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="insurance"
                  value="on"
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">Insurance/Permit Verified</span>
              </label>
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
                Onboard Vendor
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'directory':
        return renderDirectoryTab();
      case 'onboarding':
        return renderOnboardingTab();
      default:
        return renderDirectoryTab();
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Vendor Management</h1>
        <p className="text-gray-600">Monitor and manage your event vendors</p>
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

export default Vendors;
