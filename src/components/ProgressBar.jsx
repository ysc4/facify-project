import React from 'react';
import Progress from './Progress.jsx';
import './ProgressBar.css';

const ProgressBar = ({ currentStep, status }) => {
    const totalSteps = 4;

    let circleColor = "active"; 
    if (status === "Approved") circleColor = "approved"; 
    if (status === "Denied") circleColor = "denied";

    return (
        <div className="container">
            <div className="progress-container">
                <Progress 
                    totalSteps={totalSteps} 
                    step={currentStep} 
                    status={status} 
                    className="progress active" 
                />
                <div className={`${currentStep>=1 ? `circle ${circleColor}`: "circle"}`}></div>
                <div className={`${currentStep>=2 ? `circle ${circleColor}`: "circle"}`}></div>
                <div className={`${currentStep>=3 ? `circle ${circleColor}`: "circle"}`}></div>
                <div className={`${currentStep>=4 ? `circle ${circleColor}`: "circle"}`}></div>
            </div>
            <div className="step-labels">
                <div className={`${currentStep>=1 ? "step-label active": "step-label"}`}>Pencil Booked</div>
                <div className={`${currentStep>=2 ? "step-label active": "step-label"}`}>Officially Booked</div>
                <div className={`${currentStep>=3 ? "step-label active": "step-label"}`}>For Assessing</div>
                <div className={`${currentStep>=4 ? "step-label active": "step-label"}`}>Approved</div>
            </div>
        </div>
    );
};

export default ProgressBar;