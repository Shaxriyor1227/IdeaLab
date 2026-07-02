import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RiLockPasswordLine, RiCheckboxCircleFill } from 'react-icons/ri';
import { FiArrowLeft } from 'react-icons/fi';
import '../SignIn/Signin.css'; // Use shared styles

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (email) {
            setIsSubmitted(true);
        }
    };

    const handleResend = () => {
        // Simulate resending email
        alert(`Resent reset link to ${email}`);
    };

    return (
        <div className="auth-page-container">
            {!isSubmitted ? (
                // Reset password request state
                <div className="auth-card">
                    {/* Back to login link */}
                    <div className="auth-back-link" onClick={() => navigate('/signin')}>
                        <FiArrowLeft size={16} />
                        <span>Back to login</span>
                    </div>

                    {/* Glowing lock logo */}
                    <div className="auth-logo-wrapper">
                        <div className="auth-logo-bg lock-bg">
                            <RiLockPasswordLine className="auth-logo-icon" />
                        </div>
                    </div>

                    <h2 className="auth-title">Reset your password</h2>
                    <p className="auth-subtitle">Enter your email and we'll send a reset link</p>

                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="auth-field-group">
                            <label className="auth-label">Email address</label>
                            <input
                                type="email"
                                className="auth-input"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <button type="submit" className="auth-submit-btn">
                            Send Reset Link &rarr;
                        </button>
                    </form>
                </div>
            ) : (
                // Success state
                <div className="auth-card">
                    {/* Glowing green check logo */}
                    <div className="auth-logo-wrapper">
                        <div className="auth-logo-bg success-bg">
                            <RiCheckboxCircleFill className="auth-logo-icon" />
                        </div>
                    </div>

                    <h2 className="auth-title">Check your email</h2>
                    <p className="auth-subtitle">
                        We've sent a password reset link to your inbox. Follow the link to set a new password.
                    </p>

                    <button 
                        className="auth-secondary-btn" 
                        onClick={() => navigate('/signin')}
                    >
                        <FiArrowLeft size={16} />
                        <span>Back to login</span>
                    </button>

                    <p className="auth-footer-text">
                        Didn't receive it? <span className="auth-footer-link" onClick={handleResend}>Resend email</span>
                    </p>
                </div>
            )}
        </div>
    );
};

export default ForgotPassword;
