import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { RiLockPasswordLine, RiCheckboxCircleFill } from 'react-icons/ri';
import { FiArrowLeft } from 'react-icons/fi';
import '../SignIn/Signin.css'; // Use shared styles

const ForgotPassword = () => {
    const navigate = useNavigate();
    const { resetPassword } = useAuth();
    const [email, setEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!email) return;

        setLoading(true);
        try {
            await resetPassword(email);
            setIsSubmitted(true);
        } catch (err) {
            console.error(err);
            if (err.code === 'auth/user-not-found') {
                setError("Ushbu email topilmadi. Iltimos tekshirib qaytadan urining.");
            } else {
                setError("Parolni tiklashda xatolik yuz berdi: " + (err.message || err.code));
            }
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        setError('');
        try {
            await resetPassword(email);
            alert(`Reset link resent to ${email}`);
        } catch (err) {
            alert(`Resend failed: ${err.message}`);
        }
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

                    {error && <div className="auth-error-message">{error}</div>}

                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="auth-field-group">
                            <label htmlFor="forgot-email" className="auth-label">Email address</label>
                            <input
                                id="forgot-email"
                                type="email"
                                className="auth-input"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <button type="submit" className="auth-submit-btn" disabled={loading}>
                            {loading ? 'Sending...' : 'Send Reset Link →'}
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
