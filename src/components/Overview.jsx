import SearchIcon from '@mui/icons-material/Search';
import React from 'react';
import './Overview.css';

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
    return (
        <div className="booking-item">
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

const Overview = () => {
  return (
    <div className="Overview">
        <div className="overview-header">
            <div className="search-bar">
                <SearchIcon className="search-icon" />
                <input type="text" placeholder="Search for " />
            </div>
            <div className="filters">
                <label className="filter-label">Filter by:</label>
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
  );
};

export default Overview;