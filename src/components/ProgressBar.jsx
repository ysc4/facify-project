import React from 'react';
import Progress from './Progress.jsx';
import './ProgressBar.css';

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
      <div className={`${step>=1 ? "circle active": "circle"}`}>1</div>
      <div className={`${step>=2 ? "circle active": "circle"}`}>2</div>
      <div className={`${step>=3 ? "circle active": "circle"}`}>3</div>
      <div className={`${step>=4 ? "circle active": "circle"}`}>4</div>
    </div>
    <div className="progress-labels">
      <p>Pencil Booked</p>
      <p>Complete Requirements</p>
      <p>For Assessing</p> 
      <p>Approved</p>
    </div>
    <button onClick={nextStep}>Next Step</button> 
  </div>
  );
}

export default ProgressBar;