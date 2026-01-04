import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const LoginPage = () => {
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        // Simulate login
        navigate('/dashboard');
    };

    return (
        <div className="login-container">
            <div className="glow-bg-left" />

            <Card className="login-card">
                <div className="login-header">
                    <h2>Welcome Back</h2>
                    <p className="text-muted">Sign in to Koshdarshi</p>
                </div>

                <form onSubmit={handleLogin} className="login-form">
                    <Input
                        id="email"
                        label="Email Address"
                        type="email"
                        placeholder="you@example.com"
                        required
                    />
                    <Input
                        id="password"
                        label="Password"
                        type="password"
                        placeholder="••••••••"
                        required
                    />

                    <div className="form-actions">
                        <Button type="submit" size="lg" style={{ width: '100%' }}>
                            Sign In
                        </Button>
                    </div>

                    <div className="form-footer">
                        <span className="text-muted">Don't have an account?</span>
                        <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
                            Sign Up
                        </Button>
                    </div>
                </form>
            </Card>

            <style>{`
        .login-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
          position: relative;
        }

        .glow-bg-left {
          position: absolute;
          bottom: -10%;
          left: -5%;
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, rgba(15, 23, 42, 0) 70%);
          z-index: -1;
          pointer-events: none;
        }

        .login-card {
          width: 100%;
          max-width: 400px;
          box-shadow: var(--shadow-lg);
        }

        .login-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .login-header h2 {
          font-size: 1.75rem;
          margin-bottom: 0.5rem;
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .form-footer {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          margin-top: 1rem;
          font-size: 0.875rem;
        }
      `}</style>
        </div>
    );
};

export default LoginPage;
