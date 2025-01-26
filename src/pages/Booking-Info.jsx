// filepath: /Users/yscalify/facify-project/src/pages/Booking-Info.jsx
import BackIcon from '@mui/icons-material/ArrowBack';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import CancelModal from '../components/CancelModal';
import Header from '../components/Navbar';
import ProgressBar from '../components/ProgressBar';
import Requirement from '../components/Requirement';
import Sidebar from '../components/Sidebar';
import FileUploader from '../components/FileUploader';
import './Booking-Info.css';

const formatDate = (dateString) => {
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
};

function BookingInfo() {
    const { bookingID } = useParams();
    const [bookingInfo, setBookingInfo] = useState([]);
    const [error, setError] = useState('');
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    const [isFileUploaderOpen, setIsFileUploaderOpen] = useState(false);
    const [currentRequirement, setCurrentRequirement] = useState(null);

    useEffect(() => {
        const fetchBookingInfo = async () => {
            try {
                const response = await axios.get(`/facify/booking-info/${bookingID}`);
                if (response.data.success) {
                    setBookingInfo(response.data.bookingInfo);
                } else {
                    setError('No booking information found');
                }
            } catch (err) {
                console.error('Error fetching booking information:', err);
                setError('An error occurred while fetching booking information');
            }
        };
        fetchBookingInfo();
    }, [bookingID]);

    const handleOpenCancelModal = () => {
        setIsCancelModalOpen(true);
    };

    const handleCloseCancelModal = () => {
        setIsCancelModalOpen(false);
    };

    const handleOpenFileUploader = (requirement) => {
        setCurrentRequirement(requirement);
        setIsFileUploaderOpen(true);
    };

    const handleCloseFileUploader = () => {
        setIsFileUploaderOpen(false);
        setCurrentRequirement(null);
    };

    const handleFileUpload = (file) => {
        console.log('File uploaded:', file);
    };

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
                                        <BackIcon className="back-icon" style={{ fontSize: 40 }} />
                                        <h2>Booking Information - {booking.booking_id}</h2>
                                    </div>
                                    <div className="booking-buttons">
                                        <button className="cancel-button" onClick={handleOpenCancelModal}>Cancel Booking</button>
                                        <Link to="/venue-booking">
                                            <button className="edit-button">Edit Submission</button>
                                        </Link>
                                    </div>
                                </div>
                                <div className="booking-progress">
                                    <ProgressBar />
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
                                <div className="submit-reqs">
                                    <h3>Submitted Requirements</h3>
                                    <div className="reqs">
                                        <div className="table-header">
                                            <div className="req-title">Requirement</div>
                                            <div className="date-title">Date Submitted</div>
                                            <div className="file-title">File</div>
                                        </div>
                                        <div className="table-content">
                                            <div className="file" onClick={() => handleOpenFileUploader("Letter of Intent")}>
                                                <Requirement className = "requirement" requirement_name="Letter of Intent" date_submitted={booking.date_submitted} file_name={booking.file_name} file_size={booking.file_size} file={booking.file} />
                                            </div>
                                            <div className="file" onClick={() => handleOpenFileUploader("Activity Reservation Form")}>
                                                <Requirement className = "requirement" requirement_name="Activity Reservation Form" date_submitted={booking.date_submitted} file_name={booking.file_name} file_size={booking.file_size} file={booking.file} />
                                            </div>
                                            <div className="file" onClick={() => handleOpenFileUploader("Event Proposal")}>
                                                <Requirement className = "requirement" requirement_name="Event Proposal" date_submitted={booking.date_submitted} file_name={booking.file_name} file_size={booking.file_size} file={booking.file} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <CancelModal isOpen={isCancelModalOpen} onRequestClose={handleCloseCancelModal} />
                                <FileUploader isOpen={isFileUploaderOpen} onRequestClose={handleCloseFileUploader} onFileUpload={handleFileUpload} requirementName={currentRequirement} bookingID={bookingID} />
                            </div>
                        ))
                    )}             
          {/* <div className="update-logs">
            <h3>Update Logs</h3>
            <div className="logs">
              <div className="log">
                <div className="log-entry">
                  <p>Booking was created. <b>FACI0001</b> by ORGANIZATION NAME</p>
                </div>
                <div className="log-date">
                  <p>January 05, 2024 11:00AM</p>
                </div>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}

export default BookingInfo;
