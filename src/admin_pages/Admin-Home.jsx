import React from 'react';
import '../components/Navbar.css';
import Header from '../components/Navbar.jsx';
import '../components/Sidebar.css';
import Sidebar from '../components/AdminSidebar.jsx';
import StatusCard from '../components/Admin-StatusCard.jsx'; 
import './Admin-Home.css';

function AdminHome() {
  return (
    <div className="AdminHome">
      <Header />
      <Sidebar />
      <div className="content">
        <div className="status-cards">
          {/* Add multiple StatusCards as needed */}
            <StatusCard status="Pencil Booked" count={4} className="card-pencil-booked" />
            <StatusCard status="Complete Requirements" count={10} className="card-complete-requirements" />
            <StatusCard status="For Assessing" count={7} className="card-for-assessing" />
            <StatusCard status="Approved" count={7} className="card-approved" />
            <StatusCard status="Denied" count={7} className="card-denied" />
            <StatusCard status="Total Bookings" count={7} className="card-total-bookings" />
            <StatusCard status="Scheduled Today" count={7} className="card-scheduled-today" />

        </div>
      </div>
    </div>
  );
}

export default AdminHome;
