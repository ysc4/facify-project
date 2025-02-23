import React from 'react';
import './StatusCard.css';
import PencilIcon from '@mui/icons-material/Edit'; 

function StatusCard({ icon, status, count, className, statusColor }) {
  return (
    <div className={`status-card ${className}`} style={{ borderBottom: `7px solid ${statusColor}` }}>
      <div className="status-card-icon" style={{ fontSize: '30px', color: '#6B6B6B' }}>
        {icon || <PencilIcon style={{ fontSize: '30px', color: '#6B6B6B' }} />}
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