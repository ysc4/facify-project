import SearchIcon from '@mui/icons-material/Search';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import data from '../components/data.jsx';
import '../components/Dropdown.css';
import Dropdown from '../components/Dropdown.jsx';
import '../components/Navbar.css';
import Header from '../components/Navbar.jsx';
import '../components/Sidebar.css';
import Sidebar from '../components/Sidebar.jsx';
import './Booking-Home.css';

const getStatusColor = (status) => {
    switch (status) {
        case "Pencil Booked":
            return "#D9D9D9";
        case "Complete Requirements":
            return "#A6C4FF";
        case "For Assessing":
            return "#FFB951";
        case "Approved":
            return "#B3FFA6";
        default:
            return "#FFFFFF"; 
    }
};

const BookingItem = ({ title, location, date, organizer, faciCode, status}) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/booking-info');
    };

    return (
        <div className="booking-item" onClick={handleClick}>
                <div className="details">
                    <div className="booking-item-header">
                        <h2>{title}</h2>
                    </div>
                    <div className="booking-item-content">
                        <p>{location}</p>
                        <p>{date}</p>
                        <p>{organizer}</p>
                    </div>
                </div>
                <div className="status">
                    <div className="faci-code">
                        <h3>{faciCode}</h3>
                    </div>
                    <div className="status-label" style={{backgroundColor: getStatusColor(status)}}>
                        <p>{status}</p>
                    </div>
                </div>
            </div>
    );
}

function Homepage() {

  return (
    <div className="Homepage">
      <Header />
      <div className="main-content">
        <div className="sidebar-placeholder">
          <Sidebar />
        </div>
        <div className="overview">
          <div className="overview-header">
              <div className="search-bar">
                    <SearchIcon className="search-icon" />
                    <input type="text" placeholder="Search for " />
                </div>
                <div className="filters">
                    {data.map((options, index) => (
                        <Dropdown key={index} options={options} />
                    ))}
                </div>
            </div>
            <div className="overview-content">
            <BookingItem
                        title="Tagbik: General Assembly & Infosession 2024"
                        location="Multipurpose Hall, 12th Floor, Main Building"
                        date="December 5, 2024 12:00 NN - 4:00 PM"
                        organizer="GDSC National University - Manila"
                        faciCode="FACI00001"
                        status="Approved"
                    />
            <BookingItem
                        title="CCIT Month 2025 Opening Ceremony"
                        location="Gym, 8th Floor, Main Building"
                        date="January 10, 2025 10:00 AM - 2:00 PM"
                        organizer="CCIT Student Council"
                        faciCode="FACI00002"
                        status="For Assessing"
            />
            </div>
        </div>
      </div>
    </div>
  );
}

export default Homepage;