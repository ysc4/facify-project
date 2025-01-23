import React, { useState } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Booking from './pages/Booking-Home';
import BookingInfo from './pages/Booking-Info';
import Login from './pages/Login';
import Venue from './pages/Venue-Availability';
import VenueBooking from './pages/Venue-Booking';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const NotFound = () => <h1>404 Not Found</h1>;

  const router = createBrowserRouter([
    {
      path: '/',
      element: <Login setIsLoggedIn={setIsLoggedIn} />,
      errorElement: <NotFound />
    },
    {
      path: '/bookings/:orgID',
      element: <Booking />,
      errorElement: <NotFound />
    },
    {
      path: '/booking-info',
      element: <BookingInfo />,
      errorElement: <NotFound />
    },
    {
      path: '/venue-availability',
      element: <Venue />,
      errorElement: <NotFound />
    },
    {
      path: '/venue-booking',
      element: <VenueBooking />,
      errorElement: <NotFound />
    }
  ]);

  return <RouterProvider router={router} basename='facify' />;
}

export default App;