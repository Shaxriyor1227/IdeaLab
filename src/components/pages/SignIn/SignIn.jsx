import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { RiLightbulbFill } from 'react-icons/ri';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import './Signin.css';

const SignIn = () => {
    const { login, loginWithGoogle, loginWithGithub, signinForm, setSigninForm } = useAuth();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        if (!signinForm.email.trim() || !signinForm.password.trim()) {
            setError(t('fillAllFields') || 'Please fill in all fields.');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(signinForm.email.trim())) {
            setError(t('invalidEmail') || 'Please enter a valid email address.');
            return;
        }

        setLoading(true);
        
        try {
            await login(signinForm.email.trim(), signinForm.password);
            setSigninForm({ email: "", password: "" });
            navigate("/");
        } catch (err) {
            console.error(err);
            if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
                setError(t('invalidCredentials') || "Email yoki parol noto'g'ri. Iltimos tekshirib qaytadan uringing.");
            } else if (err.code === 'auth/too-many-requests') {
                setError(t('tooManyAttempts') || "Ko'p marta noto'g'ri urinish. Biroz kutib turing.");
            } else {
                setError((t('loginError') || "Tizimga kirishda xatolik yuz berdi: ") + (err.message || err.code));
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

                <h2 className="auth-title">{t('welcomeBack') || 'Welcome back'}</h2>
                <p className="auth-subtitle">{t('loginSubtitle') || 'Log in to your IdeaLab account'}</p>

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
                        <span>{t('continueWithGoogle') || 'Continue with Google'}</span>
                    </button>
                    <button 
                        type="button" 
                        className="auth-social-btn" 
                        onClick={handleGithubLogin} 
                        disabled={loading}
                        aria-label="Continue with GitHub"
                    >
                        <FaGithub className="auth-social-icon" />
                        <span>{t('continueWithGithub') || 'Continue with GitHub'}</span>
                    </button>
                </div>

                {/* Divider */}
                <div className="auth-divider">
                    <span className="auth-divider-text">{t('orContinueWithEmail') || 'or continue with email'}</span>
                </div>

                {/* Email/Password Form */}
                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="auth-field-group">
                        <label htmlFor="signin-email" className="auth-label">{t('emailAddress') || 'Email address'}</label>
                        <input
                            id="signin-email"
                            type="email"
                            className="auth-input"
                            placeholder="you@example.com"
                            value={signinForm.email}
                            onChange={(e) => setSigninForm({ ...signinForm, email: e.target.value })}
                            disabled={loading}
                            autoComplete="email"
                            required
                        />
                    </div>

                    <div className="auth-field-group">
                        <div className="auth-label-row">
                            <label htmlFor="signin-password" className="auth-label">{t('password') || 'Password'}</label>
                            <button 
                                type="button" 
                                className="auth-forgot-link" 
                                onClick={() => navigate('/forgot-password')}
                                disabled={loading}
                            >
                                {t('forgotPassword') || 'Forgot password?'}
                            </button>
                        </div>
                        <div className="auth-password-wrapper">
                            <input
                                id="signin-password"
                                type={showPassword ? "text" : "password"}
                                className="auth-input"
                                placeholder="••••••••"
                                value={signinForm.password}
                                onChange={(e) => setSigninForm({ ...signinForm, password: e.target.value })}
                                disabled={loading}
                                autoComplete="current-password"
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

                    <button type="submit" className="auth-submit-btn" disabled={loading}>
                        {loading ? (t('loggingIn') || 'Logging in...') : (t('loginBtn') || 'Log in →')}
                    </button>
                </form>

                <p className="auth-footer-text">
                    {t('dontHaveAccount') || "Don't have an account?"} <button type="button" className="auth-footer-link" onClick={() => navigate('/signup')}>{t('signUpLabel') || 'Sign up'}</button>
                </p>
            </div>
        </div>
    );
};

export default SignIn;
