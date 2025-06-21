import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './LoginPage.module.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/login`, {
        email,
        password,
      });

      const { token, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.card} onSubmit={handleLogin}>
        <h2 className={styles.title}>Log In</h2>

        <input
          className={styles.input}
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          className={styles.input}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button className={styles.button} type="submit">Log In</button>

        {message && <p className={styles.message}>{message}</p>}
      </form>
    </div>
  );
};

export default LoginPage;
