import React from 'react';
import { 
  Users, 
  DollarSign, 
  Leaf, 
  AlertTriangle, 
  Check, 
  Clock,
  Star
} from 'lucide-react';

const VendorCard = ({ vendor }) => {
  const getRiskColor = (riskLevel) => {
    switch (riskLevel) {
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getReliabilityColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getSustainabilityColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <Check className="w-4 h-4 text-green-500" />;
      case 'confirmed':
        return <Check className="w-4 h-4 text-blue-500" />;
      case 'at_risk':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'delayed':
        return <Clock className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'confirmed':
        return 'Confirmed';
      case 'at_risk':
        return 'At Risk';
      case 'delayed':
        return 'Delayed';
      default:
        return 'Pending';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {vendor.name}
          </h3>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">{vendor.category}</span>
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getRiskColor(vendor.riskLevel)}`}>
              {vendor.riskLevel.toUpperCase()} RISK
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          {getStatusIcon(vendor.status)}
          <span className="text-xs text-gray-600">
            {getStatusText(vendor.status)}
          </span>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Reliability Score */}
        <div className="flex items-center space-x-2">
          <Star className="w-4 h-4 text-gray-400" />
          <div>
            <div className={`text-sm font-medium ${getReliabilityColor(vendor.reliabilityScore)}`}>
              {vendor.reliabilityScore}%
            </div>
            <div className="text-xs text-gray-500">Reliability</div>
          </div>
        </div>

        {/* Sustainability Score */}
        <div className="flex items-center space-x-2">
          <Leaf className="w-4 h-4 text-gray-400" />
          <div>
            <div className={`text-sm font-medium ${getSustainabilityColor(vendor.sustainabilityScore)}`}>
              {vendor.sustainabilityScore}%
            </div>
            <div className="text-xs text-gray-500">Eco Score</div>
          </div>
        </div>
      </div>

      {/* Cost */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <DollarSign className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-600">Cost</span>
        </div>
        <span className="text-lg font-semibold text-gray-900">
          KES {vendor.cost.toLocaleString()}
        </span>
      </div>

      {/* Delivery Date */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-600">Delivery</span>
        </div>
        <span className="text-sm text-gray-900">
          {new Date(vendor.deliveryDate).toLocaleDateString()}
        </span>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-2">
        <button className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium">
          View Details
        </button>
        <button className="flex-1 px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium">
          Contact
        </button>
      </div>
    </div>
  );
};

export default VendorCard;
