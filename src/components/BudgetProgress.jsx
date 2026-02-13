import React from 'react';
import { DollarSign, AlertTriangle, Check } from 'lucide-react';

const BudgetProgress = ({ category, data }) => {
  const getProgressColor = (percentage) => {
    if (percentage >= 100) return 'bg-red-500';
    if (percentage >= 90) return 'bg-yellow-500';
    if (percentage >= 75) return 'bg-orange-500';
    return 'bg-green-500';
  };

  const getProgressBgColor = (percentage) => {
    if (percentage >= 100) return 'bg-red-100';
    if (percentage >= 90) return 'bg-yellow-100';
    if (percentage >= 75) return 'bg-orange-100';
    return 'bg-green-100';
  };

  const getStatusIcon = (percentage) => {
    if (percentage >= 100) return <AlertTriangle className="w-4 h-4 text-red-500" />;
    if (percentage >= 90) return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
    if (percentage >= 75) return <AlertTriangle className="w-4 h-4 text-orange-500" />;
    return <Check className="w-4 h-4 text-green-500" />;
  };

  const getStatusText = (percentage) => {
    if (percentage >= 100) return 'Over Budget';
    if (percentage >= 90) return 'Critical';
    if (percentage >= 75) return 'Warning';
    return 'On Track';
  };

  const formatCurrency = (amount) => {
    return `KES ${amount.toLocaleString()}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <DollarSign className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{category}</h3>
            <div className="flex items-center space-x-2 mt-1">
              {getStatusIcon(data.percentage)}
              <span className={`text-sm font-medium ${
                data.percentage >= 100 ? 'text-red-600' :
                data.percentage >= 90 ? 'text-yellow-600' :
                data.percentage >= 75 ? 'text-orange-600' :
                'text-green-600'
              }`}>
                {getStatusText(data.percentage)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">Budget Usage</span>
          <span className="text-sm font-medium text-gray-900">
            {data.percentage.toFixed(1)}%
          </span>
        </div>
        <div className={`w-full rounded-full h-3 ${getProgressBgColor(data.percentage)}`}>
          <div
            className={`h-3 rounded-full transition-all duration-300 ${getProgressColor(data.percentage)}`}
            style={{ width: `${Math.min(data.percentage, 100)}%` }}
          ></div>
        </div>
      </div>

      {/* Financial Details */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Allocated</span>
          <span className="text-sm font-medium text-gray-900">
            {formatCurrency(data.allocated)}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Used</span>
          <span className="text-sm font-medium text-gray-900">
            {formatCurrency(data.used)}
          </span>
        </div>
        
        <div className="flex items-center justify-between pt-3 border-t border-gray-200">
          <span className="text-sm font-medium text-gray-700">Remaining</span>
          <span className={`text-sm font-bold ${
            data.remaining >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {formatCurrency(data.remaining)}
          </span>
        </div>
      </div>

      {/* Alert for over budget */}
      {data.percentage >= 100 && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-red-500" />
            <span className="text-sm text-red-800">
              Budget exceeded by {formatCurrency(Math.abs(data.remaining))}
            </span>
          </div>
        </div>
      )}

      {/* Warning for near limit */}
      {data.percentage >= 90 && data.percentage < 100 && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-yellow-500" />
            <span className="text-sm text-yellow-800">
              Approaching budget limit - monitor spending closely
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default BudgetProgress;
