import React from 'react';
import { useState } from 'react';
import '../App.css';
import './AddMinusButton.css';

function AddMinusButton({ item, onCountChange }) {
    const [count, setCount] = useState(0);

    const increment = () => {
        const newCount = count + 1;
        setCount(newCount);
        onCountChange(item, newCount);
    }

    const decrement = () => {
        const newCount = count > 0 ? count - 1 : 0;
        setCount(newCount);
        onCountChange(item, newCount);
    }

    return (
        <div className="AddMinusButton">
            <span className="minus" onClick={decrement}>-</span>
            <span className="count">{count}</span>
            <span className="plus" onClick={increment}>+</span>
        </div>
    );
}

export default AddMinusButton;