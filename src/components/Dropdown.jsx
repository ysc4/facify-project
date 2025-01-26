import React, { useState } from 'react';
import './Dropdown.css';
import Select from './Select';

function Dropdown({ options, onSelect }) {
    const [menuShow, setMenuShow] = useState(false)
    const [selected, setSelected] = useState('All Facilities')

    const selectOption = e => {
        const selectedOption = e.target.innerText;
        setSelected(selectedOption);
        setMenuShow(!menuShow);
        onSelect(selectedOption);
    };

    const dropdownList = options.map((option,index) => (
        <li key={index} onClick={selectOption}>{option}</li> ));

    return (
        <div className="dropdown">
            <Select
                menuShow={menuShow}
                setMenuShow={setMenuShow}
                selected={selected}
            />
            <ul className={`menu ${menuShow && 'menu-open'}`}>
                {dropdownList}
            </ul>
        </div>
    );
}

export default Dropdown;