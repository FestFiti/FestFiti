import React, { createContext, useReducer, useEffect } from 'react';
import { ActionTypes } from './eventConstants';
import { mockData } from '../data/mockData.js';
import { validateTicket, getTicketStats, getCapacityInfo } from '../utils/ticketUtils.js';
import { getBudgetOverview } from '../utils/budgetUtils.js';
import { getVendorStats } from '../utils/vendorUtils.js';

// Initial state
const initialState = {
  // Data
  eventDetails: mockData.eventDetails,
  tickets: mockData.tickets,
  vendors: mockData.vendors,
  budget: mockData.budget,
  fraudLogs: mockData.fraudLogs,
  sustainabilityMetrics: mockData.sustainabilityMetrics,
  ticketSales: mockData.ticketSales,
  checkInLogs: mockData.checkInLogs,
  events: [], // Array to store all events

  // Computed values
  ticketStats: {},
  budgetOverview: {},
  vendorStats: {},
  capacityInfo: {},
  
  // UI State
  currentPage: 'dashboard',
  sidebarOpen: true,
  notifications: [],
  
  // Ticket scanner state
  lastValidationResult: null,
  scannerActive: false,
  
  // Chat state
  chatMessages: [],
  chatOpen: false,
  
  // Loading states
  loading: {
    tickets: false,
    budget: false,
    vendors: false,
    validation: false
  },
  
  // Error states
  errors: {
    tickets: null,
    budget: null,
    vendors: null,
    validation: null
  }
};

// Reducer function
const eventReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.SET_PAGE:
      return {
        ...state,
        currentPage: action.payload
      };
    
    case ActionTypes.TOGGLE_SIDEBAR:
      return {
        ...state,
        sidebarOpen: !state.sidebarOpen
      };
    
    case ActionTypes.VALIDATE_TICKET:
      return {
        ...state,
        loading: {
          ...state.loading,
          validation: true
        },
        errors: {
          ...state.errors,
          validation: null
        }
      };
    
    case ActionTypes.SET_VALIDATION_RESULT:
      {
        const { result } = action.payload;
        
        // Update tickets if validation was successful
        let updatedTickets = state.tickets;
        let updatedFraudLogs = state.fraudLogs;
        let updatedCheckInLogs = state.checkInLogs;
        
        if (result.isValid && result.ticket) {
          updatedTickets = state.tickets.map(t => 
            t.id === result.ticket.id ? result.ticket : t
          );
          updatedCheckInLogs = [result.checkInLog, ...state.checkInLogs];
        }
        
        if (!result.isValid && result.fraudLog) {
          updatedFraudLogs = [result.fraudLog, ...state.fraudLogs];
        }
        
        return {
          ...state,
          tickets: updatedTickets,
          fraudLogs: updatedFraudLogs,
          checkInLogs: updatedCheckInLogs,
          lastValidationResult: result,
          loading: {
            ...state.loading,
            validation: false
          }
        };
      }
    
    case ActionTypes.TOGGLE_SCANNER:
      return {
        ...state,
        scannerActive: !state.scannerActive
      };
    
    case ActionTypes.ADD_CHAT_MESSAGE:
      return {
        ...state,
        chatMessages: [...state.chatMessages, action.payload]
      };
    
    case ActionTypes.TOGGLE_CHAT:
      return {
        ...state,
        chatOpen: !state.chatOpen
      };
    
    case ActionTypes.CLEAR_CHAT:
      return {
        ...state,
        chatMessages: []
      };
    
    case ActionTypes.ADD_NOTIFICATION:
      return {
        ...state,
        notifications: [action.payload, ...state.notifications].slice(0, 10) // Keep last 10
      };
    
    case ActionTypes.CLEAR_NOTIFICATIONS:
      return {
        ...state,
        notifications: []
      };
    
    case ActionTypes.SET_LOADING:
      return {
        ...state,
        loading: {
          ...state.loading,
          [action.payload.key]: action.payload.value
        }
      };
    
    case ActionTypes.SET_ERROR:
      return {
        ...state,
        errors: {
          ...state.errors,
          [action.payload.key]: action.payload.value
        }
      };
    
    case ActionTypes.CLEAR_ERROR:
      return {
        ...state,
        errors: {
          ...state.errors,
          [action.payload]: null
        }
      };
    
    case ActionTypes.REFRESH_STATS:
      return {
        ...state,
        ticketStats: getTicketStats(),
        budgetOverview: getBudgetOverview(),
        vendorStats: getVendorStats(),
        capacityInfo: getCapacityInfo(state.eventDetails.capacity)
      };
    
    // Event management cases
    case ActionTypes.ADD_EVENT:
      return {
        ...state,
        events: [...state.events, action.payload]
      };

    case ActionTypes.UPDATE_EVENT:
      return {
        ...state,
        events: state.events.map(event =>
          event.id === action.payload.id ? { ...event, ...action.payload } : event
        )
      };

    case ActionTypes.DELETE_EVENT:
      return {
        ...state,
        events: state.events.filter(event => event.id !== action.payload)
      };

    default:
      return state;
  }
};

