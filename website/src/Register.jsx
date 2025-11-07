import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './styles.css';

export default function Register() {
  const navigate = useNavigate();
  const [isOrgMode, setIsOrgMode] = useState(false);
  const [userFormData, setUserFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [orgFormData, setOrgFormData] = useState({
    organizationName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({ user: '', org: '' });
  const [loading, setLoading] = useState({ user: false, org: false });

  const handleUserInputChange = (e) => {
    setUserFormData({ ...userFormData, [e.target.name]: e.target.value });
  };

  const handleOrgInputChange = (e) => {
    setOrgFormData({ ...orgFormData, [e.target.name]: e.target.value });
  };

  const handleUserSubmit = async () => {
    // Clear previous errors
    setErrors({ ...errors, user: '' });
    
    // Client-side validation
    if (!userFormData.name || !userFormData.email || !userFormData.password || !userFormData.confirmPassword) {
      setErrors({ ...errors, user: 'All fields are required' });
      return;
    }

    if (userFormData.password !== userFormData.confirmPassword) {
      setErrors({ ...errors, user: 'Passwords do not match' });
      return;
    }

    if (userFormData.password.length < 6) {
      setErrors({ ...errors, user: 'Password must be at least 6 characters' });
      return;
    }

    setLoading({ ...loading, user: true });

    try {
      const response = await axios.post('https://cop4331project.dev/api/users/register/user', {
        name: userFormData.name,
        email: userFormData.email,
        password: userFormData.password,
        confirmPassword: userFormData.confirmPassword
      });

      // Check if status is 200 or 201 (success)
      if (response.status === 200 || response.status === 201) {
        console.log('User Registration Success:', response.data);
        alert('Registration successful! Redirecting to login...');
        navigate('/login');
      }
    } catch (error) {
      console.error('Registration error:', error);
      // Handle error response from backend
      if (error.response && error.response.data) {
        setErrors({ ...errors, user: error.response.data.message || 'Registration failed' });
      } else {
        setErrors({ ...errors, user: 'Network error. Please try again.' });
      }
    } finally {
      setLoading({ ...loading, user: false });
    }
  };

  const handleOrgSubmit = async () => {
    // Clear previous errors
    setErrors({ ...errors, org: '' });
    
    // Client-side validation
    if (!orgFormData.organizationName || !orgFormData.email || !orgFormData.password || !orgFormData.confirmPassword) {
      setErrors({ ...errors, org: 'All fields are required' });
      return;
    }

    if (orgFormData.password !== orgFormData.confirmPassword) {
      setErrors({ ...errors, org: 'Passwords do not match' });
      return;
    }

    if (orgFormData.password.length < 6) {
      setErrors({ ...errors, org: 'Password must be at least 6 characters' });
      return;
    }

    setLoading({ ...loading, org: true });

    try {
      const response = await axios.post('https://cop4331project.dev/api/users/register/organizer', {
        organizationName: orgFormData.organizationName,
        email: orgFormData.email,
        password: orgFormData.password,
        confirmPassword: orgFormData.confirmPassword
      });

      // Check if status is 200 or 201 (success)
      if (response.status === 200 || response.status === 201) {
        console.log('Organization Registration Success:', response.data);
        alert('Registration successful! Redirecting to login...');
        navigate('/login');
      }
    } catch (error) {
      console.error('Registration error:', error);
      // Handle error response from backend
      if (error.response && error.response.data) {
        setErrors({ ...errors, org: error.response.data.message || 'Registration failed' });
      } else {
        setErrors({ ...errors, org: 'Network error. Please try again.' });
      }
    } finally {
      setLoading({ ...loading, org: false });
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-page-background"></div>
      <button className="back-button" onClick={() => navigate('/')}>
        ← Back
      </button>
      
      <div className={`container ${isOrgMode ? 'right-panel-active' : ''}`} id="container">
        {/* Organization Registration Form */}
        <div className="form-container register-container">
          <form action="#">
            <br />
            <h1>Organization Registration</h1>
            <br />
            <input
              name="organizationName"
              type="text"
              placeholder="Organization Name"
              value={orgFormData.organizationName}
              onChange={handleOrgInputChange}
            />
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={orgFormData.email}
              onChange={handleOrgInputChange}
            />
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={orgFormData.password}
              onChange={handleOrgInputChange}
            />
            <input
              name="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              value={orgFormData.confirmPassword}
              onChange={handleOrgInputChange}
            />
            <br />
            <button type="button" onClick={handleOrgSubmit} disabled={loading.org}>
              {loading.org ? 'Registering...' : 'Register'}
            </button>
            {errors.org && <p className="error-text">{errors.org}</p>}
          </form>
        </div>

        {/* User Registration Form */}
        <div className="form-container sign-in-container">
          <form action="#">
            <br />
            <h1>User Registration</h1>
            <br />
            <input
              name="name"
              type="text"
              placeholder="Full Name"
              value={userFormData.name}
              onChange={handleUserInputChange}
            />
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={userFormData.email}
              onChange={handleUserInputChange}
            />
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={userFormData.password}
              onChange={handleUserInputChange}
            />
            <input
              name="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              value={userFormData.confirmPassword}
              onChange={handleUserInputChange}
            />
            <br />
            <button type="button" onClick={handleUserSubmit} disabled={loading.user}>
              {loading.user ? 'Registering...' : 'Register'}
            </button>
            {errors.user && <p className="error-text">{errors.user}</p>}
          </form>
        </div>

        {/* Overlay */}
        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <h1>Looking for Events Around UCF?</h1>
              <p>Register as a User</p>
              <br />
              <button className="ghost" onClick={() => setIsOrgMode(false)}>
                User Registration
              </button>
            </div>
            <div className="overlay-panel overlay-right">
              <h1>Looking To Host an Event?</h1>
              <p>Sign Up as an Organization</p>
              <br />
              <button className="ghost" onClick={() => setIsOrgMode(true)}>
                Organization Registration
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}