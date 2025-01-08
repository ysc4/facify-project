import React, { useState } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Booking from './pages/Booking-Home';
import BookingInfo from './pages/Booking-Info';
import Login from './pages/Login';
import Venue from './pages/Venue-Availability';
import VenueBooking from './pages/Venue-Booking';

function App() {
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
        </Routes>
      </div>
    </Router>
  );
};

export default App;