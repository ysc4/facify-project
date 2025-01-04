import AccountIcon from '@mui/icons-material/AccountCircle';
import NotifIcon from '@mui/icons-material/Notifications';
import React from 'react';
import '../App.css';
import logo from '../assets/facify-white.png';
import './Navbar.css';


function Navbar() {
    return (
    <header className="header">
        <img src={logo} alt="Logo"/>
        <div className="navbar">
            <NotifIcon className="notif-icon" style={{ fontSize: 30 }}/>
            <p>Hi, User!</p>
            <AccountIcon className="account-icon" style={{ fontSize: 30 }}/>
        </div>
    </header>
    );
}

export default Navbar;