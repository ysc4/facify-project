import React from 'react';
import '../components/Navbar.css';
import Header from '../components/Navbar.jsx';
import '../components/Sidebar.css';
import Sidebar from '../components/AdminSidebar.jsx';

import './Admin-Home.css';

function AdminHome() {
  return (
    <div className="AdminHome">
        <Header />
      <Sidebar />
    </div>
  );
}

export default AdminHome;
