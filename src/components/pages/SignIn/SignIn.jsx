import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { RiLightbulbFill } from 'react-icons/ri';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';
import { FiEye, FiEyeOff, FiAlertCircle } from 'react-icons/fi';
import './Signin.css';

const SignIn = () => {
    const { login, loginWithGoogle, loginWithGithub, signinForm, setSigninForm } = useAuth();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [socialLoading, setSocialLoading] = useState(''); // 'google' | 'github' | ''

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!signinForm.email.trim() || !signinForm.password.trim()) {
            setError(t('fillAllFields') || "Iltimos, barcha maydonlarni to'ldiring.");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(signinForm.email.trim())) {
            setError(t('invalidEmail') || "Iltimos, to'g'ri email manzilini kiriting.");
            return;
        }

        setLoading(true);

        try {
            await login(signinForm.email.trim(), signinForm.password);
            setSigninForm({ email: '', password: '' });
            navigate('/');
        } catch (err) {
            console.error(err);
            if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
                setError(t('invalidCredentials') || "Email yoki parol noto'g'ri. Iltimos tekshirib qaytadan uringing.");
            } else if (err.code === 'auth/too-many-requests') {
                setError(t('tooManyAttempts') || "Ko'p marta noto'g'ri urinish. Biroz kutib turing.");
            } else {
                setError(t('loginError') || "Tizimga kirishda xatolik yuz berdi.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setError('');
        setSocialLoading('google');
        try {
            await loginWithGoogle();
            navigate('/');
        } catch (err) {
            console.error(err);
            setError(t('googleLoginError') || "Google orqali kirishda xatolik yuz berdi.");
        } finally {
            setSocialLoading('');
        }
    };

    const handleGithubLogin = async () => {
        setError('');
        setSocialLoading('github');
        try {
            await loginWithGithub();
            navigate('/');
        } catch (err) {
            console.error(err);
            setError(t('githubLoginError') || "GitHub orqali kirishda xatolik yuz berdi.");
        } finally {
            setSocialLoading('');
        }
    };

    const isAnyLoading = loading || socialLoading !== '';

    return (
        <div className="auth-page-container">
            <div className="auth-card">
                {/* Logo */}
                <div className="auth-logo-wrapper">
                    <div className="auth-logo-bg">
                        <RiLightbulbFill className="auth-logo-icon" />
                    </div>
                </div>

                <h2 className="auth-title">{t('welcomeBack') || 'Xush kelibsiz'}</h2>
                <p className="auth-subtitle">{t('loginSubtitle') || 'IdeaLab hisobingizga kiring'}</p>

                {/* Error */}
                {error && (
                    <div className="auth-error-message">
                        <FiAlertCircle size={15} style={{ flexShrink: 0 }} />
                        <span>{error}</span>
                    </div>
                )}

                {/* Social Buttons */}
                <div className="auth-social-buttons">
                    <button
                        type="button"
                        className="auth-social-btn"
                        onClick={handleGoogleLogin}
                        disabled={isAnyLoading}
                        aria-label="Continue with Google"
                    >
                        {socialLoading === 'google'
                            ? <span className="auth-btn-spinner" />
                            : <FcGoogle className="auth-social-icon" />
                        }
                        <span>{socialLoading === 'google' ? "Kirilmoqda..." : (t('continueWithGoogle') || 'Google orqali kirish')}</span>
                    </button>
                    <button
                        type="button"
                        className="auth-social-btn"
                        onClick={handleGithubLogin}
                        disabled={isAnyLoading}
                        aria-label="Continue with GitHub"
                    >
                        {socialLoading === 'github'
                            ? <span className="auth-btn-spinner" />
                            : <FaGithub className="auth-social-icon" />
                        }
                        <span>{socialLoading === 'github' ? "Kirilmoqda..." : (t('continueWithGithub') || 'GitHub orqali kirish')}</span>
                    </button>
                </div>

                {/* Divider */}
                <div className="auth-divider">
                    <span className="auth-divider-text">{t('orContinueWithEmail') || 'yoki email orqali'}</span>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="auth-field-group">
                        <label htmlFor="signin-email" className="auth-label">{t('emailAddress') || 'Email'}</label>
                        <input
                            id="signin-email"
                            type="email"
                            className="auth-input"
                            placeholder="siz@example.com"
                            value={signinForm.email}
                            onChange={(e) => setSigninForm({ ...signinForm, email: e.target.value })}
                            disabled={isAnyLoading}
                            autoComplete="email"
                            required
                        />
                    </div>

                    <div className="auth-field-group">
                        <div className="auth-label-row">
                            <label htmlFor="signin-password" className="auth-label">{t('password') || 'Parol'}</label>
                            <button
                                type="button"
                                className="auth-forgot-link"
                                onClick={() => navigate('/forgot-password')}
                                disabled={isAnyLoading}
                            >
                                {t('forgotPassword') || 'Parolni unutdingizmi?'}
                            </button>
                        </div>
                        <div className="auth-password-wrapper">
                            <input
                                id="signin-password"
                                type={showPassword ? 'text' : 'password'}
                                className="auth-input"
                                placeholder="••••••••"
                                value={signinForm.password}
                                onChange={(e) => setSigninForm({ ...signinForm, password: e.target.value })}
                                disabled={isAnyLoading}
                                autoComplete="current-password"
                            />
                            <button
                                type="button"
                                className="auth-password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                                disabled={isAnyLoading}
                                tabIndex="-1"
                            >
                                {showPassword ? <FiEyeOff /> : <FiEye />}
                            </button>
                        </div>
                    </div>

                    <button type="submit" className="auth-submit-btn" disabled={isAnyLoading}>
                        {loading
                            ? <><span className="auth-btn-spinner" /> Kirilmoqda...</>
                            : (t('loginBtn') || 'Kirish →')
                        }
                    </button>
                </form>

                <p className="auth-footer-text">
                    {t('dontHaveAccount') || "Hisobingiz yo'qmi?"}{' '}
                    <button type="button" className="auth-footer-link" onClick={() => navigate('/signup')}>
                        {t('signUpLabel') || "Ro'yxatdan o'tish"}
                    </button>
                </p>
            </div>
        </div>
    );
};

export default SignIn;
