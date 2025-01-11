import BackIcon from '@mui/icons-material/ArrowBackOutlined';
import '../components/AddMinusButton.css';
import AddMinusButton from '../components/AddMinusButton.jsx';
import '../components/Navbar.css';
import Header from '../components/Navbar.jsx';
import '../components/Sidebar.css';
import Sidebar from '../components/Sidebar.jsx';
import './Venue-Booking.css';

function VenueBooking() {
  return (
    <div className="VenueBooking">
      <Header />
      <div className="main-content">
        <div className="sidebar-placeholder">
          <Sidebar />
        </div>
        <div className="booking-details">
            <div className="booking-details_header">
                <div className="booking">
                    <BackIcon className="back-icon" style={{  fontSize: 40  }}></BackIcon>
                    <h2>Multipurpose Hall</h2>
                    <h3>December 5, 2024 12:00 NN - 4:00 PM</h3>
                </div>
            </div>
            <div className="venue-input">
                <h3>Event Information</h3>
                <div className="content">
                    <div className="venueInfo">
                        <form>
                            <label for="org-name">Name of Organization/Department/College:</label>
                            <input type="text" id="org-name" name="org-name"></input>
                            <label for="event-start">Start of Activity:</label>
                            <input type="datetime-local" id="event-start" name="event-start"></input>
                        </form>
                    </div>
                    <div className="venueInfo">
                        <form>
                            <label for="event-name">Title of Activity:</label>
                            <input type="text" id="event-name" name="event-name"></input>
                            <label for="event-end">End of Activity:</label>
                            <input type="datetime-local" id="event-end" name="event-end"></input>
                        </form>
                    </div>
                    <div className="venueInfo">
                        <form>
                            <label for="attendance">Expected Attendance:</label>
                            <input type="number" id="attendance" name="attendance"></input>
                            <label for="speaker-name">Name of Speaker (if applicable):</label>
                            <input type="text" id="speaker-name" name="speaker-name"></input>
                        </form>
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
                    <AddMinusButton />
                    <AddMinusButton />
                    <AddMinusButton />
                    <AddMinusButton />
                    <AddMinusButton />
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
                    <AddMinusButton />
                    <AddMinusButton />
                    <AddMinusButton />
                    <AddMinusButton />
                    <AddMinusButton />
                  </div>
                </div>
              </div>
            </div>
            <div className="requirement-input">
              <h3>Requirement Status</h3>
              <div className="content">
                <div className="status-column">
                  <label className="form-control">
                  <input type="radio" id="pencil-booking" name="status"></input>
                  Pencil Booking
                  </label>
                  <label className="form-control">
                  <input type="radio" id="official-booking" name="status"></input>
                  Official Booking
                  </label>    
                </div>
              </div>
            </div>
            <div className="confirm-booking">
              <label className="agree-checkbox">
                <input type="checkbox" id="agree-checkbox" name="agree-checkbox"></input>
                By submitting this reservation, I agree and abide by the rules setforth by the Facilities Management Team.
              </label>
              <button className="submit-booking">Submit Booking</button>
            </div>
          </div>
        </div>
      </div>
  );
}

export default VenueBooking;
