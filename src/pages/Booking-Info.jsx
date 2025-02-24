import BackIcon from '@mui/icons-material/ArrowBack';
import PdfIcon from '@mui/icons-material/Description';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CancelModal from '../components/CancelModal';
import Header from '../components/Navbar';
import ProgressBar from '../components/ProgressBar';
import Sidebar from '../components/Sidebar';
import './Booking-Info.css';
import { format } from 'mysql';


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
    const userType = localStorage.getItem('userType');
    const adminID = localStorage.getItem('adminID');
    const { bookingID, orgID, facilityID } = useParams();
    const navigate = useNavigate();
    const [bookingInfo, setBookingInfo] = useState([]);
    const [error, setError] = useState('');
    const [logs, setLogs] = useState([]);
    const [requirements, setRequirements] = useState([]); 
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const [decision, setDecision] = useState(null); 
    const [decisionDateTime, setDecisionDateTime] = useState(null); 

    const requirementNames = ["Activity Request Form", "Event Proposal", "Ingress Form", "Letter of Intent"];

    useEffect(() => {
        console.log(userType);
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

        const fetchRequirements = async () => {
            if (userType === "Admin") {
                try {
                    const response = await axios.get(`/facify/booking-info/${orgID}/${bookingID}/requirements`);
                    if (response.data.success) {
                        setRequirements(response.data.requirements);
                        console.log("Logs API Response:", response.data); // Debugging line
                    } else {
                        console.error('Error fetching requirements:', response.data.message);
                        setRequirements([]);
                    }
                } catch (err) {
                    console.error('Error fetching requirements:', err);
                }
            }
        };

        fetchLogs();
        fetchBookingInfo();
        fetchRequirements();
    }, [orgID, bookingID, userType]);

    const fetchLogs = async () => {
        try {
            const response = await axios.get(`/facify/booking-info/${orgID}/${bookingID}/logs`);
            if (response.data.success) {
                const logs = response.data.logs;
                const sortedLogs = logs.sort((a, b) => new Date(a.date_time) - new Date(b.date_time));
                const latestLog = sortedLogs[sortedLogs.length - 1];
                
                if (logs.length > 0) {
                    if (latestLog.status_name === "Approved") {
                        setDecision("approved");
                    } else if (latestLog.status_name === "Denied") {
                        setDecision("denied");
                    } else if (latestLog.status_name === "Cancelled") {
                        setDecision("cancelled");
                    }
                    setDecisionDateTime(formatDateTime(latestLog.date_time)); 
                    setLogs(logs);
                }
            } else {
                setError('No logs found for this booking');
            }
        } catch (err) {
            console.error('Error fetching logs:', err);
        }
    };

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
        setDecision("cancelled");
        setDecisionDateTime(new Date().toLocaleString());
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

    const updateBookingStatus = async (action) => {
        try {
            const response = await axios.post(`/facify/booking-info/${bookingID}/${adminID}/update-status`, { action });
            console.log(response.data.message);
            setCurrentStep(action === "For Assessing" ? 3 : action === "Approved" ? 4 : 0);
            fetchLogs();
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };
    
    const handleAssess = () => updateBookingStatus("For Assessing");
    const handleApprove = () => updateBookingStatus("Approved");
    const handleDeny = () => updateBookingStatus("Denied");

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
                                        {userType === 'Organization' ? (
                                            <>
                                            {currentStep === 1 || currentStep === 2 ? (
                                                <>
                                                    <button className="submitReqs-button" onClick={handleSubmit} disabled={currentStep === 0}>
                                                        Submit Requirements
                                                    </button>
                                                    <button className="edit-button" onClick={handleEdit} disabled={currentStep === 0 || currentStep === 2}>
                                                        Edit Submission
                                                    </button>
                                                </>
                                            ) : currentStep === 4 || currentStep === 0 ? (
                                                <p>Booking has been <strong>{decision}</strong> on {decisionDateTime}.</p>
                                            ) : null}
                                        </>
                                        ) : (
                                            <>
                                                {currentStep === 1 || currentStep === 2 ? (
                                                    <button className="assess-button" onClick={handleAssess} disabled={currentStep === 1}>
                                                        Mark as For Assessing
                                                    </button>
                                                ) : currentStep === 3 ? (
                                                    <>
                                                        <button className="approve-button" onClick={handleApprove} >
                                                            Approve Booking
                                                        </button>
                                                        <button className="deny-button" onClick={handleDeny} >
                                                            Deny Booking
                                                        </button>
                                                    </>
                                                ) : (
                                                    <p>Booking has been <strong>{decision}</strong> on {decisionDateTime}.</p>
                                                )}
                                            </>
                                        )}
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
                        ))
                    )}
                    {userType === 'Admin' && (
                        <div className="submit-info">
                            <h3>Submitted Requirements</h3>
                            <div className="reqs-table">
                                <div className="reqs-table-header">
                                    <div className="req-title">Requirement</div>
                                    <div className="date-title">Date Submitted</div>
                                    <div className="file-title">File</div>
                                </div>
                                <div className="table-content">
                                    {requirementNames.map((requirementName) => {
                                        const matchingRequirement = requirements.find(req =>
                                            req.file_name?.toLowerCase().includes(requirementName.toLowerCase())
                                        );
                                        return (
                                            <div className="req" key={requirementName}>
                                                <div className="file-name">{requirementName}</div>
                                                <div className="date">
                                                    {matchingRequirement
                                                        ? new Date(matchingRequirement.date_time_submitted).toLocaleString()
                                                        : '—'}
                                                </div>
                                                <div className="file">
                                                    {matchingRequirement ? (
                                                        <div className="file-item">
                                                            <PdfIcon className="file-icon" />
                                                            <div className="file-info">
                                                                <h4>{matchingRequirement.file_name}</h4>
                                                                <p>{(matchingRequirement.file_size / 1024).toFixed(2)} KB</p>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <p>No file uploaded</p>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}
                    <div className="update-logs">
                        <h3>Update Logs</h3>
                        <div className="logs">
                            {logs && logs.length > 0 ? (
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
                    {userType === 'Organization' && (
                        <button className="cancel-button" onClick={handleOpenCancelModal} disabled={currentStep === 0 || currentStep === 3 || currentStep === 4}> Cancel Booking </button> )}
                </div>
            </div>
        </div>
    );
}

export default BookingInfo;