import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Dropdown from '../components/Dropdown';
import Header from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import '../styles/BookingsOverview.css';
import { formatEventDateTime } from '../utils/DateUtil.jsx';
import { getStatusColor } from '../utils/StatusUtil.jsx';

function BookingOverview() {
    const { adminID } = localStorage.getItem('adminID');
    const [bookings, setBookings] = useState([]);
    const [error, setError] = useState('');
    const [facilities, setFacilities] = useState([]);
    const [statuses, setStatuses] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedFacility, setSelectedFacility] = useState('All Facilities');
    const [selectedStatus, setSelectedStatus] = useState('All Statuses');
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [sortedFilteredBookings, setSortedFilteredBookings] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await axios.get(`/facify/admin-bookings/${adminID}`, {
                    params: { search: searchTerm } 
                });
    
                if (response.data.length > 0) {
                    setBookings(response.data);
    
                    const uniqueFacilities = ['All Facilities', 'Amphitheater', 'E-library', 'Multimedia Room', 'Multipurpose Hall', 'PE Area'];
                    const uniqueStatuses = ['All Statuses', 'Pencil Booked', 'Officially Booked', 'For Assessing', 'Approved', 'Denied', 'Cancelled'];
    
                    setFacilities(uniqueFacilities);
                    setStatuses(uniqueStatuses);
                } else {
                    setError('No bookings found');
                }
            } catch (err) {
                console.error('Error fetching bookings:', err);
                setError('An error occurred while fetching bookings');
            }
        };
    
        fetchBookings();
    }, [adminID, searchTerm]); 
    
    const handleFilterChange = (type, selectedOption) => {
        if (type === 'facility') {
            setSelectedFacility(selectedOption);
        } else if (type === 'status') {
            setSelectedStatus(selectedOption);
        }
    };

    useEffect(() => {
        const filteredBookings = [...bookings]
            .filter((booking) => {
                const matchesFacility = selectedFacility === 'All Facilities' || booking.facility_name === selectedFacility;
                const matchesStatus = selectedStatus === 'All Statuses' || booking.status_name === selectedStatus;
                const matchesSearch = booking.activity_title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                      booking.org_name.toLowerCase().includes(searchTerm.toLowerCase());
                return matchesFacility && matchesStatus && matchesSearch;
            })
            .sort((a, b) => {
                if (!sortConfig.key) return 0;
    
                const valueA = a[sortConfig.key].toLowerCase();
                const valueB = b[sortConfig.key].toLowerCase();
    
                if (valueA < valueB) return sortConfig.direction === 'asc' ? -1 : 1;
                if (valueA > valueB) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
    
        setSortedFilteredBookings(filteredBookings);
    }, [bookings, searchTerm, selectedFacility, selectedStatus, sortConfig]);

    const handleSort = (key) => {
        setSortConfig((prevConfig) => ({
            key,
            direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc',
        }));
    };

    const handleViewBooking = (booking) => {
        console.log(`Viewing booking ${booking.booking_id}`);
        navigate(`/booking-info/${booking.org_id}/${booking.booking_id}`);
    }

    return (
        <div className="Homepage">
            <Header />
            <div className="main-content">
                <div className="sidebar-placeholder">
                    <Sidebar />
                </div>
                <div className="booking-overview">
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
                    </div>
                    <div className="filters">
                            <Dropdown options={facilities} onSelect={(option) => handleFilterChange('facility', option)} defaultValue="All Facilities" />
                            <Dropdown options={statuses} onSelect={(option) => handleFilterChange('status', option)} defaultValue="All Statuses" />
                        </div>
                    <div className="booking-content">
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>ORGANIZATION</th>
                                    <th onClick={() => handleSort('activity_title')}>EVENT <span className="sort-arrow">{sortConfig.key === 'activity_title' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}</span></th>
                                    <th>EVENT DATE</th>
                                    <th>FACILITY</th>
                                    <th>BOOKING DATE</th>
                                    <th onClick={() => handleSort('status_name')}>STATUS <span className="sort-arrow">{sortConfig.key === 'status_name' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}</span></th>
                                    <th>VIEW</th>
                                </tr>
                            </thead>
                            <tbody>
                            {sortedFilteredBookings.length > 0 ? (
                                sortedFilteredBookings.map((booking) => (
                                    <tr key={booking.booking_id}>
                                        <td>FACI{String(booking.booking_id).padStart(3, '0')}</td>
                                        <td>{booking.org_name}</td>
                                        <td>{booking.activity_title}</td>
                                        <td>{formatEventDateTime(booking.event_date, booking.event_start)}</td>
                                        <td>{booking.facility_name}</td>
                                        <td>{formatEventDateTime(booking.booking_date, booking.booking_time)}</td>
                                        <td>
                                            <div className="status-container">
                                                <span className="status-dot" style={{ backgroundColor: getStatusColor(booking.status_name) }}></span>
                                                {booking.status_name}
                                            </div>
                                        </td>
                                        <td className="view-icon">
                                            <VisibilityIcon className="view-booking" onClick={() => handleViewBooking(booking)} />
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8">No bookings found</td>
                                </tr>
                            )}
                        </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BookingOverview;