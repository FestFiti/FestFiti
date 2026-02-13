import React from 'react';
import { useEvent } from '../context/eventHooks';
import ChartCard from '../components/ChartCard';
import { 
  Leaf, 
  TrendingDown, 
  Recycle, 
  TreePine,
  Droplets,
  Wind
} from 'lucide-react';

const Sustainability = () => {
  const { state } = useEvent();
  const metrics = state.sustainabilityMetrics;

  // Prepare data for vendor eco ratings chart
  const vendorEcoData = metrics.vendorEcoRatings.map(vendor => ({
    name: vendor.name.split(' ')[0], // Use first name for brevity
    rating: vendor.rating
  }));

  // Prepare data for waste comparison
  const wasteComparisonData = [
    { type: 'Predicted', value: metrics.predictedWaste },
    { type: 'Actual', value: metrics.actualWaste }
  ];

  const getWasteReductionColor = (percentage) => {
    if (percentage >= 20) return 'text-green-600';
    if (percentage >= 10) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Sustainability Metrics</h1>
        <p className="text-gray-600">Track your event's environmental impact</p>
      </div>

      {/* Sustainability Score Card */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg shadow-lg p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">Sustainability Score</h2>
            <div className="text-5xl font-bold mb-2">{metrics.sustainabilityScore}/100</div>
            <p className="text-green-100">
              Your event is performing {metrics.sustainabilityScore >= 80 ? 'excellently' : metrics.sustainabilityScore >= 60 ? 'well' : 'below expectations'} in sustainability
            </p>
          </div>
          <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center">
            <Leaf className="w-16 h-16 text-white" />
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingDown className="w-6 h-6 text-green-600" />
            </div>
            <span className={`text-sm font-medium ${getWasteReductionColor(metrics.wasteReduction)}`}>
              {metrics.wasteReduction > 0 ? 'Good' : 'Needs Work'}
            </span>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {metrics.wasteReduction}%
          </div>
          <div className="text-sm text-gray-600">Waste Reduction</div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Recycle className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-sm font-medium text-blue-600">Rate</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {metrics.predictedWaste} kg
          </div>
          <div className="text-sm text-gray-600">Predicted Waste</div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
              <TreePine className="w-6 h-6 text-emerald-600" />
            </div>
            <span className="text-sm font-medium text-emerald-600">Vendors</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {metrics.ecoVendorPercentage}%
          </div>
          <div className="text-sm text-gray-600">Eco-Certified</div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Wind className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-sm font-medium text-purple-600">Impact</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {metrics.carbonFootprint}t
          </div>
          <div className="text-sm text-gray-600">CO₂ Emissions</div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Waste Comparison */}
        <ChartCard
          title="Waste Management"
          subtitle="Predicted vs actual waste"
          type="bar"
          data={wasteComparisonData}
          dataKey="value"
          xAxisKey="type"
          color="#10b981"
          height={300}
        />

        {/* Vendor Eco Ratings */}
        <ChartCard
          title="Vendor Eco Ratings"
          subtitle="Sustainability scores by vendor"
          type="bar"
          data={vendorEcoData}
          dataKey="rating"
          xAxisKey="name"
          color="#059669"
          height={300}
        />
      </div>

      {/* Detailed Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Waste Details */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Waste Management Details</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <div className="text-sm text-gray-600">Predicted Waste</div>
                <div className="text-xl font-bold text-gray-900">{metrics.predictedWaste} kg</div>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Droplets className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <div className="text-sm text-gray-600">Actual Waste</div>
                <div className="text-xl font-bold text-gray-900">{metrics.actualWaste} kg</div>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Recycle className="w-6 h-6 text-green-600" />
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
              <div>
                <div className="text-sm text-green-600">Waste Reduction</div>
                <div className="text-xl font-bold text-green-900">{metrics.wasteReduction}%</div>
              </div>
              <div className="w-12 h-12 bg-green-200 rounded-lg flex items-center justify-center">
                <TrendingDown className="w-6 h-6 text-green-700" />
              </div>
            </div>
          </div>
        </div>

        {/* Environmental Impact */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Environmental Impact</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <div className="text-sm text-gray-600">Carbon Footprint</div>
                <div className="text-xl font-bold text-gray-900">{metrics.carbonFootprint} tons CO₂</div>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Wind className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <div className="text-sm text-gray-600">Recycling Rate</div>
                <div className="text-xl font-bold text-gray-900">{metrics.recyclingRate}%</div>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                <Recycle className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
              <div>
                <div className="text-sm text-emerald-600">Eco Vendors</div>
                <div className="text-xl font-bold text-emerald-900">{metrics.ecoVendorPercentage}%</div>
              </div>
              <div className="w-12 h-12 bg-emerald-200 rounded-lg flex items-center justify-center">
                <TreePine className="w-6 h-6 text-emerald-700" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Sustainability Recommendations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border border-green-200 rounded-lg bg-green-50">
            <div className="flex items-center space-x-2 mb-2">
              <Leaf className="w-5 h-5 text-green-600" />
              <h4 className="font-medium text-green-900">Excellent Performance</h4>
            </div>
            <p className="text-sm text-green-700">
              Your waste reduction of {metrics.wasteReduction}% is impressive! Consider sharing your strategies with other event organizers.
            </p>
          </div>
          
          <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
            <div className="flex items-center space-x-2 mb-2">
              <Recycle className="w-5 h-5 text-blue-600" />
              <h4 className="font-medium text-blue-900">Recycling Enhancement</h4>
            </div>
            <p className="text-sm text-blue-700">
              With {metrics.recyclingRate}% recycling rate, consider adding more recycling stations to reach 90%+.
            </p>
          </div>
          
          <div className="p-4 border border-emerald-200 rounded-lg bg-emerald-50">
            <div className="flex items-center space-x-2 mb-2">
              <TreePine className="w-5 h-5 text-emerald-600" />
              <h4 className="font-medium text-emerald-900">Vendor Engagement</h4>
            </div>
            <p className="text-sm text-emerald-700">
              {metrics.ecoVendorPercentage}% eco-vendors is good. Aim for 80%+ by encouraging more sustainable practices.
            </p>
          </div>
          
          <div className="p-4 border border-purple-200 rounded-lg bg-purple-50">
            <div className="flex items-center space-x-2 mb-2">
              <Wind className="w-5 h-5 text-purple-600" />
              <h4 className="font-medium text-purple-900">Carbon Offset</h4>
            </div>
            <p className="text-sm text-purple-700">
              Consider carbon offset programs to neutralize the {metrics.carbonFootprint} tons CO₂ emissions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sustainability;
