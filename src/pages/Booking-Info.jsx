import BackIcon from '@mui/icons-material/ArrowBack';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import CancelModal from '../components/CancelModal';
import Header from '../components/Navbar';
import ProgressBar from '../components/ProgressBar';
import Sidebar from '../components/Sidebar';
import SubmitRequirements from './Submit-Requirements';
import './Booking-Info.css';

const formatDate = (dateString) => {
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
};

const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    const formattedDate = date.toLocaleDateString("en-US", options);
    
    const hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    return `${formattedDate} ${formattedHours}:${minutes} ${ampm}`;
};

function BookingInfo() {
    const { bookingID, orgID, facilityID } = useParams();
    const navigate = useNavigate();
    const [bookingInfo, setBookingInfo] = useState([]);
    const [error, setError] = useState('');
    const [logs, setLogs] = useState([]);
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);

    useEffect(() => {
        const fetchBookingInfo = async () => {
            try {
                const response = await axios.get(`/facify/booking-info/${orgID}/${bookingID}`);

                if (response.data.success) {
                    setBookingInfo([response.data.bookingInfo[0]]);
                    const statusSteps = {
                        'Pencil Booked': 1,
                        'Officially Booked': 2,
                        'For Assessing': 3,
                        'Approved': 4,
                        'Denied': 0
                    };
                    setCurrentStep(statusSteps[response.data.bookingInfo[0].status_name] || 0);
                } else {
                    setError('No booking information found');
                }
            } catch (err) {
                console.error('Error fetching booking information:', err);
                setError('An error occurred while fetching booking information');
            }
        };

        const fetchLogs = async () => {
            try {
                const response = await axios.get(`/facify/booking-info/${orgID}/${bookingID}/logs`);
                if (response.data.success) {
                    setLogs(response.data.logs);
                } else {
                    console.error('Error fetching logs:', response.data.message);
                }
            } catch (err) {
                console.error('Error fetching logs:', err);
            }
        };

        fetchLogs();
        fetchBookingInfo();
    }, [orgID, bookingID]);

    const handleCancelBooking = async () => {
        try {
            const response = await axios.post(`/facify/booking-info/${bookingID}/cancel`);
            if (response.data.success) {
                alert('Booking has been successfully cancelled.');
                setCurrentStep(0); 
            } else {
                alert('Failed to cancel the booking. Please try again.');
            }
        } catch (err) {
            console.error('Error cancelling booking:', err);
            alert('An error occurred while cancelling the booking.');
        }
        setIsCancelModalOpen(false);
        fetchLogs();
    };

    const handleOpenCancelModal = () => {
        setIsCancelModalOpen(true);
    };

    const handleCloseCancelModal = () => {
        setIsCancelModalOpen(false);
    };

    const handleBackButtonClick = () => {
        navigate(-1);
    };

    const handleEdit = () => {
        navigate(`/venue-booking/${orgID}/${facilityID}`, { state: bookingInfo[0] });
    };

    const handleSubmit = () => {
        navigate(`/submit-requirements/${orgID}/${bookingID}`);
    }

    return (
        <div className="BookingInfo">
            <Header />
            <div className="main-content">
                <div className="sidebar-placeholder">
                    <Sidebar />
                </div>
                <div className="booking-details">
                    {error && <p className="error">{error}</p>}
                    {bookingInfo.length === 0 ? (
                        <p>No booking information available.</p>
                    ) : (
                        bookingInfo.map((booking) => (
                            <div key={booking.booking_id}>
                                <div className="booking-details_header">
                                    <div className="booking">
                                        <BackIcon className="back-icon" style={{ fontSize: 40 }} onClick={handleBackButtonClick} />
                                        <h2>Booking Information - {booking.booking_id}</h2>
                                    </div>
                                    <div className="booking-buttons">
                                        <button className="submitReqs-button" onClick={handleSubmit} disabled={currentStep === 0} >Submit Requirements</button>
                                        <button className="edit-button" onClick={handleEdit} disabled={currentStep === 0 || 2} >Edit Submission</button>
                                    </div>
                                </div>
                                <div className="booking-progress">
                                    <ProgressBar currentStep={currentStep} />
                                </div>
                                <div className="event-info">
                                    <h3>Event Information</h3>
                                    <div className="content">
                                        <div className="labels">
                                            <h4>Facility</h4>
                                            <h4>Date & Time Slot</h4>
                                            <h4>Name of the Organization/Dept/College</h4>
                                            <h4>Title of Activity</h4>
                                            <h4>Expected Attendance</h4>
                                            <h4>Name of Speaker</h4>
                                        </div>
                                        <div className="values">
                                            <p>{booking.facility_name}</p>
                                            <p>{`${formatDate(booking.event_date)} ${booking.event_start} - ${booking.event_end}`}</p>
                                            <p>{booking.org_name}</p>
                                            <p>{booking.activity_title}</p>
                                            <p>{booking.expected_attendance}</p>
                                            <p>{booking.speaker_name}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="other-info">
                                    <h3>Other Items and Services Needed</h3>
                                    <div className="content">
                                        <div className="items-column">
                                            <div className="labels">
                                                <h4>Tables</h4>
                                                <h4>Chairs</h4>
                                                <h4>Bulletin Boards</h4>
                                                <h4>Speaker</h4>
                                                <h4>Microphone</h4>
                                            </div>
                                            <div className="values">
                                                <p>{booking.tables}</p>
                                                <p>{booking.chairs}</p>
                                                <p>{booking.bulletin_boards}</p>
                                                <p>{booking.speaker}</p>
                                                <p>{booking.microphone}</p>
                                            </div>
                                        </div>
                                        <div className="equipment-column">
                                            <div className="labels">
                                                <h4>Flag</h4>
                                                <h4>Podium</h4>
                                                <h4>Platform</h4>
                                                <h4>Electricians</h4>
                                                <h4>Janitor</h4>
                                            </div>
                                            <div className="values">
                                                <p>{booking.flagpole}</p>
                                                <p>{booking.podium}</p>
                                                <p>{booking.platform}</p>
                                                <p>{booking.electrician}</p>
                                                <p>{booking.janitor}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <CancelModal isOpen={isCancelModalOpen} onRequestClose={handleCloseCancelModal} handleCancel={handleCancelBooking}/>
                            </div>
                    )))}            
                <div className="update-logs">
                    <h3>Update Logs</h3>
                    <div className="logs">
                        {logs.length > 0 ? (
                        logs.map((log, index) => (
                            <div className="log" key={index}>
                            <div className="log-entry">
                                <p>{log.remarks}</p>
                            </div>
                            <div className="log-date">
                                <p>{formatDateTime(log.date_time)}</p>
                            </div>
                            </div>
                        ))
                        ) : (
                        <p>No logs available.</p>
                        )}
                    </div>
                </div>
                <button className="cancel-button" onClick={handleOpenCancelModal} disabled={currentStep === 0} >Cancel Booking</button>
            </div>
        </div>
    </div>
  );
}

export default BookingInfo;