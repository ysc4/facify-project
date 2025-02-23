import VisibilityOff from '@mui/icons-material/VisibilityOffOutlined';
import Visibility from '@mui/icons-material/VisibilityOutlined';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/facify-white.png';
import girlypops from '../assets/girlypops-pink.png';
import './Login.css';
import Dropdown from '../components/Dropdown';

const Login = ({ setIsLoggedIn }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [userType, setUserType] = useState('Organization'); 
    const navigate = useNavigate();

    useEffect(() => {
        setIsLoggedIn(false);
    }, [setIsLoggedIn]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(''); // Clear previous errors
    
        try {
            const response = await axios.post(`/facify/login/${userType}`, { email, password });
    
            if (response.data.success) {
                const { org_id, org_name, admin_id, admin_name } = response.data;
                console.log(response.data);
                setIsLoggedIn(true);
                localStorage.setItem('orgID', org_id);
                localStorage.setItem('orgName', org_name);
                localStorage.setItem('adminID', admin_id);
                localStorage.setItem('adminName', admin_name);
                localStorage.setItem('userType', userType);

                if (userType === 'Organization') {
                    navigate(`/bookings/${org_id}`);
                } else {
                    navigate(`/admin-home/${admin_id}`);
                }
                
            } else {
                setError('Invalid credentials');
            }
        } catch (err) {
            setError('An error occurred');
        }
    };

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

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
                        <a href="/conditions">Conditions of Use</a>
                        <a href="/privacy">Privacy Notice</a>
                        <a href="/help">Help</a>
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
        </div>
    );
};

export default Login;