import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { RiLightbulbFill } from 'react-icons/ri';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';
import { FiEye, FiEyeOff, FiAlertCircle, FiCheck } from 'react-icons/fi';
import '../SignIn/Signin.css';

function getPasswordStrength(password) {
    if (!password) return { level: 0, label: '', color: '' };
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 1) return { level: 1, label: "Zaif", color: '#ef4444' };
    if (score <= 2) return { level: 2, label: "O'rtacha", color: '#f59e0b' };
    if (score <= 3) return { level: 3, label: "Yaxshi", color: '#3b82f6' };
    return { level: 4, label: "Kuchli", color: '#10b981' };
}

const Signup = () => {
    const { signup, loginWithGoogle, loginWithGithub, signupForm, setSignupForm } = useAuth();
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [socialLoading, setSocialLoading] = useState(''); // 'google' | 'github' | ''

    const passwordStrength = useMemo(() => getPasswordStrength(signupForm.password), [signupForm.password]);
    const passwordsMatch = confirmPassword.length > 0 && signupForm.password === confirmPassword;
    const isAnyLoading = loading || socialLoading !== '';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!signupForm.name.trim() || signupForm.name.trim().length < 2) {
            setError(t('invalidName') || "Iltimos, ismingizni to'g'ri kiriting (kamida 2 ta belgi).");
            return;
        }

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(signupForm.email)) {
            setError(t('invalidEmailFormat') || "Iltimos, to'g'ri email manzilini kiriting.");
            return;
        }

        if (signupForm.password.length < 8) {
            setError(t('passwordTooShort') || "Parol kamida 8 ta belgidan iborat bo'lishi kerak.");
            return;
        }

        if (signupForm.password !== confirmPassword) {
            setError(t('passwordsDoNotMatch') || "Parollar mos kelmaydi.");
            return;
        }

        setLoading(true);

        try {
            await signup({
                name: signupForm.name,
                email: signupForm.email,
                password: signupForm.password
            });

            setSignupForm({ name: '', email: '', password: '' });
            setConfirmPassword('');
            navigate('/');
        } catch (err) {
            console.error(err);
            if (err.code === 'auth/email-already-in-use') {
                setError(t('emailInUse') || "Bu email allaqachon ro'yxatdan o'tgan. Iltimos, tizimga kiring.");
            } else {
                setError(t('signupError') || "Ro'yxatdan o'tishda xatolik yuz berdi.");
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

    return (
        <div className="auth-page-container">
            <div className="auth-card">
                {/* Logo */}
                <div className="auth-logo-wrapper">
                    <div className="auth-logo-bg">
                        <RiLightbulbFill className="auth-logo-icon" />
                    </div>
                </div>

                <h2 className="auth-title">{t('createAccountTitle') || "Hisob yaratish"}</h2>
                <p className="auth-subtitle">{t('createAccountSubtitle') || "Startap g'oyalaringizni bepul tahlil qiling"}</p>

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
                        <span>{socialLoading === 'google' ? "Ulanilmoqda..." : (t('continueWithGoogle') || 'Google orqali')}</span>
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
                        <span>{socialLoading === 'github' ? "Ulanilmoqda..." : (t('continueWithGithub') || 'GitHub orqali')}</span>
                    </button>
                </div>

                {/* Divider */}
                <div className="auth-divider">
                    <span className="auth-divider-text">{t('orContinueWithEmail') || 'yoki email orqali'}</span>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="auth-form">
                    {/* Name */}
                    <div className="auth-field-group">
                        <label htmlFor="signup-name" className="auth-label">{t('displayName') || 'Ism va familiya'}</label>
                        <input
                            id="signup-name"
                            type="text"
                            className="auth-input"
                            placeholder="Abdullayev Alisher"
                            value={signupForm.name}
                            onChange={(e) => setSignupForm({ ...signupForm, name: e.target.value })}
                            disabled={isAnyLoading}
                            autoComplete="name"
                            required
                        />
                    </div>

                    {/* Email */}
                    <div className="auth-field-group">
                        <label htmlFor="signup-email" className="auth-label">{t('emailAddress') || 'Email'}</label>
                        <input
                            id="signup-email"
                            type="email"
                            className="auth-input"
                            placeholder="siz@example.com"
                            value={signupForm.email}
                            onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                            disabled={isAnyLoading}
                            autoComplete="email"
                            required
                        />
                    </div>

                    {/* Password */}
                    <div className="auth-field-group">
                        <label htmlFor="signup-password" className="auth-label">{t('password') || 'Parol'}</label>
                        <div className="auth-password-wrapper">
                            <input
                                id="signup-password"
                                type={showPassword ? 'text' : 'password'}
                                className="auth-input"
                                placeholder="••••••••"
                                value={signupForm.password}
                                onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                                disabled={isAnyLoading}
                                autoComplete="new-password"
                                required
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

                        {/* Password Strength */}
                        {signupForm.password.length > 0 && (
                            <div className="auth-password-strength">
                                <div className="auth-strength-bars">
                                    {[1, 2, 3, 4].map(n => (
                                        <div
                                            key={n}
                                            className="auth-strength-bar"
                                            style={{
                                                background: n <= passwordStrength.level
                                                    ? passwordStrength.color
                                                    : 'rgba(255,255,255,0.08)'
                                            }}
                                        />
                                    ))}
                                </div>
                                <span className="auth-strength-label" style={{ color: passwordStrength.color }}>
                                    {passwordStrength.label}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Confirm Password */}
                    <div className="auth-field-group">
                        <label htmlFor="signup-confirm-password" className="auth-label">{t('confirmPassword') || 'Parolni tasdiqlang'}</label>
                        <div className="auth-password-wrapper">
                            <input
                                id="signup-confirm-password"
                                type={showConfirmPassword ? 'text' : 'password'}
                                className={`auth-input ${confirmPassword.length > 0 ? (passwordsMatch ? 'auth-input--valid' : 'auth-input--invalid') : ''}`}
                                placeholder="••••••••"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                disabled={isAnyLoading}
                                autoComplete="new-password"
                                required
                            />
                            {confirmPassword.length > 0 && (
                                <span className={`auth-match-icon ${passwordsMatch ? 'auth-match-icon--ok' : 'auth-match-icon--no'}`}>
                                    {passwordsMatch ? <FiCheck size={16} /> : <FiAlertCircle size={16} />}
                                </span>
                            )}
                            <button
                                type="button"
                                className="auth-password-toggle"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                aria-label={showConfirmPassword ? 'Hide' : 'Show'}
                                disabled={isAnyLoading}
                                tabIndex="-1"
                                style={{ right: confirmPassword.length > 0 ? '36px' : '12px' }}
                            >
                                {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                            </button>
                        </div>
                        {confirmPassword.length > 0 && !passwordsMatch && (
                            <span className="auth-field-hint auth-field-hint--error">Parollar mos kelmaydi</span>
                        )}
                    </div>

                    <button type="submit" className="auth-submit-btn" disabled={isAnyLoading}>
                        {loading
                            ? <><span className="auth-btn-spinner" /> Yaratilmoqda...</>
                            : (t('createAccountBtn') || "Hisob yaratish →")
                        }
                    </button>
                </form>

                <p className="auth-terms-text">
                    {t('bySigningUp') || "Ro'yxatdan o'tish orqali siz"}{' '}
                    <span>{t('termsOfService') || 'Foydalanish shartlari'}</span>{' '}
                    {t('and') || 'va'}{' '}
                    <span>{t('privacyPolicy') || 'Maxfiylik siyosati'}</span>
                    {' '}ga rozilik bildirasiz.
                </p>

                <p className="auth-footer-text">
                    {t('alreadyHaveAccount') || "Hisobingiz bormi?"}{' '}
                    <button type="button" className="auth-footer-link" onClick={() => navigate('/signin')}>
                        {t('loginLink') || 'Kirish'}
                    </button>
                </p>
            </div>
        </div>
    );
};

export default Signup;
