import { useState } from 'react';
import './styles.css';

export default function Register() {
  const [isOrgMode, setIsOrgMode] = useState(false);
  const [userFormData, setUserFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [orgFormData, setOrgFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({ user: '', org: '' });

  const handleUserInputChange = (e) => {
    setUserFormData({ ...userFormData, [e.target.name]: e.target.value });
  };

  const handleOrgInputChange = (e) => {
    setOrgFormData({ ...orgFormData, [e.target.name]: e.target.value });
  };

  const handleUserSubmit = () => {
    if (userFormData.password !== userFormData.confirmPassword) {
      setErrors({ ...errors, user: 'Passwords do not match' });
      return;
    }
    setErrors({ ...errors, user: '' });
    console.log('User Registration:', userFormData);
    // Add your registration logic here
  };

  const handleOrgSubmit = () => {
    if (orgFormData.password !== orgFormData.confirmPassword) {
      setErrors({ ...errors, org: 'Passwords do not match' });
      return;
    }
    setErrors({ ...errors, org: '' });
    console.log('Organization Registration:', orgFormData);
    // Add your registration logic here
  };

  return (
    <>
      <div className={`container ${isOrgMode ? 'right-panel-active' : ''}`} id="container">
        {/* Organization Registration Form */}
        <div className="form-container register-container">
          <form action="#">
            <br />
            <h1>Organization Registration</h1>
            <br />
            <input
              name="name"
              type="text"
              placeholder="Organization Name"
              value={orgFormData.name}
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
            <button type="button" onClick={handleOrgSubmit}>
              Register
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
            <button type="button" onClick={handleUserSubmit}>
              Register
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
    </>
  );
}