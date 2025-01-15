import React from 'react';
import '../components/Navbar.css';
import Header from '../components/Navbar.jsx';
import '../components/Sidebar.css';
import Sidebar from '../components/AdminSidebar.jsx';
import './Admin-Home.css';

function AdminBookings() {
  return (
    <div className="AdminBookings">
      <Header />
      <div className="content">
        <Sidebar />
        <div className="main-section">
          <h1>Bookings</h1>
          {/* Add booking-specific components or content here */}
        </div>
      </div>
    </div>
  );
}

export default AdminBookings;
