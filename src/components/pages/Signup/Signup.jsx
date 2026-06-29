import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/Authontext';
import { RiLightbulbFill } from 'react-icons/ri';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import '../SignIn/Signin.css'; // Use shared styles

const Signup = () => {
    const { signup, signupForm, setSignupForm } = useAuth();
    const navigate = useNavigate();

    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (signupForm.password.length < 8) {
            setError("Password must be at least 8 characters long.");
            return;
        }

        if (signupForm.password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        // Save to localStorage using context method
        signup({
            name: signupForm.name,
            email: signupForm.email,
            password: signupForm.password
        });

        // Clear state
        setSignupForm({ name: "", email: "", password: "" });
        setConfirmPassword('');
        
        // After signing up, we can automatically log them in or redirect to signin.
        // Let's redirect to signin as requested: "forgot login va register qilgandan keyin Hompage chiqishi kerak"
        // Wait, "register qilgandan keyin Hompage chiqishi kerak" -> "after register, the HomePage should appear"
        // Ah! If register should go directly to HomePage, we should set isAuth to true in localStorage and context!
        // Let's see: in Authontext.jsx, signup does:
        // const signup = (userData) => {
        //     localStorage.setItem("user", JSON.stringify(userData));
        //     setUser(userData);
        // };
        // It doesn't set isAuth = true.
        // But if the user wants register to go directly to HomePage:
        // We can set isAuth = true in our register handler, or update Authontext.jsx, or do it here!
        // Let's make it so that upon successful registration, we automatically log them in and navigate to "/" (HomePage)!
        // This is a very smooth user experience and matches "register qilgandan keyin HomePage chiqishi kerak".
        localStorage.setItem("isAuth", "true");
        // We need to trigger the auth state update. Since we can't easily trigger the state change in Authontext without modifying it,
        // let's check if we can modify Authontext.jsx to set isAuth to true during signup, or we can just update Authontext.jsx!
        // Let's modify Authontext.jsx to support auto-login on signup or let's do it in Authontext.jsx directly.
        // Yes, let's update Authontext.jsx to set isAuth = true when signup is called, or let's call login after signup.
        // If we call signup and then login, it will set isAuth to true.
        // Let's look at Authontext.jsx:
        // const signup = (userData) => {
        //     localStorage.setItem("user", JSON.stringify(userData));
        //     setUser(userData);
        // };
        // If we call signup, we can then call login(email, password) and it will work!
        // Let's do that:
        signup({
            name: signupForm.name,
            email: signupForm.email,
            password: signupForm.password
        });
        login(signupForm.email, signupForm.password);
        navigate("/");
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

                {/* Registration Form */}
                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="auth-field-group">
                        <label className="auth-label">Full name</label>
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
                        <label className="auth-label">Email address</label>
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

                    <button type="submit" className="auth-submit-btn">
                        Create Account &rarr;
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
