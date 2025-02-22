import VisibilityOff from '@mui/icons-material/VisibilityOffOutlined';
import Visibility from '@mui/icons-material/VisibilityOutlined';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/facify-white.png';
import girlypops from '../assets/girlypops-pink.png';
import './Login.css';

const Login = ({ setIsLoggedIn }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        setIsLoggedIn(false);
    }, [setIsLoggedIn]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('/facify/login', { email, password });
            if (response.data.success) {
                const orgID = response.data.org_id;
                const orgName = response.data.org_name;
                console.log(response.data);
                setIsLoggedIn(true);
                localStorage.setItem('orgID', orgID);
                localStorage.setItem('orgName', orgName);
                navigate(`/bookings/${orgID}`);
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