import React from 'react';

function Progress({ totalSteps, step, status }) {
    const progress = (status === "Approved" || status === "Denied") ? 100 : ((step - 1) / (totalSteps - 1)) * 100;

    let progressColor = "#FFDC5E"; 
    if (status === "Approved") progressColor = "#0B8C2F";
    if (status === "Denied") progressColor = "#B71919";

    return (
        <div className="progress" 
        style={{
            height: "4px", 
            background: "#ddd", 
            width: "100%", 
            transition: "all 0.4s ease-in"}}>

            <div className="progress" 
            style={{
                height: "4px", 
                background: progressColor, 
                width: `${progress}%`, 
                transition: "all 0.4s ease-in"}}>
            </div>    
        </div>
    );
}

export default Progress;