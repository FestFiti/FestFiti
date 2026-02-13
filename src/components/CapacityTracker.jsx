import React from 'react';

const CapacityTracker = ({ current, capacity, percentage }) => {
  // Validate and sanitize inputs
  const safeCurrent = Number(current) || 0;
  const safeCapacity = Number(capacity) || 1; // Avoid division by zero
  const safePercentage = Number(percentage) || 0;

  const remaining = safeCapacity - safeCurrent;
  const remainingPercentage = safeCapacity > 0 ? ((remaining / safeCapacity) * 100).toFixed(1) : '0.0';

  return (
    <div className="bg-white rounded border border-gray-200 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">Capacity Monitor</h3>
          <div className="inline-flex items-center space-x-1 px-2 py-0.5 rounded border text-xs font-medium bg-gray-50 border-gray-200 text-gray-600 mt-0.5">
            <span>{safePercentage >= 90 ? 'CRITICAL' : safePercentage >= 70 ? 'WARNING' : 'NORMAL'}</span>
          </div>
        </div>
      </div>

      {/* Main Metrics */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <div className="text-2xl font-mono font-bold text-gray-900">
            {safeCurrent.toLocaleString()}
          </div>
          <div className="text-xs text-gray-500">Current</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-mono font-bold text-gray-900">
            {safeCapacity.toLocaleString()}
          </div>
          <div className="text-xs text-gray-500">Capacity</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-mono font-bold text-gray-900">
            {safePercentage.toFixed(1)}%
          </div>
          <div className="text-xs text-gray-500">Utilization</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="w-full rounded h-2 bg-gray-100">
          <div
            className="h-2 rounded transition-all duration-300 bg-gray-400"
            style={{ width: `${Math.min(safePercentage, 100)}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>0%</span>
          <span>{safePercentage.toFixed(1)}%</span>
          <span>100%</span>
        </div>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="flex justify-between p-2 bg-gray-50 rounded">
          <span className="text-gray-600">Remaining:</span>
          <span className="font-mono font-medium">{remaining.toLocaleString()}</span>
        </div>
        <div className="flex justify-between p-2 bg-gray-50 rounded">
          <span className="text-gray-600">Available:</span>
          <span className="font-mono font-medium">{remainingPercentage}%</span>
        </div>
        <div className="flex justify-between p-2 bg-gray-50 rounded">
          <span className="text-gray-600">Rate:</span>
          <span className="font-mono font-medium">{Math.round((safeCurrent / safeCapacity) * 10)}/10min</span>
        </div>
        <div className="flex justify-between p-2 bg-gray-50 rounded">
          <span className="text-gray-600">Status:</span>
          <span className="font-mono font-medium text-gray-600">
            {safePercentage >= 90 ? 'CRITICAL' : safePercentage >= 70 ? 'WARNING' : 'NORMAL'}
          </span>
        </div>
      </div>

      {/* System Alert */}
      {safePercentage >= 90 && (
        <div className="mt-3 p-2 bg-gray-50 border border-gray-200 rounded text-xs">
          <div className="flex items-center space-x-2">
            <span className="text-gray-800 font-medium">CAPACITY CRITICAL</span>
          </div>
          <div className="text-gray-700 mt-1">Implement entry control protocols</div>
        </div>
      )}

      {safePercentage >= 70 && safePercentage < 90 && (
        <div className="mt-3 p-2 bg-gray-50 border border-gray-200 rounded text-xs">
          <div className="flex items-center space-x-2">
            <span className="text-gray-800 font-medium">CAPACITY WARNING</span>
          </div>
          <div className="text-gray-700 mt-1">Monitor attendee flow rate</div>
        </div>
      )}
    </div>
  );
};

export default CapacityTracker;
