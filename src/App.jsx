import React, { useState } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Booking from './pages/Booking-Home';
import BookingInfo from './pages/Booking-Info';
import Login from './pages/Login';
import Venue from './pages/Venue-Availability';
import VenueBooking from './pages/Venue-Booking';
import AdminHome from './admin_pages/Admin-Home';
import AdminBookings from './admin_pages/Admin-Bookings';
import AdminBookingDetails from './admin_pages/Admin-BookingDetails';
import AdminCalendar from './admin_pages/Admin-Calendar';


export default function  App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  return (
    <Router>
      <div className='App'>
        <Routes>
          <Route path="/" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/bookings" element={<Booking />} />
          <Route path="/booking-info" element={<BookingInfo />} />
          <Route path="/venue-availability" element={<Venue />} />
          <Route path="/venue-booking" element={<VenueBooking />} />
          <Route path="/admin-home" element={<AdminHome />} />
          <Route path="/admin-bookings" element={<AdminBookings />} />
          <Route path="/admin-bookingdetails" element={<AdminBookingDetails />} />
          <Route path="/admin-calendar" element={<AdminCalendar />} />

        </Routes>
      </div>
    </Router>
  );
};
