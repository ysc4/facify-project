import React from 'react';

import ArrowDown from '@mui/icons-material/KeyboardArrowDown';
import './Dropdown.css';

const Dropdown = ({items}) => {
    return (
        <div className="dropdown">
            <div className="dropdown-button">
                <ArrowDown className="arrow-down" style={{ fontSize: 20 }} />
            </div>
            <div className="dropdown-content">
                {items.map((item, index) => (
                    <div key={index} className="dropdown-item">
                        {item}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Dropdown;