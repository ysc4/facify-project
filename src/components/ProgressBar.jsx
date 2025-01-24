import React from 'react';
import Progress from './Progress.jsx';
import './ProgressBar.css';
import CheckIcon from '@mui/icons-material/Check';

const ProgressBar = () => {
const [step, setStep] = React.useState(1);
const totalSteps = 4;

function nextStep() {
  if (step < 4) setStep((step) => step + 1);
  // Logic for updating progress
}

  return (
    <div className="container">
    <div className="progress-container">
      <Progress totalSteps={totalSteps} step={step} className="progress active"/>
      <div className={`${step>=1 ? "circle active": "circle"}`}><CheckIcon /></div>
      <div className={`${step>=2 ? "circle active": "circle"}`}><CheckIcon /></div>
      <div className={`${step>=3 ? "circle active": "circle"}`}><CheckIcon /></div>
      <div className={`${step>=4 ? "circle active": "circle"}`}><CheckIcon /></div>
    </div>
    <div className="step-labels">
      <div className={`${step>=1 ? "step-label active": "step-label"}`}>Pencil Booked</div>
      <div className={`${step>=2 ? "step-label active": "step-label"}`}>Complete Requirements</div>
      <div className={`${step>=3 ? "step-label active": "step-label"}`}>For Assessing</div>
      <div className={`${step>=4 ? "step-label active": "step-label"}`}>Approved</div>
    </div>
    <button onClick={nextStep}>Next Step</button> 
  </div>
  );
}

export default ProgressBar;