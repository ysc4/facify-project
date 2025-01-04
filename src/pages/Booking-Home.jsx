import '../components/Navbar.css';
import Header from '../components/Navbar.jsx';
import '../components/Overview.css';
import Overview from '../components/Overview.jsx';
import '../components/Sidebar.css';
import Sidebar from '../components/Sidebar.jsx';
import './Booking-Home.css';

function Homepage() {
  return (
    <div className="Homepage">
      <Header />
      <div className="main-content">
        <div className="sidebar-placeholder">
          <Sidebar />
        </div>
        <div className="content-placeholder">
        <Overview />
        </div>
      </div>
    </div>
  );
}

export default Homepage;
