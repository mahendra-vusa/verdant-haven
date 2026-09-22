import { useState } from 'react';
// import image from '../assets/images/forgotpassword.png';
// import img2 from '../assets/images/logo.png';
import './ForgotPassword.css';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import API_BASE_URL from '../apiConfig';

function ForgotPassword() {
  const url = API_BASE_URL;
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    newPass: "",
    confirm: ""
  });
  const [isVerified, setIsVerified] = useState(false);

  // State to manage the integrated popup
  const [popup, setPopup] = useState({
    isVisible: false,
    message: '',
    type: '' // 'success' or 'error'
  });

  // Helper function to show a popup
  const showPopup = (message, type) => {
    setPopup({ isVisible: true, message, type });
  };

  // Helper function to hide the popup
  const hidePopup = () => {
    setPopup({ isVisible: false, message: '', type: '' });
  };

  const handleVerify = () => {
    if (!form.email) {
      showPopup('Email is required', 'error');
      return;
    }
    axios.get(`${url}/users/verifyEmail?email=${form.email}`)
      .then(res => {
        showPopup("Email verified. You can now reset your password.", 'success');
        setIsVerified(true);
      })
      .catch(err => {
        showPopup("Email not found. Please check and try again.", 'error');
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isVerified) {
      showPopup("Please verify your email first.", 'error');
      return;
    }
    if (!form.newPass || !form.confirm) {
      showPopup("Please fill in both password fields.", 'error');
      return;
    }
    if (form.newPass !== form.confirm) {
      showPopup("Passwords do not match.", 'error');
      return;
    }

    axios.post(`${url}/users/resetPassword`, { email: form.email, password: form.newPass })
      .then(() => {
        showPopup("Password updated successfully!", 'success');
        setTimeout(() => {
          hidePopup();
          navigate('/');
        }, 2000); // Navigate after 2 seconds
      })
      .catch(err => {
        console.error("Error updating password:", err);
        showPopup("Failed to update password. Please try again.", 'error');
      });
  };

  return (
    <div className='page'>
      {/* ---Popup --- */}
      {popup.isVisible && (
        <div className="popup-overlay">
          <div className={`popup-content ${popup.type}`}>
            <button className="popup-close-btn" onClick={hidePopup} style={{ float: 'right' }}>X</button>
            <p>{popup.message}</p>
            <span className="popup-icon">{popup.type === 'success' ? '✅' : ""}</span>
          </div>
        </div>
      )}

      <div className='container'>
        <div className='form-container'>
          <img src="" width='50px' height='50px' alt="Logo" className="logo" />
          <h1>Forgot Password</h1>
          <p>Enter your email to reset your password.</p>
          <form onSubmit={handleSubmit}>
            <label htmlFor='email'><strong>Email<span className='asterik'>*</span></strong></label><br />
            <input
              id='email'
              value={form.email}
              name='email'
              placeholder='example@gmail.com'
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              readOnly={isVerified} // Makes email field uneditable after verification
            /><br />
            <button className='verify' type='button' onClick={handleVerify} disabled={isVerified}>
              {isVerified ? 'Verified' : 'Verify'}
            </button><br />

            <label htmlFor='newPass'><strong>New Password<span className='asterik'>*</span></strong></label><br />
            <input
              type="password"
              name="newPass"
              id="newPass"
              value={form.newPass}
              placeholder='Enter new password'
              onChange={(e) => setForm({ ...form, newPass: e.target.value })}
              disabled={!isVerified} // Disable until email is verified
            /><br />


            <label htmlFor='confirm'><strong>Confirm New Password<span className='asterik'>*</span></strong></label><br />
            <input
              type="password"
              name="confirm"
              id="confirm"
              value={form.confirm}
              placeholder='Re-enter new password'
              onChange={(e) => setForm({ ...form, confirm: e.target.value })}
              disabled={!isVerified} // Disable until email is verified
            /><br />

            <button type='submit' className='reset-btn' disabled={!isVerified}>Reset Password</button><br />
            <p className="login-link-text">Remembered your password? <Link to="/">Login</Link></p>
          </form>
        </div>
        <div className='img-container'>
          <img src="" alt="Forgot Password Illustration" />
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
