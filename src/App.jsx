import React, { useState } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Booking from './pages/Booking-Home';
import BookingInfo from './pages/Booking-Info';
import Login from './pages/Login';
import Venue from './pages/Venue-Availability';
import VenueBooking from './pages/Venue-Booking';
import SubmitRequirements from './pages/Submit-Requirements';

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
      path: '/booking-info/:orgID/:bookingID',
      element: <BookingInfo />,
      errorElement: <NotFound />
    },
    {
      path: '/venue-availability/:orgID',
      element: <Venue />,
      errorElement: <NotFound />
    },
    {
      path: '/venue-booking/:orgID/:facilityID',
      element: <VenueBooking />,
      errorElement: <NotFound />
    },
    {
      path: '/submit-requirements/:orgID/:bookingID',
      element: <SubmitRequirements />,
      errorElement: <NotFound />
    }

  ]);

  return <RouterProvider router={router} basename='facify' />;
}

export default App;