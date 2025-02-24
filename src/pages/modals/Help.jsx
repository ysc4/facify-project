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
        <ol>
        <li><strong>Contacting Us</strong>
            <p>For any questions about facify, please contact the relevant team member at their respective email address.</p>
            <ul>
              <li><strong>Sonya G. Lee</strong> - <em>Group Leader & Designer</em>
                <ul>
                  <li>leesg@students.national-u.edu.ph</li>
                </ul>
              </li>
              <li><strong>Janna Victoria P. Cofreros</strong> - <em>Analyst</em>
                <ul>
                  <li>cofrerosjp@students.national-u.edu.ph</li>
                </ul>
              </li>
              <li><strong>Jessy Cassandra M. Mapanao</strong> - <em>Developer</em>
                <ul>
                  <li>mapanaojm@students.national-u.edu.ph</li>
                </ul>
              </li>
              <li><strong>Josephine Andrea B. Padilla</strong> - <em>Researcher & Technical Writer</em>
                <ul>
                  <li>padillajb1@students.national-u.edu.ph</li>
                </ul>
              </li>
            </ul>
          </li>
          <li><strong>Troubleshooting</strong>
            <ul>
              <li><strong>Common Issues:</strong>
                <ul>
                  <li><strong>Unable to log in:</strong>
                    <ul>
                      <li>Check your username and password.</li>
                      <li>Ensure you are using your official NU email address.</li>
                    </ul>
                  </li>
                  <li><strong>Facility Reservation Errors:</strong>
                    <ul>
                      <li>Ensure you have selected available dates and times.</li>
                      <li>Review your facility reservation request form and its details for any missing or incomplete information before submission.</li>
                      <li>Check the status of your facility reservation request/s in the "Facility Reservation" tab of your account.</li>
                    </ul>
                  </li>
                  <li><strong>Technical Difficulties:</strong>
                    <ul>
                      <li>Check your internet connection. Ensure you have a stable and reliable internet connection.</li>
                      <li>Clear your browser cache and cookies.</li>
                      <li>Try accessing facify from a different browser.</li>
                      <li>If the issue persists, please report it to our team for assistance.</li>
                    </ul>
                  </li>
                  <li><strong>System Requirements:</strong>
                    <ul>
                      <li><strong>Supported browsers:</strong> Chrome, Edge</li>
                      <li>Stable internet connection</li>
                    </ul>
                  </li>
                </ul>
              </li>
            </ul>
          </li>
          <li><strong>Reporting Issues</strong>
            <p>To report any technical problems, suggest improvements, or provide feedback, we are happy to welcome any concerns and comments. Please do not hesitate to reach out and contact our team.</p>
          </li>
        </ol>
      </div>
    </div>
  );
};

export default HelpModal;