import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { RiLightbulbFill } from 'react-icons/ri';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import '../SignIn/Signin.css'; // Use shared styles

const Signup = () => {
    const { signup, loginWithGoogle, loginWithGithub, signupForm, setSignupForm } = useAuth();
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(signupForm.email)) {
            setError("Please enter a valid email address.");
            return;
        }

        if (signupForm.password.length < 8) {
            setError("Password must be at least 8 characters long.");
            return;
        }

        if (signupForm.password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);

        try {
            // Register user in Firebase Authentication and Firestore
            await signup({
                name: signupForm.name,
                email: signupForm.email,
                password: signupForm.password
            });

            // Clear states
            setSignupForm({ name: "", email: "", password: "" });
            setConfirmPassword('');
            
            // Redirect to home dashboard
            navigate("/");
        } catch (err) {
            console.error(err);
            if (err.code === 'auth/email-already-in-use') {
                setError("Bu elektron pochta orqali allaqachon ro'yxatdan o'tilgan. Iltimos, tizimga kiring.");
            } else {
                setError("Ro'yxatdan o'tishda xatolik yuz berdi: " + (err.message || err.code));
            }
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setError('');
        try {
            await loginWithGoogle();
            navigate("/");
        } catch (err) {
            console.error(err);
            setError("Google orqali kirishda xatolik yuz berdi.");
        }
    };

    const handleGithubLogin = async () => {
        setError('');
        try {
            await loginWithGithub();
            navigate("/");
        } catch (err) {
            console.error(err);
            setError("GitHub orqali kirishda xatolik yuz berdi.");
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

                <h2 className="auth-title">Create your account</h2>
                <p className="auth-subtitle">Start validating startup ideas for free</p>

                {error && <div className="auth-error-message">{error}</div>}

                {/* Social Logins */}
                <div className="auth-social-buttons">
                    <button type="button" className="auth-social-btn" onClick={handleGoogleLogin}>
                        <FcGoogle className="auth-social-icon" />
                        <span>Continue with Google</span>
                    </button>
                    <button type="button" className="auth-social-btn" onClick={handleGithubLogin}>
                        <FaGithub className="auth-social-icon" />
                        <span>Continue with GitHub</span>
                    </button>
                </div>

                {/* Divider */}
                <div className="auth-divider">
                    <span className="auth-divider-text">or continue with email</span>
                </div>

                {/* Registration Form */}
                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="auth-field-group">
                        <label className="auth-label">{t('displayName') || 'Full name'}</label>
                        <input
                            type="text"
                            className="auth-input"
                            placeholder="John Doe"
                            value={signupForm.name}
                            onChange={(e) => setSignupForm({ ...signupForm, name: e.target.value })}
                            required
                        />
                    </div>

                    <div className="auth-field-group">
                        <label className="auth-label">{t('emailAddress') || 'Email address'}</label>
                        <input
                            type="email"
                            className="auth-input"
                            placeholder="you@example.com"
                            value={signupForm.email}
                            onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                            required
                        />
                    </div>

                    <div className="auth-field-group">
                        <label className="auth-label">Password</label>
                        <div className="auth-password-input-wrapper">
                            <input
                                type={showPassword ? "text" : "password"}
                                className="auth-input auth-input-password"
                                placeholder="Min 8 characters"
                                value={signupForm.password}
                                onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
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

                    <div className="auth-field-group">
                        <label className="auth-label">Confirm password</label>
                        <div className="auth-password-input-wrapper">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                className="auth-input auth-input-password"
                                placeholder="Repeat password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                            <button 
                                type="button" 
                                className="auth-password-toggle"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                            </button>
                        </div>
                    </div>

                    <button type="submit" className="auth-submit-btn" disabled={loading}>
                        {loading ? 'Creating Account...' : 'Create Account →'}
                    </button>
                </form>

                <p className="auth-terms-text">
                    By signing up you agree to our <span onClick={() => navigate('/')}>Terms of Service</span> and <span onClick={() => navigate('/')}>Privacy Policy</span>
                </p>
            </div>

            <p className="auth-footer-text">
                Already have an account? <span className="auth-footer-link" onClick={() => navigate('/signin')}>Log in</span>
            </p>
        </div>
    );
};

export default Signup;
