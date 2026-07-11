import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { RiLockPasswordLine, RiCheckboxCircleFill } from 'react-icons/ri';
import { FiArrowLeft, FiAlertCircle } from 'react-icons/fi';
import '../SignIn/Signin.css';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { resetPassword } = useAuth();
    const [email, setEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!email.trim()) {
            setError("Iltimos, email manzilini kiriting.");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim())) {
            setError("Iltimos, to'g'ri email manzilini kiriting.");
            return;
        }

        setLoading(true);
        try {
            await resetPassword(email.trim());
            setIsSubmitted(true);
        } catch (err) {
            console.error(err);
            if (err.code === 'auth/user-not-found') {
                setError("Ushbu email topilmadi. Iltimos tekshirib qaytadan urining.");
            } else if (err.code === 'auth/too-many-requests') {
                setError("Ko'p marta urinish. Biroz kutib turing.");
            } else {
                setError("Parolni tiklashda xatolik yuz berdi.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        setError('');
        try {
            await resetPassword(email);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="auth-page-container">
            {!isSubmitted ? (
                <div className="auth-card">
                    <button
                        type="button"
                        className="auth-back-link"
                        onClick={() => navigate('/signin')}
                        disabled={loading}
                    >
                        <FiArrowLeft size={16} />
                        <span>{t('backToLogin') || 'Kirish sahifasiga qaytish'}</span>
                    </button>

                    <div className="auth-logo-wrapper">
                        <div className="auth-logo-bg lock-bg">
                            <RiLockPasswordLine className="auth-logo-icon" />
                        </div>
                    </div>

                    <h2 className="auth-title">{t('resetYourPassword') || 'Parolni tiklash'}</h2>
                    <p className="auth-subtitle">{t('passwordResetSubtitle') || "Email manzilingizni kiriting — tiklanish havolasini yuboramiz"}</p>

                    {error && (
                        <div className="auth-error-message">
                            <FiAlertCircle size={15} style={{ flexShrink: 0 }} />
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="auth-field-group">
                            <label htmlFor="forgot-email" className="auth-label">{t('emailAddress') || 'Email'}</label>
                            <input
                                id="forgot-email"
                                type="email"
                                className="auth-input"
                                placeholder="siz@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={loading}
                                autoComplete="email"
                                required
                            />
                        </div>

                        <button type="submit" className="auth-submit-btn" disabled={loading}>
                            {loading
                                ? <><span className="auth-btn-spinner" /> Yuborilmoqda...</>
                                : (t('sendResetLink') || 'Tiklanish havolasini yuborish →')
                            }
                        </button>
                    </form>
                </div>
            ) : (
                <div className="auth-card">
                    <div className="auth-logo-wrapper">
                        <div className="auth-logo-bg success-bg">
                            <RiCheckboxCircleFill className="auth-logo-icon" />
                        </div>
                    </div>

                    <h2 className="auth-title">{t('checkYourEmail') || 'Emailingizni tekshiring'}</h2>
                    <p className="auth-subtitle">
                        {t('checkEmailDesc') || "Parolni tiklash havolasi yuborildi."}{' '}
                        <strong style={{ color: '#fff' }}>{email}</strong>
                    </p>

                    <button
                        type="button"
                        className="auth-submit-btn"
                        onClick={() => navigate('/signin')}
                        style={{ marginTop: '8px' }}
                    >
                        <FiArrowLeft size={16} />
                        <span>{t('backToLogin') || 'Kirish sahifasiga qaytish'}</span>
                    </button>

                    <p className="auth-footer-text">
                        Xat kelmadimi?{' '}
                        <button type="button" className="auth-footer-link" onClick={handleResend}>
                            {t('resendEmail') || 'Qayta yuborish'}
                        </button>
                    </p>
                </div>
            )}
        </div>
    );
};

export default ForgotPassword;
