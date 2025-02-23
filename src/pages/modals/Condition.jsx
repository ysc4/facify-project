import { Close as CloseIcon } from '@mui/icons-material'; // Import Close icon
import React from 'react';
import './Modal.css'; // Reuse the modal styling

const ConditionModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Terms and Conditions of Use</h2>
          <CloseIcon className="close-icon" onClick={onClose} />
        </div>
        <p>Here are some frequently asked questions and helpful information:</p>
        <ol>
          <li><strong>Acceptance of Terms</strong>
          <p>By accessing or using facify, you agree to be bound by these Terms and Conditions of Use. If you do not agree to these Terms, please do not use facify at all and by any means.</p> </li>
          <li><strong>Use of facify</strong>
          <p>facify is a web-based platform designed for booking facilities at National University - Manila. facify is intended for use by authorized members of the National University - Manila community only. You may use facify only for lawful purposes related to academic, research, or university-sanctioned activities and in accordance with these Terms.</p> </li>
          <li><strong>Account Access and Security</strong>
            <ul>
              <li><strong>Authentication:</strong> Users (both students and administrators) must log in using their official University email addresses (student email for students, work email for administrators).</li>
              <li><strong>Account Redirection:</strong> Upon successful login, students will be redirected to their designated homepage, while administrators will be redirected to their administrative dashboard.</li>
              <li><strong>Account Security:</strong> You are responsible for maintaining the confidentiality of your account credentials and for any activity that occurs under your account. Do not share your account credentials with any other person.</li>
            </ul>
          </li>
          <li><strong>Prohibited Conduct</strong>
            <p>You may not use facify to:</p>
            <ul>
              <li>Violate any applicable University laws or regulations.</li>
              <li>Violate the Data Privacy Act of 2012 (Republic Act No. 10173).</li>
              <li>Impersonate another person or entity.</li>
              <li>Interfere with the proper functioning of facify.</li>
              <li>Transmit any viruses or other harmful code.</li>
              <li>Collect or use any personal information of other users without their consent.</li>
              <li>Make any unauthorized use of facify, its features, content, or its data.</li>
              <li>Use facify for any commercial purposes or for any activity that is not directly related to University-sanctioned events or activities.</li>
              <li>Share your account credentials with any other person.</li>
            </ul>
          </li>
        </ol>
      </div>
    </div>
  );
};

export default ConditionModal;