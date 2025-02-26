import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../components/Dropdown.css';
import Dropdown from '../components/Dropdown.jsx';
import '../components/Navbar.css';
import Header from '../components/Navbar.jsx';
import '../components/Sidebar.css';
import Sidebar from '../components/Sidebar.jsx';
import '../styles/BookingHome.css';
import { formatDate } from '../utils/DateUtil.jsx';
import BookingItem from '../components/BookingItem.jsx';

function Homepage() {
    const { orgID } = useParams();
    const[bookings, setBookings] = useState([]);
    const[error, setError] = useState('');
    const[filter, setFilter] = useState('All Facilities');
    const [facilities, setFacilities] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const data = ['All Facilities', 'Multipurpose Hall', 'PE Area', 'Multimedia Room', 'Amphitheater', 'E-Library'];

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await axios.get(`/facify/bookings/${orgID}`);
                console.log(orgID);
                if(response.data.success) {
                    setBookings(response.data.bookings);
                    const uniqueFacilities = ['All Facilities', ...new Set(response.data.bookings.map(booking => booking.facility_name))];
                    setFacilities(uniqueFacilities);
                } else {
                    setError('No bookings found');
                }
            } catch (err) {
                console.log(err);
                setError('No bookings found');
            }
        };
        fetchBookings();
    }, [orgID]);

    const handleFilterChange = (selectedOption) => {
        setFilter(selectedOption);
    };

    const filteredBookingInfo = bookings.filter((booking) => {
        const matchesFacility = filter === 'All Facilities' || booking.facility_name === filter;
        const matchesSearch = booking.activity_title.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFacility && matchesSearch;
    });

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
                    <input 
                        type="text" 
                        placeholder="Search for" 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="filters">
                <Dropdown 
                    options={data} 
                    onSelect={handleFilterChange} 
                    defaultValue="All Facilities"
                />
                </div>
            </div>
            <div className="overview-content">
            {error && <p className="error" style={{ fontSize: 20 }}>{error}</p>}
                        {filteredBookingInfo.map((booking, index) => (
                            (filter === 'All Facilities' || filter === booking.facility_name) && (
                                <BookingItem
                                    key={index}
                                    title={booking.activity_title}
                                    location={booking.facility_name}
                                    date={`${formatDate(booking.event_date)} ${booking.event_start} - ${booking.event_end}`}
                                    organizer={booking.org_name}
                                    faciCode={booking.booking_id}
                                    status={booking.status_name}
                                    orgID={orgID}
                                />
                            )
                        ))}
            </div>
        </div>
      </div>
    </div>
  );
}

export default Homepage;