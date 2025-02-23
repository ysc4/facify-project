import React from 'react';
import { Close as CloseIcon } from '@mui/icons-material'; 
import './Modal.css';  

const PrivacyModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Terms and Conditions of Use</h2>
          <CloseIcon className="close-icon" onClick={onClose} />
        </div>
        <p>Here are some frequently asked questions and helpful information:</p>
        <ul>
          <li>How do I book a space?</li>
          <li>How do I reset my password?</li>
          <li>Contact support if you face any issues.</li>
        </ul>
      </div>
    </div>
  );
};

export default PrivacyModal;