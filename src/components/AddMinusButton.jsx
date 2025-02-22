import React, { useState, useEffect } from 'react';
import '../App.css';
import './AddMinusButton.css';

function AddMinusButton({ item, onCountChange, initialValue = 0 }) {
    const [count, setCount] = useState(initialValue);

    useEffect(() => {
        setCount(initialValue);
    }, [initialValue]); 

    const increment = () => {
        const newCount = count + 1;
        setCount(newCount);
        onCountChange(item, newCount);
    };

    const decrement = () => {
        if (count === 0) return; 
        const newCount = count - 1;
        setCount(newCount);
        onCountChange(item, newCount);
    };

    return (
        <div className="AddMinusButton">
            <span className="minus" onClick={decrement} aria-label="Decrease count">-</span>
            <span className="count" aria-live="polite">{count}</span>
            <span className="plus" onClick={increment} aria-label="Increase count">+</span>
        </div>
    );
}

export default AddMinusButton;