import React from "react";
import Modal from "react-modal";
import './CancelModal.css';

Modal.setAppElement('#root'); // Set the root element for accessibility

export default function CancelModal({ isOpen, onRequestClose, handleCancel }) {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Cancel Booking Modal"
            className="modal"
            overlayClassName="overlay"
        >
            <h1>Cancel Booking?</h1>
            <p>Are you sure you want to cancel this booking? This action cannot be undone, and the reserved slot will become available for others.</p>
            <div className="modal-buttons">
                <button className="no-button" onClick={onRequestClose}>No</button>
                <button className="yes-button" onClick={handleCancel}>Yes</button>
            </div>
        </Modal>
    );
}