import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { EventProvider } from './context/EventContext';
import Layout from './layout/Layout';
import Dashboard from './pages/Dashboard';
import Events from './pages/Events';
import TicketGuard from './pages/TicketGuard';
import Vendors from './pages/Vendors';
import Budget from './pages/Budget';
import Sustainability from './pages/Sustainability';
import FestBuddy from './pages/FestBuddy';
import ManageEvent from './pages/ManageEvent';
import ChatWindow from './components/ChatWindow';
import './styles/globals.css';

function App() {
  return (
    <EventProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="events" element={<Events />} />
              <Route path="manage-event/:eventId" element={<ManageEvent />} />
              <Route path="ticketguard" element={<TicketGuard />} />
              <Route path="vendors" element={<Vendors />} />
              <Route path="budget" element={<Budget />} />
              <Route path="sustainability" element={<Sustainability />} />
              <Route path="festbuddy" element={<FestBuddy />} />
            </Route>
          </Routes>
          
          {/* Global Chat Window */}
          <ChatWindow />
        </div>
      </Router>
    </EventProvider>
  );
}

export default App;
