import React from 'react';
import { Close as CloseIcon } from '@mui/icons-material'; 
import './Modal.css';  

const PrivacyModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Privacy Notice</h2>
          <CloseIcon className="close-icon" onClick={onClose} />
        </div>
        <ol>
          <li><strong>Commitment to Privacy</strong>
          <p>facify is committed to protecting your privacy. This Privacy Notice outlines how we collect, use, disclose, and protect your personal information in compliance with the Data Privacy Act of 2012 (Republic Act No. 10173) of the Philippines.</p>
          </li>
          <li><strong>Collection of Information</strong>
            <p>We may collect personal information from you when you use facify, such as:</p>
            <ul>
              <li><strong>Contact Information:</strong> Name (as provided in your University records), and email address (your official University email)</li>
              <li><strong>Facility Reservation/Booking Information:</strong> Event details, dates, times, facility preferences, required services, and required documents for assessing and processing a facility reservation request.</li>
              <li><strong>Usage Data:</strong> Information about your interactions with facify, such as your facility reservation history, access logs, and interactions with system features.</li>
            </ul>
          </li>
          <li><strong>Use of Information</strong>
            <p>The project team and the facify website use the collected information for the
            following purposes:</p>
            <ul>
              <li><strong>Providing and maintaining facify:</strong> To enable you to book facilities, manage your facility reservations, and access system features.</li>
              <li><strong>Processing facility reservation requests:</strong> To review and approve/deny facility reservation requests and manage the reservation processes.</li>
              <li><strong>Improving facify:</strong> To analyze usage patterns, identify areas for improvement, and enhance the user experience.</li>
              <li><strong>Complying with legal obligations:</strong> To comply with applicable laws and regulations, including the Data Privacy Act of 2012.</li>
              <li><strong>University Administration:</strong> To share relevant information with designated departments within National University - Manila, such as the Physical Facilities Management Office, for administrative and operational purposes related to facility reservation and campus activities.</li>
            </ul>
          </li>
          <li><strong>Data Security</strong>
            <p>facify employs robust security measures to protect your personal information from unauthorized access, use, disclosure, alteration, or destruction in accordance with University policies and the Data Privacy Act of 2012. These measures include:</p>
            <ul>
              <li><strong>Authentication and Access Control:</strong>
                <ul>
                  <li><strong>Secure Login:</strong> Users (students, administrators) authenticate using their official National University - Manila email credentials, ensuring secure access.</li>
                  <li><strong>Role-Based Access Control:</strong> Access to system features and data is restricted based on user roles (students, administrators).</li>
                </ul>
              </li>
              <li><strong>Data Encryption:</strong>
                <ul>
                  <li><strong>Data in Transit:</strong>Data transmitted between your browser and the facify servers is encrypted using HTTPS.</li>
                </ul>
              </li>
            </ul>
          </li>
          <li><strong>Data Retention</strong>
            <p>The project team and the facify website may share your personal information with third parties as necessary to:</p>
            <ul>
              <li><strong>Provide facify:</strong> To our service providers who assist in operating and maintaining the platform.</li>
              <li><strong>Comply with legal obligations:</strong> To comply with lawful requests from law enforcement or other government authorities.</li>
              <li><strong>Protect our rights and interests:</strong> To investigate and prevent fraud, abuse, or other illegal activities.</li>
            </ul>
          </li>
          <li><strong>Data Retention</strong>
            <p>The project team and the facify website will retain your personal information for as long as necessary to fulfill the purposes for which it was collected or as required by law. The project team will also strongly strive to maintain appropriate retention periods for different types of data like facility reservation records.</p>
          </li>
          <li><strong>Your Rights</strong>
            <p>Under the <strong>Data Privacy Act of 2012</strong> (Republic Act No. 10173), you have the following rights:</p>
            <ul>
              <li><strong>Right to Data Privacy:</strong> You have the right to be informed of your rights under the Data Privacy Act of 2012.</li>
              <li><strong>Right to Access:</strong> You have the right to access your personal information that we hold.</li>
              <li><strong>Right to Correction:</strong> You have the right to request the correction of inaccurate or incomplete personal information.</li>
              <li><strong>Right to Data Portability:</strong> You have the right to receive a copy of your personal information in a commonly used and machine-readable format.</li>
              <li><strong>Right to Erasure:</strong> You have the right to request the deletion of your personal information under certain circumstances.</li>
              <li><strong>Right to Restriction of Processing:</strong> You have the right to restrict the processing of your personal information under certain circumstances.</li>
              <li><strong>Right to Object:</strong> You have the right to object to the processing of your personal information, including for direct marketing purposes.</li>
            </ul>
          </li>
          <li><strong>Contacting Us</strong>
            <p>Should you have any questions or concerns regarding this Privacy Notice or the processing of your personal information, please contact the relevant team member at their respective email address.</p>
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
          <li><strong>Changes to this Privacy Notice</strong>
            <p>Should there be any important changes or updates to the website, the project team (girlypops) will update this Privacy Notice from time to time. The project team will notify you of any material changes by posting the updated notice on this page.</p>
          </li>
          <li><strong>Governing Law</strong>
            <p>This Privacy Notice shall be governed by and construed in accordance with the laws of the Philippines, particularly the Data Privacy Act of 2012.</p>
          </li>
        </ol>
        <p>By using facify, you acknowledge that you have read, understood, and agreed to this Privacy Notice and the collection, use, and disclosure of your personal information as described herein.</p>
      </div>
    </div>
  );
};

export default PrivacyModal;