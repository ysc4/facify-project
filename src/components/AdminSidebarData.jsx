import DashboardIcon from '@mui/icons-material/Dashboard';
import BookIcon from '@mui/icons-material/BookOutlined';
import EventIcon from '@mui/icons-material/Event';
import React from 'react';

export const SidebarData = [
    {
        title: 'Dashboard',
        path: '/admin-home',
        icon: <DashboardIcon style={{ fontSize: 30 }} />,
        cName: 'nav-text'
    },
    {
        title: 'Bookings',
        path: '/admin-bookings',
        icon: <BookIcon style={{ fontSize: 30 }} />,
        cName: 'nav-text'
    },
    {
        title: 'Calendar',
        path: '/admin-calendar',
        icon: <EventIcon style={{ fontSize: 30 }} />,
        cName: 'nav-text'
    },
]