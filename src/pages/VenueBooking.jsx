import BackIcon from '@mui/icons-material/ArrowBackOutlined';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import AddMinusButton from '../components/AddMinusButton';
import Header from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import '../styles/VenueBooking.css';

function VenueBooking() {
  const { orgID, facilityID } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const existingData = location.state || {};
  const [status, setStatus] = useState("");
  const [bookingID, setBookingID] = useState("");

  const facilityNames = {
    1: "Amphitheater",
    2: "E-Library",
    3: "Multimedia Room",
    4: "Multipurpose Hall",
    5: "PE Area"
  };

  const [formData, setFormData] = useState({
    bookingID: "",
    orgID: orgID,
    eventDate: "",
    eventStart: "",
    eventEnd: "",
    activityTitle: "",
    facilityID: facilityID || "",
    attendance: "",
    speakerName: "",
    equipment: {
      tables: 0,
      chairs: 0,
      bulletinBoards: 0,
      speaker: 0,
      microphone: 0,
      flagpole: 0,
      podium: 0,
      platform: 0,
      electrician: 0,
      janitor: 0
    },
    status: status,
    bookingDate: new Date(Date.now() + 8 * 60 * 60000).toISOString().slice(0, 10),
    bookingTime: new Date(Date.now() + 8 * 60 * 60000).toISOString().slice(11, 19)
  });

  useEffect(() => {
    if (existingData?.booking_id) { 
        setBookingID(existingData.booking_id);
        setFormData({
            bookingID: existingData.booking_id,
            orgID: existingData.orgID || orgID,
            eventDate: new Date(existingData.event_date).toISOString().split('T')[0] || "",
            eventStart: existingData.event_start || "",
            eventEnd: existingData.event_end || "",
            activityTitle: existingData.activity_title || "",
            facilityID: existingData.facilityID || facilityID,
            attendance: existingData.expected_attendance || "",
            speakerName: existingData.speaker_name || "",
            equipment: {
                tables: existingData.tables || 0,
                chairs: existingData.chairs || 0,
                bulletinBoards: existingData.bulletin_boards || 0,
                speaker: existingData.speaker || 0,
                microphone: existingData.microphone || 0,
                flagpole: existingData.flagpole || 0,
                podium: existingData.podium || 0,
                platform: existingData.platform || 0,
                electrician: existingData.electrician || 0,
                janitor: existingData.janitor || 0
            },
            status: "pencil",
        });
    }
}, [existingData, orgID, facilityID]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
    setFormData((prevData) => ({
      ...prevData,
      status: e.target.value
    }));
  };

  const handleCountChange = (title, count) => {
    setFormData((prevData) => ({
      ...prevData,
      equipment: {
        ...prevData.equipment,
        [title]: count
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const equipmentArray = [
      formData.equipment.tables,
      formData.equipment.chairs,
      formData.equipment.bulletinBoards,
      formData.equipment.speaker,
      formData.equipment.microphone,
      formData.equipment.flagpole,
      formData.equipment.podium,
      formData.equipment.platform,
      formData.equipment.electrician,
      formData.equipment.janitor
  ];

    const finalFormData = { ...formData, equipment: equipmentArray };

    console.log('Server response:', finalFormData);

    try {
      let response;
      
      if (bookingID) {
          response = await axios.put(`/facify/booking-info/${bookingID}/update`, finalFormData);
          if (response.data.success) {
              alert('Booking updated successfully');
              navigate(`/booking-info/${orgID}/${bookingID}`);
          } else {
              alert('Error updating booking');
          }
      } else {
          response = await axios.post(`/facify/venue-booking/${orgID}/${facilityID}/create`, finalFormData);
          if (response.data.success) {
              alert('Booking created successfully');
              setBookingID(response.data.bookingID); 
              navigate(`/venue-availability/${facilityID}`);
          } else {
              alert('Error creating booking');
          }
      }
  } catch (error) {
      console.error('Error submitting booking:', error);
      alert(`Error: ${error.response?.data?.message || 'Failed to submit booking'}`);
  }
};

  const handleBackButtonClick = () => {
    navigate(-1);
  };

  return (
    <div className="VenueBooking">
      <Header />
      <div className="main-content">
        <div className="sidebar-placeholder">
          <Sidebar />
        </div>
        <div className="booking-details">
          <form onSubmit={handleSubmit}>
            <div className="booking-details_header">
                <div className="booking">
                    <BackIcon className="back-icon" style={{  fontSize: 40  }} onClick={handleBackButtonClick}/>
                    <h2>{existingData?.booking_id ? `Edit Booking Information - FACI${String(formData.bookingID).padStart(3, '0')}` : facilityNames[facilityID]}</h2>
                </div>
            </div>
            <div className="venue-input">
                <h3>Event Information</h3>
                <div className="content">
                    <div className="venueInfo">
                            <label for="event-date">Date of Activity:</label>
                            <input type="date" id="event-date" name="eventDate" value={formData.eventDate} onChange={handleChange} required></input>
                            <label for="event-start">Start of Activity:</label>
                            <input type="time" id="event-start" name="eventStart" value={formData.eventStart} onChange={handleChange} required></input>
                            </div>
                    <div className="venueInfo">
                            <label for="activity-title">Title of Activity:</label>
                            <input type="text" id="activity-title" name="activityTitle" value={formData.activityTitle} onChange={handleChange} required></input>
                            <label for="event-end">End of Activity:</label>
                            <input type="time" id="event-end" name="eventEnd" value={formData.eventEnd} onChange={handleChange} required></input>
                            </div>
                    <div className="venueInfo">
                            <label for="attendance">Expected Attendance:</label>
                            <input type="number" id="attendance" name="attendance" value={formData.attendance} onChange={handleChange} required></input>
                            <label for="speaker-name">Name of Speaker (if applicable):</label>
                            <input type="text" id="speaker-name" name="speakerName" value={formData.speakerName} onChange={handleChange}></input>  
                    </div>
                </div>
            </div>
            <div className="other-input">
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
                      <AddMinusButton item="tables" onCountChange={handleCountChange} initialValue={formData.equipment.tables} />
                      <AddMinusButton item="chairs" onCountChange={handleCountChange} initialValue={formData.equipment.chairs} />
                      <AddMinusButton item="bulletinBoards" onCountChange={handleCountChange} initialValue={formData.equipment.bulletinBoards} />
                      <AddMinusButton item="speaker" onCountChange={handleCountChange} initialValue={formData.equipment.speaker} />
                      <AddMinusButton item="microphone" onCountChange={handleCountChange} initialValue={formData.equipment.microphone} />
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
                      <AddMinusButton item="flagpole" onCountChange={handleCountChange} initialValue={formData.equipment.flagpole} />
                      <AddMinusButton item="podium" onCountChange={handleCountChange} initialValue={formData.equipment.podium} />
                      <AddMinusButton item="platform" onCountChange={handleCountChange} initialValue={formData.equipment.platform} />
                      <AddMinusButton item="electrician" onCountChange={handleCountChange} initialValue={formData.equipment.electrician} />
                      <AddMinusButton item="janitor" onCountChange={handleCountChange} initialValue={formData.equipment.janitor} />
                  </div>
                </div>
              </div>
            </div>
            <div className="requirement-input">
              <h3>Requirement Status</h3>
              <div className="content">
                <div className="status-column">
                  <label className="form-control">
                  <input type="radio" id="pencil-booking" name="status" value="pencil" checked={formData.status === "pencil"} onChange={handleStatusChange}></input>
                  Pencil Booking
                  </label>
                  <label className="form-control">
                  <input type="radio" id="complete-reqs" name="status" value="official" checked={formData.status === "official"} onChange={handleStatusChange}></input>
                  Official Booking
                  </label>    
                </div>
              </div>
            </div>
            <div className="confirm-booking">
              <label className="agree-checkbox">
                <input type="checkbox" id="agree-checkbox" name="agree-checkbox" required></input>
                By submitting this reservation, I agree and abide by the rules setforth by the Facilities Management Team.
              </label>
              <button className="submit-booking" type="submit">{existingData?.booking_id ? "Update Booking" : "Submit Booking"}</button>
              </div>
            </form>
          </div>
        </div> 
      </div>
  );
}

export default VenueBooking;
