import React from 'react';
import './Admin-StatusCard.css';
import PencilIcon from '@mui/icons-material/Edit'; 

function StatusCard({ icon, status, count, className }) {
  return (
    <div className={`status-card ${className}`}>
      <div className="status-card-icon" style={{ fontSize: '12px', color: '#6B6B6B' }}>
        {icon || <PencilIcon style={{ fontSize: '12px', color: '#6B6B6B' }} />}
      </div>
      <div className="status-card-details">
        <h3 className="status-card-count">{count}</h3>
        <p className="status-card-status">{status}</p>
      </div>
      <div className="status-card-divider" />
    </div>
  );
}

export default StatusCard;
