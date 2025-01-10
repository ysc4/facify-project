import VisibilityOff from '@mui/icons-material/VisibilityOffOutlined';
import Visibility from '@mui/icons-material/VisibilityOutlined';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/facify-white.png';
import girlypops from '../assets/girlypops-pink.png';
import './Login.css';

const Login = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        setIsLoggedIn(false);
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();
        // Perform login logic here
        setIsLoggedIn(true);
        navigate('/bookings');
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
                        <label htmlFor="username">NU Email:</label>
                        <input type="text" id="username" name="username" placeholder="Enter your email" required/>
                    </div>
                    <div className="form-group password-group">
                        <label htmlFor="password">Password:</label>
                        <input
                            type={passwordVisible ? "text" : "password"}
                            id="password"
                            name="password"
                            placeholder="Enter your password"
                            required
                        />
                        <span className="password-toggle" onClick={togglePasswordVisibility}>
                            {passwordVisible ? <VisibilityOff /> : <Visibility />}
                        </span>
                    </div>
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