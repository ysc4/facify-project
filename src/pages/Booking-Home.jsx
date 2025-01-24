import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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


const formatDate = (dateString) => {
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
};

const BookingItem = ({ title, location, date, organizer, faciCode, status}) => {
    const navigate = useNavigate();
    const bookingID = faciCode;
    
    const handleClick = async () => {
        navigate(`/booking-info/${bookingID}`);
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
    const { orgID } = useParams();
    const[bookings, setBookings] = useState([]);
    const[error, setError] = useState('');

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await axios.post(`/facify/bookings/${orgID}`);
                console.log(orgID);
                if(response.data.success) {
                    setBookings(response.data.bookings);
                } else {
                    setError('No bookings found');
                }
            } catch (err) {
                console.log(err);
                setError('An error occurred while fetching bookings');
            }
        };
        fetchBookings();
    }, [orgID]);

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
            {error && <p className="error" style={{ fontSize: 20 }}>{error}</p>}
                        {bookings.map((booking, index) => (
                            <BookingItem
                                key={index}
                                title={booking.activity_title}
                                location={booking.facility_name}
                                date={`${formatDate(booking.event_date)} ${booking.event_start} - ${booking.event_end}`}
                                organizer={booking.org_name}
                                faciCode={booking.booking_id}
                                status={booking.status_name}
                            />
                        ))}
            </div>
        </div>
      </div>
    </div>
  );
}

export default Homepage;