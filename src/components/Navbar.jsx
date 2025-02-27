import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom'; 
import AccountIcon from '@mui/icons-material/AccountCircle';
import Logout from '@mui/icons-material/LogoutOutlined';
import logo from '../assets/facify-white.png';
import '../styles/Navbar.css';

function Navbar() {
  const [orgName, setOrgName] = useState('');
  const [adminName, setAdminName] = useState('');
  const [image, setImage] = useState(null);
  const [bookings, setBookings] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);

  const userType = localStorage.getItem('userType');
  const dropdownRef = useRef(null);
  const accountIconRef = useRef(null);
  const navigate = useNavigate(); 

  // Function to fetch updated booking count
  const updateBookings = () => {
    if (userType === "Organization") { 
      setBookings(parseInt(localStorage.getItem('bookingsNum'), 10) || 0);
    } else {
      setBookings(parseInt(localStorage.getItem('handledBookings'), 10) || 0);    
    }
  };

  useEffect(() => {
    // Initial Load
    setOrgName(localStorage.getItem('orgName') || '');
    setAdminName(localStorage.getItem('adminName') || '');
    setImage(localStorage.getItem('image') || null);
    updateBookings();

    // Custom Event Listener for Booking Updates
    const handleBookingUpdate = () => {
      updateBookings();
    };

    window.addEventListener('bookingUpdated', handleBookingUpdate);

    return () => {
      window.removeEventListener('bookingUpdated', handleBookingUpdate);
    };
  }, []);

  const handleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/'); 
  };

  return (
    <header className="header">
      <img src={logo} alt="Logo" className="facify-logo"/>
      <div className="navbar">
        <p>Hi, {userType === "Organization" ? orgName : adminName}!</p>
        <AccountIcon
          className="account-icon"
          style={{ fontSize: 30 }}
          onClick={handleDropdown}
          ref={accountIconRef} 
        />
      </div>

      {showDropdown && (
        <div className="dropdown-tooltip" ref={dropdownRef}>
          <div className="dropdown-arrow"></div>
          <div className="dropdown-content">
            <img src={image || 'https://via.placeholder.com/80'} alt="Profile" className="profile-image" width="80" height="80"/>
            <p className="dropdown-org-name">{userType === "Organization" ? orgName : adminName}</p>
            <p className="dropdown-bookings-num">Bookings: {bookings}</p>
            <Logout className="logout-button" onClick={handleLogout} style={{ fontSize: 20 }}/>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;