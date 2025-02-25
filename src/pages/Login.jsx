import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/facify-white.png';
import girlypops from '../assets/girlypops-pink.png';
import Dropdown from '../components/Dropdown';
import ConditionsModal from '../pages/modals/Condition';
import HelpModal from '../pages/modals/Help';
import PrivacyModal from '../pages/modals/Privacy';
import './Login.css';

const Login = ({ setIsLoggedIn }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [userType, setUserType] = useState('Organization'); 
    const [isConditionsModalOpen, setIsConditionsModalOpen] = useState(false); 
    const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false); 
    const [isHelpModalOpen, setIsHelpModalOpen] = useState(false); 
    const navigate = useNavigate();

    useEffect(() => {
        setIsLoggedIn(false);
    }, [setIsLoggedIn]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(''); 
    
        try {
            const response = await axios.post(`/facify/login/${userType}`, { email, password });
    
            if (response.data.success) {
                const { org_id, org_name, admin_id, admin_name, image } = response.data;
                console.log(response.data);
                setIsLoggedIn(true);
                localStorage.setItem('orgID', org_id);
                localStorage.setItem('orgName', org_name);
                localStorage.setItem('adminID', admin_id);
                localStorage.setItem('adminName', admin_name);
                localStorage.setItem('userType', userType);
                localStorage.setItem('image', image);

                if (userType === 'Organization') {
                    navigate(`/bookings/${org_id}`);
                } else {
                    navigate(`/admin-home/${admin_id}`);
                }
                
            } else {
                setError('Invalid credentials');
            }
        } catch (err) {
            setError('Invalid login type');
        }
    };

    const togglePasswordVisibility = () => setPasswordVisible(!passwordVisible);

    const openConditionsModal = () => setIsConditionsModalOpen(true); 
    const closeConditionsModal = () => setIsConditionsModalOpen(false);  
    const openPrivacyModal = () => setIsPrivacyModalOpen(true);  
    const closePrivacyModal = () => setIsPrivacyModalOpen(false);
    const openHelpModal = () => setIsHelpModalOpen(true); 
    const closeHelpModal = () => setIsHelpModalOpen(false);  

    return (
        <div className="Login">
            <div className="description">
                <div className="title">
                    <img src={logo} alt="Facify Logo" className="facify-logo" />
                    <h4>Simplifying Spaces, Amplifying Events</h4>
                    <div className="introduction">
                        <p>Skip the paperwork and take control with facify, a facilities booking system of National University Manila. Secure campus spaces for your events and activities online—reserve now with your NU credentials!</p>
                    </div>
                </div>
            </div>
            <div className="loginForm">
                <h1>Login</h1>
                <h2>Enter your credentials.</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="user-type">User Type:</label>
                        <Dropdown 
                            className="user-type-dropdown"
                            options={['Organization', 'Admin']} 
                            defaultValue={'Organization'}
                            onSelect={(value) => setUserType(value)} 
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email:</label>
                        <input
                            type="text"
                            id="email"
                            value={email}
                            placeholder="Enter your email"
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group password-group">
                        <label htmlFor="password">Password:</label>
                        <input
                            type={passwordVisible ? "text" : "password"}
                            id="password"
                            value={password}
                            placeholder="Enter your password"
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <span className="password-toggle" onClick={togglePasswordVisibility}>
                            {passwordVisible ? <VisibilityOff /> : <Visibility />}
                        </span>
                    </div>
                    {error && <p className="error">{error}</p>}
                    <button type="submit" className="login-button">Login</button>
                </form>
                <div className="footer">
                    <div className="footer-links">
                        <a href="#" onClick={openConditionsModal}>Conditions of Use</a>
                        <a href="#" onClick={openPrivacyModal}>Privacy Notice</a>
                        <a href="#" onClick={openHelpModal}>Help</a>
                    </div>
                    <div className="published-date">
                        <p>© 2024 facify. All Rights Reserved.</p>
                    </div>
                    <div className="girlypops">
                        <h4>Powered by</h4>
                        <img src={girlypops} alt="Girlypops Logo" />
                    </div>
                </div>
            </div>

            <ConditionsModal isOpen={isConditionsModalOpen} onClose={closeConditionsModal} />
            <PrivacyModal isOpen={isPrivacyModalOpen} onClose={closePrivacyModal} />
            <HelpModal isOpen={isHelpModalOpen} onClose={closeHelpModal} />
        </div>
    );
};

export default Login;