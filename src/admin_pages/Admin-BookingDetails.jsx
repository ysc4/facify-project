import React from 'react';
import '../components/Navbar.css';
import Header from '../components/Navbar.jsx';
import '../components/Sidebar.css';
import Sidebar from '../components/AdminSidebar.jsx';
import './Admin-Home.css';

function AdminBookingDetails() {
  return (
    <div className="AdminBookingDetails">
      <Header />
      <div className="content">
        <Sidebar />
        <div className="main-section">
          <h1>Booking Details</h1>
          {/* Add booking details-specific components or content here */}
        </div>
      </div>
    </div>
  );
}

export default AdminBookingDetails;
