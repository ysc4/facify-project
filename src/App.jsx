import React, { useState } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Booking from './pages/Booking-Home';
import BookingInfo from './pages/Booking-Info';
import Login from './pages/Login';
import Venue from './pages/Venue-Availability';

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
        </Routes>
      </div>
    </Router>
  );
};

export default App;