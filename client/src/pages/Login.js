import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Login.module.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const handleLogin = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/admins/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        console.log('Login successful');
        navigate('/'); // Redirect to dashboard
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error('Login failed:', error);
      setError('Login failed. Please try again.');
    }
  };

  return (
    <div className={styles.mainContainer}>
      <div className={styles.leftContainer}>
        <div className={styles.logo}>GoMaterial</div>
        <div className={styles.subtitle}>
          Find the right <span className={styles.customFont}>products</span> right away
        </div>
      </div>
      <div className={styles.rightContainer}>
        <div className={styles.loginForm}>
          <h2>Login to your account</h2>
          {error && <p className={styles.error}>{error}</p>}
          <label>
            Email / Phone
            <input type="text" placeholder="Jhondoe@gmail.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>
          <label>
            Password
            <input type="password" placeholder="********" value={password} onChange={(e) => setPassword(e.target.value)} />
          </label>
          <button onClick={handleLogin}>Login</button>
        </div>
      </div>
    </div>
  );
}

export default Login;
