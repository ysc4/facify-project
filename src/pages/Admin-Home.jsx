import BlockIcon from '@mui/icons-material/Block';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CheckIcon from '@mui/icons-material/CheckOutlined';
import PencilIcon from '@mui/icons-material/EditOutlined';
import EventIcon from '@mui/icons-material/BookOutlined';
import DocumentIcon from '@mui/icons-material/FileCopyOutlined';
import ReportIcon from '@mui/icons-material/Report';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CancelIcon from '@mui/icons-material/Close';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Dropdown from '../components/Dropdown';
import '../components/Navbar.css';
import Header from '../components/Navbar.jsx';
import '../components/Sidebar.css';
import Sidebar from '../components/Sidebar.jsx';
import StatusCard from '../components/StatusCard.jsx';
import './Admin-Home.css';
import BasicPie from '../components/PieChart.jsx';


function AdminHome() {
  const [filterDates, setFilterDates] = useState('Today');
  const [bookings, setBookings] = useState([]);
  const [statusCounts, setStatusCounts] = useState({});
  const { adminID } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get(`/facify/admin-home/${adminID}?filter=${filterDates}`);
        setBookings(response.data);
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching booking data:', error);
      }
    };
    fetchBookings();
  }, [filterDates]); 

  useEffect(() => {
    calculateStatusCounts();
  }, [bookings]);

  const calculateStatusCounts = () => {
    const counts = {
      "Pencil Booked": 0,
      "Officially Booked": 0,
      "For Assessing": 0,
      "Approved": 0,
      "Denied": 0,
      "Cancelled": 0,
      "Total Bookings": bookings.length,
      "Scheduled Today": 0
    };

    const today = new Date().toLocaleDateString('en-CA');

    bookings.forEach((booking) => {
      if (counts.hasOwnProperty(booking.status_name)) {
        counts[booking.status_name] += 1;
      }
      if (booking.event_date === today) {
        counts["Scheduled Today"] += 1;
      }
    });

    setStatusCounts(counts);
  };

  const calculateFacilityBookings = () => {
    const facilityCounts = {};
  
    bookings.forEach((booking) => {
      if (!facilityCounts[booking.facility_name]) {
        facilityCounts[booking.facility_name] = 0;
      }
      facilityCounts[booking.facility_name] += 1;
    });
  
    return Object.entries(facilityCounts).map(([facility, count]) => ({
      facility,
      count,
    }));
  };

  const handleViewBooking = (booking) => {
    console.log(`Viewing booking ${booking.booking_id}`);
    navigate(`/booking-info/${booking.org_id}/${booking.booking_id}`);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Pencil Booked": return <PencilIcon />;
      case "Officially Booked": return <DocumentIcon />;
      case "For Assessing": return <ReportIcon />;
      case "Approved": return <CheckIcon />;
      case "Denied": return <BlockIcon />;
      case "Cancelled": return <CancelIcon />;
      case "Total Bookings": return <EventIcon />;
      case "Scheduled Today": return <CalendarTodayIcon />;
      default: return <EventIcon />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pencil Booked": return "#FFF3B4";
      case "Officially Booked": return "#A6C4FF";
      case "For Assessing": return "#FFB951";
      case "Approved": return "#B3FFA6";
      case "Denied": return "#FFA6A6";
      case "Cancelled": return "#D9D9D9";
      case "Total Bookings": return "#262323";
      case "Scheduled Today": return "#FFB8D6";
      default: return "#CFCFCF";
    }
  }

  return (
    <div className="AdminHome">
      <Header />
      <div className="main-content">
        <div className="sidebar-placeholder">
          <Sidebar />
        </div>
        <div className="content">
          <div className="dashboard-container">
            <div className="dashboard-header">
              <div className="date-container">
                <h1>Dashboard</h1>
                <h4>{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</h4>
              </div>
                <Dropdown 
                  className="filterDates-type-dropdown"
                  options={['Today', 'This Week', 'This Month', 'This Year']} 
                  defaultValue={filterDates}
                  onSelect={(value) => setFilterDates(value)} 
                />
            </div>
            <div className="data-panels">
              <div className="status-panel-container">
                <div className="status-card-container">
                  {Object.keys(statusCounts).map((status, index) => (
                    <StatusCard
                      key={index}
                      status={status}
                      count={statusCounts[status]}
                      icon={getStatusIcon(status)}
                      className={`card-${status.toLowerCase().replace(/\s+/g, '-')}`}
                      statusColor={getStatusColor(status)}
                    />
                  ))}
                </div>
              </div>

              <div className="pie-chart-panel">
                <h3>Bookings by Facility</h3>
                <BasicPie data={calculateFacilityBookings()} />
              </div>
            </div>
            <div className="booking-list">
              <h2>Scheduled Today</h2>
              <table>
                <thead>
                  <tr>
                    <th>BOOKING ID</th>
                    <th>ORGANIZATION</th>
                    <th>EVENT</th>
                    <th>VENUE</th>
                    <th>TIME</th>
                    <th>VIEW</th>
                  </tr>
                </thead>
                <tbody>
                {bookings.length > 0 ? (
                  bookings
                    .filter((booking) => {
                      const today = new Date().toLocaleDateString('en-CA');
                      const eventDate = new Date(booking.event_date).toLocaleDateString('en-CA');
                      return eventDate === today; 
                    })
                    .map((booking) => (
                      <tr key={booking.booking_id}>
                        <td>{booking.booking_id}</td>
                        <td>{booking.org_name}</td>
                        <td>{booking.activity_title}</td>
                        <td>{booking.facility_name}</td>
                        <td>
                        {booking.event_start && booking.event_end ? (
                          `${booking.event_start.slice(0, 5)} - ${booking.event_end.slice(0, 5)}`
                        ) : "N/A"}
                        </td>
                        <td className="view-icon">
                            <VisibilityIcon className="view-booking" onClick={() => handleViewBooking(booking)}/>
                        </td>
                      </tr>
                    ))
                ) : (
                  <tr>
                    <td colSpan="6">No events scheduled today</td>
                  </tr>
                )}
              </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminHome;