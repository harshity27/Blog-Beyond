import React, { useState } from 'react';
import styles from './Login.module.css';

const Login = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSignUp) {
      console.log('Sign Up Data:', formData);
    } else {
      console.log('Sign In Data:', formData);
    }
  };

  return (
    <div className={`${styles.container} ${isSignUp ? styles.active : ''}`} id="container">
      {/* Sign Up Form */}
      <div className={`${styles.formContainer} ${styles.signUp}`}>
        <form onSubmit={handleSubmit}>
          <h1>Create Account</h1>
          <div className={styles.socialIcons}>
            <a href="#" className={styles.icons}><i className='bx bxl-google'></i></a>
            <a href="#" className={styles.icons}><i className='bx bxl-facebook'></i></a>
            <a href="#" className={styles.icons}><i className='bx bxl-github'></i></a>
            <a href="#" className={styles.icons}><i className='bx bxl-linkedin'></i></a>
          </div>
          <span>Register with E-mail</span>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Enter E-mail"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Enter Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="submit">Sign Up</button>
        </form>
      </div>

      {/* Sign In Form */}
      <div className={`${styles.formContainer} ${styles.signIn}`}>
        <form onSubmit={handleSubmit}>
          <h1>Sign In</h1>
          <div className={styles.socialIcons}>
            <a href="#" className={styles.icons}><i className='bx bxl-google'></i></a>
            <a href="#" className={styles.icons}><i className='bx bxl-facebook'></i></a>
            <a href="#" className={styles.icons}><i className='bx bxl-github'></i></a>
            <a href="#" className={styles.icons}><i className='bx bxl-linkedin'></i></a>
          </div>
          <span>Login With Email & Password</span>
          <input
            type="email"
            name="email"
            placeholder="Enter E-mail"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Enter Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <a href="#">Forget Password?</a>
          <button type="submit">Sign In</button>
        </form>
      </div>

      {/* Toggle Container */}
      <div className={styles.toggleContainer}>
        <div className={styles.toggle}>
          <div className={`${styles.togglePanel} ${styles.toggleLeft}`}>
            <h1>Welcome To <br />Berojgar Blogger</h1>
            <p>Sign in With ID & Password</p>
            <button
              className={styles.hidden}
              onClick={() => setIsSignUp(false)}
            >
              Sign In
            </button>
          </div>
          <div className={`${styles.togglePanel} ${styles.toggleRight}`}>
            <h1>Hello,</h1>
            <p>Join us on this journey and experience a blogging platform that's as dynamic as you are.</p>
            <button
              className={styles.hidden}
              onClick={() => setIsSignUp(true)}
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
