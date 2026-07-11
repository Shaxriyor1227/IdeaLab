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

        if (!signupForm.name.trim() || signupForm.name.trim().length < 2) {
            setError(t('invalidName') || "Iltimos, ismingizni to'g'ri kiriting.");
            return;
        }

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(signupForm.email)) {
            setError(t('invalidEmailFormat') || "Please enter a valid email address.");
            return;
        }

        if (signupForm.password.length < 8) {
            setError(t('passwordTooShort') || "Password must be at least 8 characters long.");
            return;
        }

        if (signupForm.password !== confirmPassword) {
            setError(t('passwordsDoNotMatch') || "Passwords do not match.");
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
                setError(t('emailInUse') || "Bu elektron pochta orqali allaqachon ro'yxatdan o'tilgan. Iltimos, tizimga kiring.");
            } else {
                setError((t('signupError') || "Ro'yxatdan o'tishda xatolik yuz berdi: ") + (err.message || err.code));
            }
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setError('');
        setLoading(true);
        try {
            await loginWithGoogle();
            navigate("/");
        } catch (err) {
            console.error(err);
            setError(t('googleLoginError') || "Google orqali kirishda xatolik yuz berdi.");
        } finally {
            setLoading(false);
        }
    };

    const handleGithubLogin = async () => {
        setError('');
        setLoading(true);
        try {
            await loginWithGithub();
            navigate("/");
        } catch (err) {
            console.error(err);
            setError(t('githubLoginError') || "GitHub orqali kirishda xatolik yuz berdi.");
        } finally {
            setLoading(false);
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

                <h2 className="auth-title">{t('createAccountTitle') || 'Create your account'}</h2>
                <p className="auth-subtitle">{t('createAccountSubtitle') || 'Start validating startup ideas for free'}</p>

                {error && <div className="auth-error-message">{error}</div>}

                {/* Social Logins */}
                <div className="auth-social-buttons">
                    <button 
                        type="button" 
                        className="auth-social-btn" 
                        onClick={handleGoogleLogin}
                        disabled={loading}
                        aria-label="Continue with Google"
                    >
                        <FcGoogle className="auth-social-icon" />
                        <span>Continue with Google</span>
                    </button>
                    <button 
                        type="button" 
                        className="auth-social-btn" 
                        onClick={handleGithubLogin}
                        disabled={loading}
                        aria-label="Continue with GitHub"
                    >
                        <FaGithub className="auth-social-icon" />
                        <span>Continue with GitHub</span>
                    </button>
                </div>

                {/* Divider */}
                <div className="auth-divider">
                    <span className="auth-divider-text">{t('orContinueWithEmail') || 'or continue with email'}</span>
                </div>

                {/* Registration Form */}
                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="auth-field-group">
                        <label htmlFor="signup-name" className="auth-label">{t('displayName') || 'Full name'}</label>
                        <input
                            id="signup-name"
                            type="text"
                            className="auth-input"
                            placeholder="John Doe"
                            value={signupForm.name}
                            onChange={(e) => setSignupForm({ ...signupForm, name: e.target.value })}
                            disabled={loading}
                            autoComplete="name"
                            required
                        />
                    </div>

                    <div className="auth-field-group">
                        <label htmlFor="signup-email" className="auth-label">{t('emailAddress') || 'Email address'}</label>
                        <input
                            id="signup-email"
                            type="email"
                            className="auth-input"
                            placeholder="you@example.com"
                            value={signupForm.email}
                            onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                            disabled={loading}
                            autoComplete="email"
                            required
                        />
                    </div>

                    <div className="auth-field-group">
                        <label htmlFor="signup-password" className="auth-label">{t('password') || 'Password'}</label>
                        <div className="auth-password-wrapper">
                            <input
                                id="signup-password"
                                type={showPassword ? "text" : "password"}
                                className="auth-input"
                                placeholder="••••••••"
                                value={signupForm.password}
                                onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                                disabled={loading}
                                autoComplete="new-password"
                                required
                            />
                            <button 
                                type="button" 
                                className="auth-password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                                aria-label={showPassword ? "Hide password" : "Show password"}
                                disabled={loading}
                                tabIndex="-1"
                            >
                                {showPassword ? <FiEyeOff /> : <FiEye />}
                            </button>
                        </div>
                    </div>

                    <div className="auth-field-group">
                        <label htmlFor="signup-confirm-password" className="auth-label">{t('confirmPassword') || 'Confirm password'}</label>
                        <div className="auth-password-wrapper">
                            <input
                                id="signup-confirm-password"
                                type={showConfirmPassword ? "text" : "password"}
                                className="auth-input"
                                placeholder="••••••••"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                disabled={loading}
                                autoComplete="new-password"
                                required
                            />
                            <button 
                                type="button" 
                                className="auth-password-toggle"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                                disabled={loading}
                                tabIndex="-1"
                            >
                                {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                            </button>
                        </div>
                    </div>

                    <button type="submit" className="auth-submit-btn" disabled={loading}>
                        {loading ? (t('creatingAccount') || 'Creating Account...') : (t('createAccountBtn') || 'Create Account →')}
                    </button>
                </form>

                <p className="auth-terms-text">
                    {t('bySigningUp') || "By signing up you agree to our"} <span onClick={() => navigate('/')}>{t('termsOfService') || 'Terms of Service'}</span> {t('and') || 'and'} <span onClick={() => navigate('/')}>{t('privacyPolicy') || 'Privacy Policy'}</span>
                </p>

                <p className="auth-footer-text">
                    {t('alreadyHaveAccount') || "Already have an account?"} <button type="button" className="auth-footer-link" onClick={() => navigate('/signin')}>{t('loginLink') || 'Log in'}</button>
                </p>
            </div>
        </div>
    );
};

export default Signup;
