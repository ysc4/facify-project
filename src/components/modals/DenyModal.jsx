import React, { useState } from "react";
import Modal from "react-modal";
import Dropdown from "../Dropdown";
import './CancelModal.css';

Modal.setAppElement('#root'); 

export default function DenyModal({ isOpen, onRequestClose, handleDeny }) {
    const [selectedReasonID, setSelectedReasonID] = useState(null);

    const reasons = [
        'Scheduling Conflict',
        'Unauthorized Use',
        'Maintenance or Repairs',
        'Policy Violation',
        'Insufficient Resources',
        'Incomplete or Incorrect Documents'
    ];

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Deny Booking Modal"
            className="modal"
            overlayClassName="overlay"
        >
            <h1>Deny Booking?</h1>
            <p>Are you sure you want to deny this booking? This action cannot be undone, and the reserved slot will become available for others.</p>

            <Dropdown
                className="reason-dropdown"
                options={reasons} 
                defaultValue="Select a reason"
                onSelect={(reason) => {
                    const reasonID = reasons.indexOf(reason) + 1; 
                    setSelectedReasonID(reasonID);
                }}
            />

            <div className="modal-buttons">
                <button className="no-button" onClick={onRequestClose}>No</button>
                <button 
                    className="yes-button" 
                    onClick={() => handleDeny(selectedReasonID)} 
                    disabled={!selectedReasonID} 
                >
                    Yes
                </button>
            </div>
        </Modal>
    );
}