// Create context
const EventContext = createContext();

// Provider component
export const EventProvider = ({ children }) => {
  const [state, dispatch] = useReducer(eventReducer, initialState);
  
  // Initialize computed stats on mount
  useEffect(() => {
    dispatch({ type: ActionTypes.REFRESH_STATS });
  }, []);
  
  // Action creators
  const actions = {
    // Navigation
    setCurrentPage: (page) => {
      dispatch({ type: ActionTypes.SET_PAGE, payload: page });
    },
    
    toggleSidebar: () => {
      dispatch({ type: ActionTypes.TOGGLE_SIDEBAR });
    },
    
    // Ticket validation
    validateTicket: async (qrCode) => {
      dispatch({ type: ActionTypes.VALIDATE_TICKET });
      
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const result = validateTicket(qrCode);
        dispatch({ type: ActionTypes.SET_VALIDATION_RESULT, payload: { result } });
        
        // Add notification
        const notificationType = result.isValid ? 'success' : 'error';
        actions.addNotification({
          type: notificationType,
          title: result.status,
          message: result.message,
          timestamp: new Date().toISOString()
        });
        
        // Refresh stats
        dispatch({ type: ActionTypes.REFRESH_STATS });
        
        return result;
      } catch (error) {
        dispatch({ 
          type: ActionTypes.SET_ERROR, 
          payload: { key: 'validation', value: error.message } 
        });
        return null;
      }
    },
    
    toggleScanner: () => {
      dispatch({ type: ActionTypes.TOGGLE_SCANNER });
    },
    
    // Chat
    addChatMessage: (message) => {
      dispatch({ type: ActionTypes.ADD_CHAT_MESSAGE, payload: message });
    },
    
    toggleChat: () => {
      dispatch({ type: ActionTypes.TOGGLE_CHAT });
    },
    
    clearChat: () => {
      dispatch({ type: ActionTypes.CLEAR_CHAT });
    },
    
    // Notifications
    addNotification: (notification) => {
      dispatch({ type: ActionTypes.ADD_NOTIFICATION, payload: notification });
    },
    
    clearNotifications: () => {
      dispatch({ type: ActionTypes.CLEAR_NOTIFICATIONS });
    },
    
    // Loading
    setLoading: (key, value) => {
      dispatch({ type: ActionTypes.SET_LOADING, payload: { key, value } });
    },
    
    // Error handling
    setError: (key, value) => {
      dispatch({ type: ActionTypes.SET_ERROR, payload: { key, value } });
    },
    
    clearError: (key) => {
      dispatch({ type: ActionTypes.CLEAR_ERROR, payload: key });
    },
    
    // Refresh
    refreshStats: () => {
      dispatch({ type: ActionTypes.REFRESH_STATS });
    },

    // Event management
    addEvent: (eventData) => {
      dispatch({ type: ActionTypes.ADD_EVENT, payload: eventData });
      actions.addNotification({
        type: 'success',
        title: 'Event Created',
        message: `${eventData.name} has been created successfully`,
        timestamp: new Date().toISOString()
      });
    },

    updateEvent: (eventData) => {
      dispatch({ type: ActionTypes.UPDATE_EVENT, payload: eventData });
      actions.addNotification({
        type: 'success',
        title: 'Event Updated',
        message: `${eventData.name} has been updated`,
        timestamp: new Date().toISOString()
      });
    },

    deleteEvent: (eventId) => {
      dispatch({ type: ActionTypes.DELETE_EVENT, payload: eventId });
      actions.addNotification({
        type: 'success',
        title: 'Event Deleted',
        message: 'Event has been deleted successfully',
        timestamp: new Date().toISOString()
      });
    }
  };
  
  const value = {
    state,
    actions,
    dispatch
  };
  
  return (
    <EventContext.Provider value={value}>
      {children}
    </EventContext.Provider>
  );
};

export { EventContext };
