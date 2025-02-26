import AccountIcon from '@mui/icons-material/AccountCircle';
import logo from '../assets/facify-white.png';
import '../styles/Navbar.css';
import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom'; 
import Logout from '@mui/icons-material/LogoutOutlined';

function Navbar() {
  const [orgName, setOrgName] = useState('');
  const [adminName, setAdminName] = useState('');
  const [image, setImage] = useState(null);
  const userType = localStorage.getItem('userType');
  const [showDropdown, setShowDropdown] = useState(false);
  const [bookings, setBookings] = useState(0);

  const dropdownRef = useRef(null);
  const accountIconRef = useRef(null);
  const navigate = useNavigate(); 

  useEffect(() => {
    const storedOrgName = localStorage.getItem('orgName');
    const storedAdminName = localStorage.getItem('adminName');
    const storedImage = localStorage.getItem('image');

    if (userType === "Organization") { 
      setBookings(parseInt(localStorage.getItem('bookingsNum'), 10) || 0);
    } else {
      setBookings(parseInt(localStorage.getItem('handledBookings'), 10) || 0);    
    }

    if (storedOrgName) setOrgName(storedOrgName);
    if (storedAdminName) setAdminName(storedAdminName);
    if (storedImage) setImage(storedImage);

    const handleClickOutside = (event) => {
      if (
        dropdownRef.current && !dropdownRef.current.contains(event.target) &&
        accountIconRef.current && !accountIconRef.current.contains(event.target)
      ) {
        setShowDropdown(false); 
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };

    
  }, []);

  const displayName = userType === "Organization" ? orgName : adminName;

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
        <p>Hi, {displayName}!</p>
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
            <p className="dropdown-org-name">{displayName}</p>
            <p className="dropdown-bookings-num">Bookings: {bookings}</p>
            <Logout className="logout-button" onClick={handleLogout} style={{ fontSize: 20 }}/>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;