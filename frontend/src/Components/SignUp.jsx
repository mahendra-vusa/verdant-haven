import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './Signup.css';
import API_BASE_URL from '../apiConfig';

function Signup() {
  const url = API_BASE_URL;
  const navigate = useNavigate();
  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm({ mode: 'onChange' });
  const password = watch('password');

  // State to manage the popup's visibility, message, and type
  const [popup, setPopup] = useState({
    isVisible: false,
    message: '',
    type: ''
  });

  // Helper function to show a popup
  const showPopup = (message, type) => {
    setPopup({ isVisible: true, message, type });
  };

  // Helper function to hide the popup
  const hidePopup = () => {
    setPopup({ isVisible: false, message: '', type: '' });
  };

  const onSubmit = async (data) => {
    // We don't need to send confirmPassword to the backend
    const { confirmPassword, ...userData } = data;

    try {
      await axios.post(`${url}/users/signup`, userData);
      reset(); // Clear the form fields
      showPopup("Signup successful! Redirecting to login...", 'success');

      // Navigate to the login page after a delay
      setTimeout(() => {
        hidePopup();
        navigate('/'); // Assuming '/' is your login route
      }, 3000);

    } catch (error) {
      reset(); // Clear form fields on error as well
      if (error.response?.status === 409) {
        // User already exists
        showPopup('User already exists. Please login or use a different email/username.', 'error');
      } else {
        // Other signup errors
        showPopup("Signup failed. Please try again.", 'error');
      }
    }
  };

  return (
    <div className="signup-container">
      {/* --- Popup --- */}
      {popup.isVisible && (
        <div className="popup-overlay">
          <div className={`popup-content ${popup.type}`}>
            <button className="popup-close-btn" onClick={hidePopup} style={{ float: 'right' }}>X</button>
            <p>{popup.message}</p>
            <span className="popup-icon">{popup.type === 'success' ? '✅' : ""}</span>
          </div>
        </div>
      )}

      <form className="signup-form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <h2>Signup</h2>

        <div>
          <label>User Name<span className='asterik'>*</span></label>
          <input {...register('username', { required: 'User Name is required' })} type="text" />
          {errors.username && <span className="error">{errors.username.message}</span>}
        </div>

        <div>
          <label>Email<span className='asterik'>*</span></label>
          <input
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                message: 'Please enter a valid email',
              },
            })}
            type="email"
            autoComplete="username"
          />
          {errors.email && <span className="error">{errors.email.message}</span>}
        </div>

        <div>
          <label>Mobile Number<span className='asterik'>*</span></label>
          <input
            {...register('mobileNumber', {
              required: 'Mobile Number is required',
              pattern: {
                value: /^[0-9]{10}$/,
                message: 'Mobile number must be 10 digits',
              },
              maxLength: 10
            })}
            type="text"
          />
          {errors.mobileNumber && <span className="error">{errors.mobileNumber.message}</span>}
        </div>

        <div>
          <label>Password<span className='asterik'>*</span></label>
          <input
            {...register('password', {
              required: 'Password is required',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters',
              },
            })}
            type="password"
            autoComplete="new-password"
          />
          {errors.password && <span className="error">{errors.password.message}</span>}
        </div>

        <div>
          <label>Confirm Password<span className='asterik'>*</span></label>
          <input
            {...register('confirmPassword', {
              required: 'Confirm Password is required',
              validate: value => value === password || 'Passwords do not match',
            })}
            type="password"
            autoComplete="new-password"
          />
          {errors.confirmPassword && <span className="error">{errors.confirmPassword.message}</span>}
        </div>

        <div>
          <label>Role<span className='asterik'>*</span></label>
          <select {...register('userRole', { required: 'Role is required' })}>
            <option value="">Select Role</option>
            <option value="User">User</option>
            <option value="Admin">Admin</option>
          </select>
          {errors.userRole && <span className="error">{errors.userRole.message}</span>}
        </div>
        <></>
        <button type="submit">Submit</button>

        <div className="login-link">
          <span>Already have an account? </span>
          <Link to="/">Login</Link>
        </div>
      </form>
    </div>
  );
}
export default Signup;
