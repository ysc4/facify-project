import AccountIcon from '@mui/icons-material/AccountCircle';
import NotifIcon from '@mui/icons-material/Notifications';
import '../App.css';
import logo from '../assets/facify-white.png';
import './Navbar.css';
import { useEffect, useState } from 'react';

function Navbar() {
    const [orgName, setOrgName] = useState('');
    const [adminName, setAdminName] = useState('');
    const userType = localStorage.getItem('userType');

    useEffect(() => {
        const storedOrgName = localStorage.getItem('orgName');
        const storedAdminName = localStorage.getItem('adminName');

        console.log("Retrieved orgName:", storedOrgName);
        console.log("Retrieved adminName:", storedAdminName);

        if (storedOrgName) setOrgName(storedOrgName);
        if (storedAdminName) setAdminName(storedAdminName);
    }, []);

    const displayName = userType === "Organization" ? orgName : adminName;

    return (
        <header className="header">
            <img src={logo} alt="Logo" />
            <div className="navbar">
                <NotifIcon className="notif-icon" style={{ fontSize: 30 }} />
                <p>Hi, {displayName}!</p>
                <AccountIcon className="account-icon" style={{ fontSize: 30 }} />
            </div>
        </header>
    );
}

export default Navbar;