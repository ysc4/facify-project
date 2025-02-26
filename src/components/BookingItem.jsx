import React from "react";
import "../styles/BookingItem.css";
import { useNavigate } from "react-router-dom";
import { getStatusColor } from "../utils/StatusUtil.jsx";

export const BookingItem = ({ title, location, date, organizer, faciCode, status, orgID}) => {
    const navigate = useNavigate();
    const bookingID = faciCode;
    
    const handleClick = async () => {
        navigate(`/booking-info/${orgID}/${bookingID}`);
    };

    return (
        <div className="booking-item" onClick={handleClick}>
                <div className="details">
                    <div className="booking-item-header">
                        <h2>{title}</h2>
                    </div>
                    <div className="booking-item-content">
                        <p>{location}</p>
                        <p>{date}</p>
                        <p>{organizer}</p>
                    </div>
                </div>
                <div className="status">
                    <div className="faci-code">
                        <h3>{faciCode}</h3>
                    </div>
                    <div className="status-label" style={{ backgroundColor: getStatusColor(status) }}>
                        <p>{status}</p>
                    </div>
                </div>
            </div>
    );
};

export default BookingItem;