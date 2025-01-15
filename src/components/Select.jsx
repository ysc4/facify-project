import React from 'react';

const Select = ({menuShow, setMenuShow, selected}) => {
    return (
        <div className={`select ${menuShow && 'select-clicked'}`} onClick={() => setMenuShow(!menuShow)}>
        <span className = "selected">
            {selected}
        </span>
        <div className={`caret ${menuShow && 'caret-rotate'}`}></div>
        </div>
    );
}

export default Select;