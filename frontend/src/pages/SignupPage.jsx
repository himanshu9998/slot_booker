import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './SignupPage.module.css';

const SignupPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/signup`, formData)
      setMessage('Signup successful! Redirecting...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.error || 'Signup failed');
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.card} onSubmit={handleSubmit}>
        <h2 className={styles.title}>Sign Up</h2>

        <input
          className={styles.input}
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <input
          className={styles.input}
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          className={styles.input}
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <button className={styles.button} type="submit">Create Account</button>

        {message && <p className={styles.message}>{message}</p>}
      </form>
    </div>
  );
};

export default SignupPage;
