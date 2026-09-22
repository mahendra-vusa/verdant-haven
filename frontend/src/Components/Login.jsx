import  { useState, useEffect } from 'react';
import './Login.css';
// import logo from '../assets/images/logo.png';
// import loginImage from '../assets/images/login.png';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { login } from '../userSlice';
import API_BASE_URL from '../apiConfig';

const emailRegex = /^[\w.-]+@[\w.-]+\.[A-Za-z]{2,}$/;

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showpswd, updateShowpswd] = useState(false);
  const url = API_BASE_URL;

  // State to manage the new dynamic popup
  const [popup, setPopup] = useState({
    isVisible: false,
    message: '',
    type: '' // 'success' or 'error'
  });

  // useEffect to automatically hide error popups after 3 seconds
  useEffect(() => {
    if (popup.isVisible && popup.type === 'error') {
      const timer = setTimeout(() => {
        setPopup({ isVisible: false, message: '', type: '' });
      }, 3000); // Popup will disappear after 3 seconds

      // Cleanup function to clear the timer if the component unmounts
      return () => clearTimeout(timer);
    }
  }, [popup]);

  const validate = () => {
    let valid = true;
    if (!email) {
      setEmailError('Email is required');
      valid = false;
    } else if (!emailRegex.test(email)) {
      setEmailError('Invalid email address');
      valid = false;
    } else {
      setEmailError('');
    }

    if (!password) {
      setPasswordError('Password is required');
      valid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      valid = false;
    } else {
      setPasswordError('');
    }

    return valid;
  };

  // Helper function to show a popup
  const showPopup = (message, type) => {
    setPopup({ isVisible: true, message, type });
  };

  const hidePopup = () => {
    setPopup({ isVisible: false, message: '', type: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const response = await axios.post(`${url}/users/login`, { email, password });
      const user = response.data;

      setEmail('');
      setPassword('');
      localStorage.setItem('Token', user.token);

      // Show success popup instead of the old one
      showPopup('Login Successful!', 'success');

      if (user.role === 'User') {
        localStorage.setItem("currUser", JSON.stringify({ role: 'User', username: user.username, id: user.id }));
        dispatch(login());
        setTimeout(() => navigate('/Components/HomePage'), 1500); // Navigate after 1.5s
      } else {
        localStorage.setItem("currUser", JSON.stringify({ role: 'Admin', username: user.username, id: user.id }));
        dispatch(login());
        setTimeout(() => navigate('/Components/HomePage'), 1500); // Navigate after 1.5s
      }

    } catch (err) {
      // Use the new popup for errors
      const errorMessage = err.response?.data?.message || "Something went wrong. Please try again.";
      showPopup(errorMessage, 'error');
    }
  };

  const showPasswordToggle = () => updateShowpswd(!showpswd);

  return (
    <div className="login-container">
      {/* --- Popup --- */}
      {popup.isVisible && (
        <div className="popup-overlay">
          <div className={`popup-content ${popup.type}`}>
          <button className="popup-close-btn" onClick={hidePopup} style={{float:'right'}}>X</button>
            <p>{popup.message}</p>
            <span className="popup-icon">{popup.type === 'success' ? '✅':""}</span>
          </div>
        </div>
      )}

      <div className="image-section">
        <img src="" alt="Login Illustration" className="login-image" />
      </div>
      <div className='login-side'>
        <div className='logo-head'>
          <img src="" alt="GreenGarden Logo" className="logo" />
          <h2>GreenGarden</h2>
        </div>
        <div className="login-box">
          <h2>Login</h2>
          <form onSubmit={handleSubmit}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={emailError ? 'error-input' : ''}
            />
            {emailError && <div className="error">{emailError}</div>}

            <label htmlFor="password">Password</label>
            <div className='pswd-wrapper'>
              <input
                id="password"
                type={showpswd ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={passwordError ? 'error-input' : ''}
              />
              <span onClick={showPasswordToggle} className='toggle-password'>{showpswd ? "Hide" : "Show"}</span>
            </div>
            {passwordError && <div className="error">{passwordError}</div>}

            <div className="forgot-password">
              <Link to='/Components/ForgotPage'>Forgot Password?</Link>
            </div>

            <button type="submit" className='submitBtn'>Login</button>
          </form>

          <div className="signup-link">
            <span>Don't have an account? </span>
            <Link to='/Components/Signup'>Signup</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;

