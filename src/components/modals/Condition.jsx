import { Close as CloseIcon } from '@mui/icons-material'; 
import React from 'react';
import './LoginModal.css';  

const ConditionModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Terms and Conditions of Use</h2>
          <CloseIcon className="close-icon" onClick={onClose} />
        </div>
        <ol>
          <li><strong>Acceptance of Terms</strong>
          <p>By accessing or using facify, you agree to be bound by these Terms and Conditions of Use. If you do not agree to these Terms, please do not use facify at all and by any means.</p> </li>
          <li><strong>Use of facify</strong>
          <p>facify is a web-based platform designed for facility reservations at National University - Manila. facify is intended for use by authorized members of the National University - Manila community only. You may use facify only for lawful purposes related to academic, research, or university-sanctioned activities and in accordance with these Terms.</p> </li>
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
          <li><strong>Facility Reservation Procedures</strong>
            <ul>
              <li><strong>User Requirements:</strong> Users/Students are required to read and agree to the Terms and Conditions for Facility Use before submitting a facility reservation:
              <ul>
                <li>Submit the reservation form along with the venue layout.</li>
                <li>Use the facility only for the purpose stated in the reservation form.</li>
                <li>Decorations must comply with guidelines and avoid fire safety equipment or structural elements.</li>
                <li>Posting materials on walls or backdrops is strictly prohibited.</li>
                <li>Organizations are responsible for setup, cleanup, and restoring the facility to its original state.</li>
                <li>Ensure compliance with facility capacity limits.</li>
                <li>Alcohol and drugs are prohibited on the premises.</li>
                <li>Individuals under the influence are not allowed.</li>
                <li>Vacate the facility after the reserved date and time.</li>
                <li>Conduct final coordination with the Physical Facilities Management Office staff three to four days before the event.</li>
              </ul>
              </li>
              <li><strong>Requirement Submission:</strong> Students are required to submit the soft copy of the following documents within <strong>two weeks</strong> of submitting their facility reservation:
              <ul>
                <li>Activity Request Form</li>
                <li>Event Proposal</li>
                <li>Letter of Intent</li>
                <li>Ingress Form (optional)</li>
              </ul>
              <p>These documents must be uploaded to the "Submitted Requirements" section within the "Facility Reservation" tab menu.</p>
              </li>
              <li><strong>Facility Reservation Assessment Phase:</strong> Upon the completion of all required document submissions by the student, the facility reservation will enter its assessment phase.</li>
              <li><strong>Facility Reservation Cancellation/Editing:</strong> Students may cancel or edit their facility reservation before the assessment phase ("For Assessing") begins.</li>
              <li><strong>Event Information Visibility at the Facility Availability Calendar:</strong> 
              <ul>
                <li>Students can only view brief or main details of events on the public "Facility Availability" calendar to prevent any event spoilers or leaks.
                  <ul>
                    <li>Students can fully view their own submitted event information, facility reservation/booking information, and submitted requirements (including Update Log) within their "Facility Reservation" tab.</li>
                  </ul>
                </li>
                <li>Full event details are accessible only to administrators on their administrative side of the Facility Availability calendar.</li>
              </ul>
              </li>
              <li><strong>Facility Reservation Approval/Rejection:</strong> Administrators can approve or reject facility reservations and must select rejection reasons from a predefined list on their Facility Reservations tab, including:
                <ul>
                  <li>Scheduling Conflict</li>
                  <li>Unauthorized Use</li>
                  <li>Maintenance or Repairs</li>
                  <li>Policy Violation</li>
                  <li>Insufficient Resources</li>
                  <li>Incomplete or Incorrect Documents</li>
                </ul>
                Students will be notified of the assessment outcome (approved or rejected) of their facility reservations through the "Update Log" section within their "Facility Reservation" tab.
              </li>
            </ul>
          </li>
          <li><strong>Disclaimer of Warranties</strong>
          <p>facify is provided "as is" without any warranties, express or implied, including but not limited to warranties of merchantability for a particular purpose. <strong>We do not warrant that facify will be uninterrupted or error-free.</strong></p>
          </li>
          <li><strong>Changes to Terms</strong>
          <p>Should there be any important updates or changes to the website, the project team (girlypops) will update these Terms occasionally. We will notify users of any material changes by posting the updated Terms on this page.</p>
          </li>
          <li><strong>Governing Law</strong>
          <p>These Terms and Conditions shall be governed by and construed in accordance with the laws of the Philippines.</p>
          </li>
        </ol>
      </div>
    </div>
  );
};

export default ConditionModal;