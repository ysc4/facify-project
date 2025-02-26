import React, { useState } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import AdminHome from './pages/AdminHome';
import BookingInfo from './pages/BookingInfo';
import Booking from './pages/BookingHome';
import AdminBookings from './pages/BookingsOverview';
import Login from './pages/Login';
import SubmitRequirements from './pages/SubmitRequirements';
import Venue from './pages/VenueAvailability';
import VenueBooking from './pages/VenueBooking';

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
      path: '/venue-availability/:facilityID',
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
    },
    {
      path: '/admin-home/:adminID',
      element: <AdminHome />,
      errorElement: <NotFound />
    },
    {
      path: '/admin-bookings/:adminID',
      element: <AdminBookings />,
      errorElement: <NotFound />
    }
  ]);

  return <RouterProvider router={router} basename='facify' />;
}

export default App;