import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const LandingPage = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ userId: '', password: '' });

  const handleLogin = (e) => {
    e.preventDefault();
    if (credentials.userId && credentials.password) {
      navigate('/dashboard', { state: { type: 'user' } });
    }
  };

  const handleChange = (e) => {
    setCredentials(prev => ({ ...prev, [e.target.id]: e.target.value }));
  };

  return (
    <div className="landing-container">
      {/* Navbar */}
      <nav className="landing-nav container">
        <ul className="nav-links">
          <li><a href="#">About Us</a></li>
          <li><a href="#">FAQs</a></li>
        </ul>
        <a href="#" className="nav-contact">Contact Us</a>
      </nav>

      <main className="hero container">
        <div className="hero-content">
          <h1 className="brand-title">
            Koshdarshi <span className="brand-subtitle-mini">(-कोषदर्शी)</span>
          </h1>
          <p className="brand-motto">“राष्ट्रको पैसा, राष्ट्रकै नजरमा”</p>

          <form className="login-form-embedded" onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="userId">User Id</label>
              <input
                type="text"
                id="userId"
                className="glass-input"
                value={credentials.userId}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                className="glass-input"
                value={credentials.password}
                onChange={handleChange}
              />
            </div>

            <div className="action-buttons">
              <button type="submit" className="pill-btn">Login</button>
              <button type="button" className="pill-btn" onClick={() => navigate('/dashboard', { state: { type: 'guest' } })}>As Guest</button>
            </div>
          </form>
        </div>
      </main>

      {/* Decorative Background Image Placeholder */}
      <div className="bg-image" />

      <style>{`
        .landing-container {
          min-height: 100vh;
          position: relative;
          color: white;
          overflow-x: hidden;
        }

        .bg-image {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: url('/temple-bg.jpg'); /* Local assets */
          background-size: cover;
          background-position: center;
          filter: brightness(0.4);
          z-index: -1;
        }

        .landing-nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 2rem;
          font-weight: 600;
          font-size: 1.125rem;
        }

        .nav-links {
          display: flex;
          gap: 2rem;
          list-style: none;
        }

        .nav-contact {
          text-decoration: underline;
        }

        .hero {
          display: flex;
          flex-direction: column;
          justify-content: center;
          min-height: calc(100vh - 80px); /* Adjust for nav */
          max-width: 1200px;
        }

        .hero-content {
          max-width: 500px;
        }

        .brand-title {
          font-size: 3.5rem;
          font-weight: 800;
          margin-bottom: 0.5rem;
          line-height: 1.2;
        }

        .brand-subtitle-mini {
          font-size: 2.5rem;
          font-weight: 400;
        }

        .brand-motto {
          font-size: 1.5rem;
          margin-bottom: 3rem;
          font-style: italic;
          opacity: 0.9;
        }

        .login-form-embedded {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          max-width: 400px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-group label {
          font-weight: 600;
          font-size: 1.1rem;
        }

        .glass-input {
          background: rgba(255, 255, 255, 0.2);
          border: none;
          border-radius: 2rem; /* Pill shape */
          padding: 0.75rem 1.5rem;
          color: white;
          font-size: 1rem;
          outline: none;
          transition: background 0.3s;
        }

        .glass-input:focus {
          background: rgba(255, 255, 255, 0.3);
          box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.5);
        }

        .action-buttons {
          display: flex;
          gap: 1rem;
          margin-top: 1rem;
        }

        .pill-btn {
          background: white;
          color: black;
          padding: 0.75rem 2rem;
          border-radius: 2rem;
          font-weight: 700;
          font-size: 1rem;
          border: none;
          cursor: pointer;
          transition: transform 0.2s, background-color 0.2s;
        }

        .pill-btn:hover {
          background: #f1f5f9;
          transform: translateY(-2px);
        }

        @media (max-width: 768px) {
          .brand-title { font-size: 2.5rem; }
          .landing-nav { flex-direction: column; gap: 1rem; }
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
