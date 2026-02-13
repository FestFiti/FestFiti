import React, { useState, useRef } from 'react';
import { useEvent } from '../context/eventHooks';
import { Camera, X, CheckCircle, AlertCircle, XCircle } from 'lucide-react';

const TicketScanner = ({ onClose }) => {
  const { state, actions } = useEvent();
  const [qrInput, setQrInput] = useState('');
  const inputRef = useRef(null);

  const handleScan = async () => {
    if (!qrInput.trim()) return;

    await actions.validateTicket(qrInput.trim());
    setQrInput('');
    
    // Focus back to input for next scan
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleScan();
    }
  };

  const getResultIcon = () => {
    if (!state.lastValidationResult) return null;

    switch (state.lastValidationResult.status) {
      case 'VALID':
        return <CheckCircle className="w-16 h-16 text-green-500" />;
      case 'DUPLICATE':
        return <AlertCircle className="w-16 h-16 text-yellow-500" />;
      case 'INVALID':
        return <XCircle className="w-16 h-16 text-red-500" />;
      default:
        return null;
    }
  };

  const getResultColor = () => {
    if (!state.lastValidationResult) return 'border-gray-200';

    switch (state.lastValidationResult.status) {
      case 'VALID':
        return 'border-green-200 bg-green-50';
      case 'DUPLICATE':
        return 'border-yellow-200 bg-yellow-50';
      case 'INVALID':
        return 'border-red-200 bg-red-50';
      default:
        return 'border-gray-200';
    }
  };

  const getResultTextColor = () => {
    if (!state.lastValidationResult) return 'text-gray-900';

    switch (state.lastValidationResult.status) {
      case 'VALID':
        return 'text-green-900';
      case 'DUPLICATE':
        return 'text-yellow-900';
      case 'INVALID':
        return 'text-red-900';
      default:
        return 'text-gray-900';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Camera className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Ticket Scanner</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Scanner Body */}
        <div className="p-6 space-y-6">
          {/* Input Section */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              Enter Ticket QR Code
            </label>
            <div className="flex space-x-2">
              <input
                ref={inputRef}
                type="text"
                value={qrInput}
                onChange={(e) => setQrInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Scan or enter QR code..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                disabled={state.loading.validation}
              />
              <button
                onClick={handleScan}
                disabled={state.loading.validation || !qrInput.trim()}
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {state.loading.validation ? 'Scanning...' : 'Validate'}
              </button>
            </div>
          </div>

          {/* Validation Result */}
          {state.lastValidationResult && (
            <div className={`border-2 rounded-lg p-6 text-center ${getResultColor()}`}>
              {getResultIcon()}
              
              <div className={`mt-4 space-y-2 ${getResultTextColor()}`}>
                <div className="text-xl font-bold">
                  {state.lastValidationResult.status}
                </div>
                <div className="text-sm">
                  {state.lastValidationResult.message}
                </div>
                
                {state.lastValidationResult.ticket && (
                  <div className="mt-4 text-xs space-y-1">
                    <div><strong>Ticket ID:</strong> {state.lastValidationResult.ticket.id}</div>
                    <div><strong>Attendee:</strong> {state.lastValidationResult.ticket.attendeeName}</div>
                    <div><strong>Type:</strong> {state.lastValidationResult.ticket.type}</div>
                    {state.lastValidationResult.ticket.checkedInAt && (
                      <div><strong>Checked In:</strong> {new Date(state.lastValidationResult.ticket.checkedInAt).toLocaleTimeString()}</div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => setQrInput('QR001')}
              className="p-2 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
            >
              Test Valid Ticket
            </button>
            <button
              onClick={() => setQrInput('QR006')}
              className="p-2 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
            >
              Test Duplicate
            </button>
            <button
              onClick={() => setQrInput('INVALID001')}
              className="p-2 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
            >
              Test Invalid
            </button>
            <button
              onClick={() => setQrInput('')}
              className="p-2 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
            >
              Clear
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketScanner;
