import React, { useState } from 'react';
import axios from 'axios';

function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        'https://slot-booker.onrender.com/api/auth/signup',
        { email, password },
        {
          withCredentials: true,  // important if you use cookies/sessions
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      setMessage('Signup successful! Please check your email.');
      console.log(response.data);
    } catch (error) {
      console.error('Signup error:', error);
      setMessage('Signup failed. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSignup}>
      <input
        type="email"
        value={email}
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        value={password}
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Sign Up</button>
      <p>{message}</p>
    </form>
  );
}

export default SignupPage;
