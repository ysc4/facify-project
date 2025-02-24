import Previous from '@mui/icons-material/ArrowBackIos';
import Next from '@mui/icons-material/ArrowForwardIos';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import '../components/Navbar.css';
import Header from '../components/Navbar.jsx';
import '../components/Sidebar.css';
import Sidebar from '../components/Sidebar.jsx';
import './Venue-Availability.css';


function Venue() {
  const orgID = localStorage.getItem('orgID')
  const userType = localStorage.getItem('userType');
  const [facilityID, setFacilityID] = useState(1);
  const [events, setEvents] = useState([]);
  const [hoveredEvent, setHoveredEvent] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 }); 
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const navigate = useNavigate();

  useEffect(() => {
    if (facilityID) {
      fetchEvents();
    }
  }, [facilityID, currentMonth, currentYear]);

  const fetchEvents = async () => {
    try {
      const response = await axios.get(`/facify/venue-availability/${facilityID}`, {
        params: { month: currentMonth + 1, year: currentYear }
      });
  
      const formattedEvents = response.data.events.map(event => ({
        ...event,
        orgID: event.org_id,
        bookingID: event.booking_id,
        venue: event.facility_name, 
        eventDate: new Date(event.event_date), 
        status: event.status_name, 
        startTime: event.event_start, 
        endTime: event.event_end, 
        organizer: event.org_name
      }));
  
      setEvents(formattedEvents);
      console.log("Fetched Events:", formattedEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
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
        default: return "#FFFFFF"; 
    }
};

  const Event = ({ eventID, status }) => {
    return (
      <div className="event" style={{ backgroundColor: getStatusColor(status) }}>
        <h4>{eventID}</h4>
      </div>
    );
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (time) => {
    const [hours, minutes] = time.split(':');
    const date = new Date();
    date.setHours(hours, minutes);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const EventTooltip = ({ event, position }) => {
    if (!event) return null; 
 
    return (
      <div 
        className="tooltip-box" 
        style={{ top: position.y, left: position.x }}
        onClick={() => handleStatusClick(event, userType)}
      >
        <div className="tooltip-header">
          <p className="tooltip-title">FACI{String(event.bookingID).padStart(3, '0')}</p>
          <div className="tooltip-status">
            <span className="status-dot" style={{ backgroundColor: getStatusColor(event.status) }}></span>
            <p className="tooltip-status-name">{event.status}</p>
          </div>
        </div>
        <p className="tooltip-venue">{event.venue}</p>
        <p className="tooltip-date">{formatDate(event.eventDate)}</p>
        <p className="tooltip-time">{formatTime(event.startTime)} - {formatTime(event.endTime)}</p>
        <p className="tooltip-organizer">{event.organizer}</p>
      </div>
    );
  };



  const DayContainer = ({ day, events, userType }) => {
    const dayStatus = events.length > 0 ? events[0].status_name : null;
    return (
      <div className="day-container" onMouseLeave={handleMouseLeave}>
        <div className="day-title">
          <h3>{day}</h3>
        </div>
        <div className="day-content">
          {events.map((event, index) => (
            <div 
            key={index} 
            className="event-day" 
            style={{ backgroundColor: getStatusColor(event.status) }}
            onMouseEnter={(e) => handleMouseEnter(event, e)}
          >
            FACI{String(event.bookingID).padStart(3, '0')}
          </div>
          ))}
        </div>
      </div>
    );
  };

  const handleVenueClick = (facilityID) => {
    setFacilityID(facilityID);
  };

  const handleMouseEnter = (event, e) => {
    setHoveredEvent(event);
    setTooltipPosition({ x: e.clientX + 10, y: e.clientY - 50 }); 
  };
  
  const handleMouseLeave = () => {
    setHoveredEvent(null);
  };

  const handleStatusClick = (event, userType) => {
    if (userType === 'Admin') {
      navigate(`/booking-info/${event.orgID}/${event.bookingID}`);
    }
  };


  const getDaysInMonth = (year, month) => {
    if (month === 1) { // February
      return (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)) ? 29 : 28;
    }
    return new Date(year, month + 1, 0).getDate();
  };
  
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();
  
  const handleMonthChange = (direction) => {
    if (direction === 'prev') {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear(currentYear - 1); // Go to December of the previous year
      } else {
        setCurrentMonth(currentMonth - 1);
      }
    } else if (direction === 'next') {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear(currentYear + 1); // Go to January of the next year
      } else {
        setCurrentMonth(currentMonth + 1);
      }
    }
  };
  
  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDayOfMonth = getFirstDayOfMonth(currentYear, currentMonth);
  
  const generateCalendarDays = () => {
    let days = [];
    let totalBoxes = 42; 
    let dayCounter = 1;
  
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="day-container empty"></div>);
    }
  
    for (let i = 1; i <= daysInMonth; i++) {
      const dayEvents = events.filter(event => {
        const eventDate = new Date(event.event_date);
        return eventDate.getDate() === i && eventDate.getMonth() === currentMonth && eventDate.getFullYear() === currentYear;
      });
  
      console.log(`Year ${currentYear} - Day ${i} Events:`, dayEvents); // Debugging
      days.push(<DayContainer key={i} day={i} events={dayEvents} userType={userType} />);
    }
  
    while (days.length < totalBoxes) {
      days.push(<div key={`extra-${days.length}`} className="day-container empty"></div>);
    }
  
    let weekRows = [];
    for (let i = 0; i < totalBoxes; i += 7) {
      weekRows.push(<div key={`week-${i / 7}`} className="week-container">{days.slice(i, i + 7)}</div>);
    }
  
    return weekRows;
  };

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
            <div className="nav-arrows">
              <Previous className="prev-month" onClick={() => handleMonthChange('prev')} />
              <Next className="next-month" onClick={() => handleMonthChange('next')} />
            </div>
            <h2>{new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long', year: 'numeric' })}</h2>
          </div>
          {userType === 'Organization' && (
              <div className="add-booking">
                <Link to={`/venue-booking/${orgID}/${facilityID}`}>
                  <button className="add-booking-button">Add a Booking</button>
                </Link>
              </div>
          )}
          </div>
          <div className="calendar-body">
            <div className="venue-titles">
              {["Amphitheater", "E-Library", "Multimedia Room", "Multipurpose Hall", "PE Area"].map((venue, index) => (
                <div 
                  key={index} 
                  className={`venue-name ${facilityID === index + 1 ? "active" : ""}`} 
                  onClick={() => handleVenueClick(index + 1)}
                >
                  <h2>{venue}</h2>
                </div>
              ))}
            </div>

            <div className="venue-calendar">
              <div className="week-days">
                {daysOfWeek.map((day) => (
                  <div key={day} className="weekday">{day}</div>
                ))}
              </div>

              {generateCalendarDays()}
            </div>
          </div>
        </div>
        {hoveredEvent && <EventTooltip event={hoveredEvent} position={tooltipPosition} userType={userType} />}
              </div>
    </div>
  );
}

export default Venue;