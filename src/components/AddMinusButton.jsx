import React, { useEffect, useState } from 'react';
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

    const handleInputChange = (e) => {
        let value = e.target.value;

        if (value === "") {
            setCount("");
            onCountChange(item, 0);
            return;
        }

        const parsedValue = parseInt(value, 10);

        if (!isNaN(parsedValue) && parsedValue >= 0) {
            setCount(parsedValue);
            onCountChange(item, parsedValue);
        }
    };

    const handleBlur = () => {
        if (count === "") {
            setCount(0);
            onCountChange(item, 0);
        }
    };

    return (
        <div className="AddMinusButton">
            <button className="minus" onClick={decrement} aria-label="Decrease count">-</button>
            <input 
                type="number"
                className="count-input"
                value={count}
                onChange={handleInputChange}
                onBlur={handleBlur}
                min="0"
                aria-live="polite"
            />
            <button className="plus" onClick={increment} aria-label="Increase count">+</button>
        </div>
    );
}

export default AddMinusButton;