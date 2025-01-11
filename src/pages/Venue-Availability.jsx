import Previous from '@mui/icons-material/ArrowBackIos';
import Next from '@mui/icons-material/ArrowForwardIos';
import React from 'react';
import { Link } from 'react-router-dom';
import '../components/Calendar.css';
import Calendar from '../components/Calendar.jsx';
import '../components/Navbar.css';
import Header from '../components/Navbar.jsx';
import '../components/Sidebar.css';
import Sidebar from '../components/Sidebar.jsx';
import './Venue-Availability.css';


function Venue() {
  return (
    <div className="Venue-Availability">
      <Header />
      <div className="main-content">
        <div className="sidebar-placeholder">
          <Sidebar />
        </div>
        <div className="calendar-placeholder">
            <div className="calendar-header">
                <div className="calendar-title">
                    <Previous className="prev-month" style={{ fontSize: 25 }}></Previous>
                    <Next className="next-month" style={{ fontSize: 25 }}></Next>
                    <h2>December 2024</h2>
                    <div className="dropdown">
                    </div>
                </div>
                <div className="add-booking">
                    <Link to="/venue-booking">
                        <button className="add-booking-button">Add a Booking</button>
                    </Link>
                </div>
            </div>
            <div className="calendar-body">
              <Calendar />
            </div>
        </div>
      </div>
    </div>
  );
}

export default Venue;
