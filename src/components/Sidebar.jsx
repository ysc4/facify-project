import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../App.css';
import logo from '../assets/girlypops-pink.png';
import { SidebarData } from './SidebarData';


function Sidebar() {

    const navigate = useNavigate();
    const { orgID } = useParams();

    const handleNavigation = (path) => {
        navigate(`${path}/${orgID}`);
    };

    return (
    <div className="Sidebar">
        <h2>MAIN MENU</h2>
        <ul className='SidebarList'>
        {SidebarData.map((val, key)=> {
        return <li 
        key={key} 
        className={window.location.pathname.includes(val.path) ? "row active" : "row"} 
        onClick={() => handleNavigation(val.path)}>
            {" "} 
            <div id="icon">{val.icon}</div>{" "}
            <div id="title">
                {val.title}
            </div>
            </li>; 
        })}
        </ul>

        <div className="SidebarLogo">
            <h4>Powered by</h4>
            <img src={logo} alt="Logo" />
        </div>
    </div>
    );
}

export default Sidebar