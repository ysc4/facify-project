import BackIcon from '@mui/icons-material/ArrowBackOutlined';
import { Link } from 'react-router-dom';
import '../components/Navbar.css';
import Header from '../components/Navbar.jsx';
import '../components/ProgressBar.css';
import ProgressBar from '../components/ProgressBar.jsx';
import '../components/Sidebar.css';
import Sidebar from '../components/Sidebar.jsx';
import './Booking-Info.css';


function BookingInfo() {
  return (
    <div className="BookingInfo">
      <Header />
      <div className="main-content">
        <div className="sidebar-placeholder">
          <Sidebar />
        </div>
        <div className="booking-details">
            <div className="booking-details_header">
                <div className="booking">
                    <BackIcon className="back-icon" style={{  fontSize: 40  }}></BackIcon>
                    <h2>Booking Information - FACI0001</h2>
                </div>
                <div className="booking-buttons">
                    <button className="cancel-button">Cancel Booking</button>
                    <Link to="/venue-booking">
                      <button className="edit-button">Edit Submission</button>
                    </Link>
                </div>
            </div>
            <div className="booking-progress">
              <div className="progress-bar">
                <ProgressBar />
              </div>
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
                    <p>Multipurpose Hall (12th Floor Annex Building)</p>
                    <p>December 5, 2024 12:00 NN - 4:00 PM</p>
                    <p>GDSC National University Manila</p>
                    <p>Infosession 2024</p>
                    <p>80</p>
                    <p>Michael Angelo</p>
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
                  <p>4</p>
                  <p>10</p>
                  <p>0</p>
                  <p>1</p>
                  <p>3</p>
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
                  <p>1</p>
                  <p>2</p>
                  <p>2</p>
                  <p>1</p>
                  <p>1</p>
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
                <div className="req">
                  <div className="file-name">Letter of Intent</div>
                  <div className="date">January 05, 2024</div>
                  <div className="file">View</div>
                </div>
                <div className="req">
                  <div className="file-name">Event Proposal</div>
                  <div className="date">January 05, 2024</div>
                  <div className="file">
                    <div className="file-icon">
                      <span>P</span>
                    </div>
                    <div className="file-item">
                      <h4>PDF File Name</h4>
                      <p>177.89 KB</p>
                    </div>
                  </div>
                </div>
                <div className="req">
                  <div className="file-name">Activity Request Form</div>
                  <div className="date">January 05, 2024</div>
                  <div className="file">
                    <button className="upload-button">Upload PDF File</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="update-logs">
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
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookingInfo;
