import React from 'react';
import Progress from './Progress.jsx';
import './ProgressBar.css';
import CheckIcon from '@mui/icons-material/Check';

const ProgressBar = ({ currentStep }) => {
    const totalSteps = 4;

    return (
        <div className="container">
            <div className="progress-container">
                <Progress 
                    totalSteps={totalSteps} 
                    step={currentStep} 
                    className="progress active" 
                />
                <div className={`${currentStep>=1 ? "circle active": "circle"}`}><CheckIcon /></div>
                <div className={`${currentStep>=2 ? "circle active": "circle"}`}><CheckIcon /></div>
                <div className={`${currentStep>=3 ? "circle active": "circle"}`}><CheckIcon /></div>
                <div className={`${currentStep>=4 ? "circle active": "circle"}`}><CheckIcon /></div>
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