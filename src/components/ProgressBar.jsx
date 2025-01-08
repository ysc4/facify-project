import React from 'react';
import './ProgressBar.css';

const ProgressBar = () => {
const steps = ["Pencil Booked", "Complete Requirements", "For Assessing", "Approved"];
  return (
    <div className="progress-bar">
      {steps.map((step, index) => (
        <div key={i} className="step-item">
            <div>{i+1}</div>
            <p className = "step-label">{step}</p>
            </div>
        ))}
    </div>
  );
}

export default ProgressBar;