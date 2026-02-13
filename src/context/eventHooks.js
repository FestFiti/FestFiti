import { useContext } from 'react';
import { EventContext } from './EventContext';

// Custom hook to use the context
export const useEvent = () => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEvent must be used within an EventProvider');
  }
  return context;
};

// Selectors for common data
export const useEventState = () => {
  const { state } = useEvent();
  return state;
};

export const useEventActions = () => {
  const { actions } = useEvent();
  return actions;
};

// Specific selectors
export const useTicketStats = () => {
  const { state } = useEvent();
  return state.ticketStats;
};

export const useBudgetOverview = () => {
  const { state } = useEvent();
  return state.budgetOverview;
};

export const useVendorStats = () => {
  const { state } = useEvent();
  return state.vendorStats;
};

export const useNotifications = () => {
  const { state } = useEvent();
  return state.notifications;
};

export const useChat = () => {
  const { state, actions } = useEvent();
  return {
    messages: state.chatMessages,
    isOpen: state.chatOpen,
    actions: {
      toggleChat: actions.toggleChat,
      addMessage: actions.addMessage
    }
  };
};
