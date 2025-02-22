import Previous from '@mui/icons-material/ArrowBackIos';
import Next from '@mui/icons-material/ArrowForwardIos';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import '../components/Navbar.css';
import Header from '../components/Navbar.jsx';
import '../components/Sidebar.css';
import Sidebar from '../components/Sidebar.jsx';
import './Venue-Availability.css';

function Venue() {
  const { orgID } = useParams();
  const [facilityID, setFacilityID] = useState(1);
  const [events, setEvents] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

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
        event_date: new Date(event.event_date) // Ensure all dates are in `Date` format
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

  const DayContainer = ({ day, events }) => {
    const dayStatus = events.length > 0 ? events[0].status_name : null;
    return (
      <div className="day-container">
        <div className="day-title">
          <h3>{day}</h3>
        </div>
        <div className="day-content">
          {events.map((event, index) => (
            <div className="event-day" style={{ backgroundColor: getStatusColor(dayStatus) }} ><Event key={index} eventID={event.booking_id} status={event.status_name} /></div>
          ))}
        </div>
      </div>
    );
  };

  const handleVenueClick = (facilityID) => {
    setFacilityID(facilityID);
    console.log(facilityID);
  };

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

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
        return eventDate.getDate() === i && eventDate.getMonth() === currentMonth;
      });
  
      console.log(`Day ${i} Events:`, dayEvents); // Debugging
      days.push(<DayContainer key={i} day={i} events={dayEvents} />);
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
              <Previous className="prev-month" style={{ fontSize: 25 }} onClick={() => setCurrentMonth(currentMonth === 0 ? 11 : currentMonth - 1)} />
              <h2>{new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long', year: 'numeric' })}</h2>
              <Next className="next-month" style={{ fontSize: 25 }} onClick={() => setCurrentMonth(currentMonth === 11 ? 0 : currentMonth + 1)} />
            </div>
            <div className="add-booking">
              <Link to={`/venue-booking/${orgID}/${facilityID}`}>
                <button className="add-booking-button">Add a Booking</button>
              </Link>
            </div>
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
      </div>
    </div>
  );
}

export default Venue;