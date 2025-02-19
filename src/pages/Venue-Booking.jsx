import BackIcon from '@mui/icons-material/ArrowBackOutlined';
import axios from 'axios';
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../components/AddMinusButton.css';
import AddMinusButton from '../components/AddMinusButton.jsx';
import '../components/Navbar.css';
import Header from '../components/Navbar.jsx';
import '../components/Sidebar.css';
import Sidebar from '../components/Sidebar.jsx';
import './Venue-Booking.css';

function VenueBooking() {
  const { orgID, facilityID } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("");
  const [formData, setFormData] = useState({
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
    bookingDate: new Date().toISOString().split('T')[0],
    bookingTime: new Date().toISOString().split('T')[1].split('.')[0]
  });
  
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
      const response = await axios.post(`/facify/venue-booking/${orgID}/${facilityID}/create`, finalFormData);
      console.log('Server response1:', response.data);
      if (response.data.success) {
        alert('Booking created successfully');
        navigate(`/venue-availability/${orgID}`);
      } else {
        alert('Error creating booking');
      }
    } catch (error) {
      console.error('Error creating booking:', error);
      alert('Error creating booking');
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
                    <h2>Multipurpose Hall</h2>
                </div>
            </div>
            <div className="venue-input">
                <h3>Event Information</h3>
                <div className="content">
                    <div className="venueInfo">
                            <label for="event-date">Date of Activity:</label>
                            <input type="date" id="event-date" name="eventDate" value={formData.eventDate} onChange={handleChange}></input>
                            <label for="event-start">Start of Activity:</label>
                            <input type="time" id="event-start" name="eventStart" value={formData.eventStart} onChange={handleChange}></input>
                            </div>
                    <div className="venueInfo">
                            <label for="activity-title">Title of Activity:</label>
                            <input type="text" id="activity-title" name="activityTitle" value={formData.activityTitle} onChange={handleChange}></input>
                            <label for="event-end">End of Activity:</label>
                            <input type="time" id="event-end" name="eventEnd" value={formData.eventEnd} onChange={handleChange}></input>
                            </div>
                    <div className="venueInfo">
                            <label for="attendance">Expected Attendance:</label>
                            <input type="number" id="attendance" name="attendance" value={formData.attendance} onChange={handleChange}></input>
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
                    <AddMinusButton item="tables" onCountChange={handleCountChange} />
                    <AddMinusButton item="chairs" onCountChange={handleCountChange} />
                    <AddMinusButton item="bulletinBoards" onCountChange={handleCountChange} />
                    <AddMinusButton item="speaker" onCountChange={handleCountChange} />
                    <AddMinusButton item="microphone" onCountChange={handleCountChange} />
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
                    <AddMinusButton item="flagpole" onCountChange={handleCountChange} />
                    <AddMinusButton item="podium" onCountChange={handleCountChange} />
                    <AddMinusButton item="platform" onCountChange={handleCountChange} />
                    <AddMinusButton item="electrician" onCountChange={handleCountChange} />
                    <AddMinusButton item="janitor" onCountChange={handleCountChange} />
                  </div>
                </div>
              </div>
            </div>
            <div className="requirement-input">
              <h3>Requirement Status</h3>
              <div className="content">
                <div className="status-column">
                  <label className="form-control">
                  <input type="radio" id="pencil-booking" name="status" value="pencil" onChange={handleStatusChange}></input>
                  Pencil Booking
                  </label>
                  <label className="form-control">
                  <input type="radio" id="complete-reqs" name="status" value="complete" onChange={handleStatusChange}></input>
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
              <button className="submit-booking" type="submit">Submit Booking</button>
            </div>
            </form>
          </div>
        </div> 
      </div>
  );
}

export default VenueBooking;
