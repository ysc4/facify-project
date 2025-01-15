import React from 'react';
import '../components/Navbar.css';
import Header from '../components/Navbar.jsx';
import '../components/Sidebar.css';
import Sidebar from '../components/AdminSidebar.jsx';
import './Admin-Home.css';

function AdminCalendar() {
  return (
    <div className="AdminCalendar">
      <Header />
      <div className="content">
        <Sidebar />
        <div className="main-section">
          <h1>Calendar</h1>
          {/* Add calendar-specific components or content here */}
        </div>
      </div>
    </div>
  );
}

export default AdminCalendar;
