import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import '../styles/Sidebar.css';
import logo from '../assets/girlypops-pink.png';
import { SidebarData } from './SidebarData';

function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();
    const { facilityID: paramFacilityID} = useParams();
    const adminID = localStorage.getItem('adminID');
    const userType = localStorage.getItem('userType');
    const orgID = localStorage.getItem("orgID")

    const [facilityID, setFacilityID] = useState(paramFacilityID || "1");

    useEffect(() => {
        if (paramFacilityID) {
            setFacilityID(paramFacilityID);
        }
    }, [paramFacilityID]);

    const handleNavigation = (path) => {
        navigate(path);
    };

    const sidebarItems = SidebarData({ user: userType, orgID: orgID, facilityID: facilityID, adminID: adminID });

    return (
        <div className="Sidebar">
            <h2>MAIN MENU</h2>
            <ul className='SidebarList'>
                {sidebarItems.map((val, key) => {
                    const isActive = location.pathname === val.path;
                    return (
                        <li 
                            key={key} 
                            className={isActive ? "row active" : "row"} 
                            onClick={() => handleNavigation(val.path)}
                        >
                            <div id="icon">{val.icon}</div>
                            <div id="title">{val.title}</div>
                        </li>
                    );
                })}
            </ul>

            <div className="SidebarLogo">
                <h4>Powered by</h4>
                <img src={logo} alt="Logo" />
            </div>
        </div>
    );
}

export default Sidebar;