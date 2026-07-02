import React, { useState } from 'react';
import { useAuth } from '../../context/Authontext';
import { useNavigate } from 'react-router-dom';
import { RiLightbulbFill } from 'react-icons/ri';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import './Signin.css';

const SignIn = () => {
    const { login, signinForm, setSigninForm } = useAuth();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        
        const success = login(signinForm.email, signinForm.password);

        if (success) {
            setSigninForm({ email: "", password: "" });
            navigate("/");
        } else {
            setError("Invalid email or password. Please check your credentials or sign up.");
        }
    };

    return (
        <div className="auth-page-container">
            <div className="auth-card">
                {/* Glowing bulb logo */}
                <div className="auth-logo-wrapper">
                    <div className="auth-logo-bg">
                        <RiLightbulbFill className="auth-logo-icon" />
                    </div>
                </div>

                <h2 className="auth-title">Welcome back</h2>
                <p className="auth-subtitle">Log in to your IdeaLab account</p>

                {error && <div className="auth-error-message">{error}</div>}

                {/* Social Logins */}
                <div className="auth-social-buttons">
                    <button type="button" className="auth-social-btn" onClick={() => navigate('/')}>
                        <FcGoogle className="auth-social-icon" />
                        <span>Continue with Google</span>
                    </button>
                    <button type="button" className="auth-social-btn" onClick={() => navigate('/')}>
                        <FaGithub className="auth-social-icon" />
                        <span>Continue with GitHub</span>
                    </button>
                </div>

                {/* Divider */}
                <div className="auth-divider">
                    <span className="auth-divider-text">or continue with email</span>
                </div>

                {/* Email/Password Form */}
                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="auth-field-group">
                        <label className="auth-label">Email address</label>
                        <input
                            type="email"
                            className="auth-input"
                            placeholder="you@example.com"
                            value={signinForm.email}
                            onChange={(e) => setSigninForm({ ...signinForm, email: e.target.value })}
                            required
                        />
                    </div>

                    <div className="auth-field-group">
                        <div className="auth-label-row">
                            <label className="auth-label">Password</label>
                            <span 
                                className="auth-link-forgot" 
                                onClick={() => navigate('/forgot-password')}
                            >
                                Forgot password?
                            </span>
                        </div>
                        <div className="auth-password-input-wrapper">
                            <input
                                type={showPassword ? "text" : "password"}
                                className="auth-input auth-input-password"
                                placeholder="Enter your password"
                                value={signinForm.password}
                                onChange={(e) => setSigninForm({ ...signinForm, password: e.target.value })}
                                required
                            />
                            <button 
                                type="button" 
                                className="auth-password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                            </button>
                        </div>
                    </div>

                    <button type="submit" className="auth-submit-btn">
                        Log in &rarr;
                    </button>
                </form>
            </div>

            <p className="auth-footer-text">
                Don't have an account? <span className="auth-footer-link" onClick={() => navigate('/signup')}>Sign up</span>
            </p>
        </div>
    );
};

export default SignIn;
