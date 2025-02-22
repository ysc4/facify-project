import AccountIcon from '@mui/icons-material/AccountCircle';
import NotifIcon from '@mui/icons-material/Notifications';
import '../App.css';
import logo from '../assets/facify-white.png';
import './Navbar.css';
import { useEffect, useState } from 'react';

function Navbar() {
    const [orgName, setOrgName] = useState('');

    useEffect(() => {
        const storedOrgName = localStorage.getItem('orgName');
        console.log("Retrieved orgName from localStorage:", storedOrgName);
        if (storedOrgName) {
            setOrgName(storedOrgName);
        }
    }, []); 

    return (
        <header className="header">
            <img src={logo} alt="Logo" />
            <div className="navbar">
                <NotifIcon className="notif-icon" style={{ fontSize: 30 }} />
                <p>Hi, {orgName}!</p>
                <AccountIcon className="account-icon" style={{ fontSize: 30 }} />
            </div>
        </header>
    );
}

export default Navbar;