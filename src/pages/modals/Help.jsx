import React from 'react';
import { Close as CloseIcon } from '@mui/icons-material'; // Import Close icon
import './Modal.css';  // Reuse the modal styling

const HelpModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Help</h2>
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

export default HelpModal;