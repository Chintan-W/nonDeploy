import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/register', userData);
      console.log('Registration successful:', response.data);
      navigate('/login');
    } catch (error) {
      setError('Registration failed. Please check your input and try again.');
      console.error('Registration failed:', error.response.data);
    }
  };

  return (
    <div className="container">
      <h2 className="mt-5">Register</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div className="mb-3">
        <label htmlFor="username" className="form-label">
          Username:
        </label>
        <input
          type="text"
          className="form-control"
          id="username"
          name="username"
          value={userData.username}
          onChange={handleInputChange}
        />
      </div>
      <div className="mb-3">
        <label htmlFor="password" className="form-label">
          Password:
        </label>
        <input
          type="password"
          className="form-control"
          id="password"
          name="password"
          value={userData.password}
          onChange={handleInputChange}
        />
      </div>
      <button className="btn btn-primary" onClick={handleRegister}>
        Register
      </button>
    </div>
  );
};

export default Register;
