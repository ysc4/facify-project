import BookIcon from '@mui/icons-material/BookOutlined';
import EventIcon from '@mui/icons-material/Event';
import DashboardIcon from '@mui/icons-material/DashboardOutlined';
import React from 'react';

export const SidebarData = ({ user, orgID, facilityID, adminID }) => {
    if (user === 'Organization') {
        return [
            {
                title: 'Facility Reservation',
                path: `/bookings/${orgID}`,
                icon: <BookIcon style={{ fontSize: 30 }} />,
                cName: 'nav-text'
            },
            {
                title: 'Facility Availability',
                path: `/venue-availability/${facilityID}`,
                icon: <EventIcon style={{ fontSize: 30 }} />,
                cName: 'nav-text'
            }
        ];
    } else {
        return [
            {
                title: 'Facility Dashboard',
                path: `/admin-home/${adminID}`,
                icon: <DashboardIcon style={{ fontSize: 30 }} />,
                cName: 'nav-text'
            },
            {
                title: 'Facility Reservations',
                path: `/admin-bookings/${adminID}`,
                icon: <BookIcon style={{ fontSize: 30 }} />,
                cName: 'nav-text'
            },
            {
                title: 'Facility Availability',
                path: `/venue-availability/${facilityID}`,
                icon: <EventIcon style={{ fontSize: 30 }} />,
                cName: 'nav-text'
            }
        ];
    }
};