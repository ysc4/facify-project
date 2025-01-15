import React from 'react';
import '../components/Navbar.css';
import Header from '../components/Navbar.jsx';
import '../components/Sidebar.css';
import Sidebar from '../components/AdminSidebar.jsx';
import StatusCard from '../components/Admin-StatusCard.jsx'; 
import './Admin-Home.css';
import PencilIcon from '@mui/icons-material/Edit';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ReportIcon from '@mui/icons-material/Report';
import BlockIcon from '@mui/icons-material/Block';
import EventIcon from '@mui/icons-material/Event';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';

function AdminHome() {
  return (
    <div className="AdminHome">
      <Header />
      <Sidebar />
      <div className="content">
        <div className="status-card-container">
          <StatusCard status="Pencil Booked" count={4} icon={<PencilIcon />} className="card-pencil-booked" />
          <StatusCard status="Complete Requirements" count={10} icon={<CheckCircleIcon />} className="card-complete-requirements" />
          <StatusCard status="For Assessing" count={7} icon={<ReportIcon />} className="card-for-assessing" />
          <StatusCard status="Approved" count={7} icon={<CheckCircleIcon />} className="card-approved" />
          <StatusCard status="Denied" count={7} icon={<BlockIcon />} className="card-denied" />
          <StatusCard status="Total Bookings" count={7} icon={<EventIcon />} className="card-total-bookings" />
          <StatusCard status="Scheduled Today" count={7} icon={<CalendarTodayIcon />} className="card-scheduled-today" />
        </div>
      </div>
    </div>
  );
}

export default AdminHome;
