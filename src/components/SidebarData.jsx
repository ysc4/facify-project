import BookIcon from '@mui/icons-material/BookOutlined';
import EventIcon from '@mui/icons-material/Event';
import React from 'react';

export const SidebarData = [
    {
        title: 'Facility Reservation',
        path: '/bookings',
        icon: <BookIcon style={{ fontSize: 30 }} />,
        cName: 'nav-text'
    },
    {
        title: 'Facility Availability',
        path: '/venue-availability',
        icon: <EventIcon style={{ fontSize: 30 }} />,
        cName: 'nav-text'
    },
]