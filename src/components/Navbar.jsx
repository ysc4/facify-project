import AccountIcon from '@mui/icons-material/AccountCircle';
import NotifIcon from '@mui/icons-material/Notifications';
import '../App.css';
import logo from '../assets/facify-white.png';
import './Navbar.css';
import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom'; 

function Navbar() {
  const [orgName, setOrgName] = useState('');
  const [adminName, setAdminName] = useState('');
  const userType = localStorage.getItem('userType');
  const [showDropdown, setShowDropdown] = useState(false);

  const dropdownRef = useRef(null);
  const accountIconRef = useRef(null);
  const navigate = useNavigate(); 

  useEffect(() => {
    const storedOrgName = localStorage.getItem('orgName');
    const storedAdminName = localStorage.getItem('adminName');

    if (storedOrgName) setOrgName(storedOrgName);
    if (storedAdminName) setAdminName(storedAdminName);

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
      <img src={logo} alt="Logo" />
      <div className="navbar">
        <NotifIcon className="notif-icon" style={{ fontSize: 30 }} />
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
          <ul className="dropdown-list">
            <li>Profile</li>
            <li onClick={handleLogout}>Logout</li> 
          </ul>
        </div>
      )}
    </header>
  );
}

export default Navbar;