import { useState } from 'react';
import './SignIn.css';

function SignIn({ onSignIn }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (email && password.length >= 6) {
            onSignIn();
        } else {
            setError('Please enter a valid email and a password (min 6 chars).');
        }
    };

    return (
        <div className="signin-container">
            <div className="signin-glass-panel">
                <div className="signin-header">
                    <h2 className="title-gradient">Welcome Back</h2>
                    <p>Login to access standard state-of-the-art YOLOv9 models</p>
                </div>

                {error && <div className="signin-error">{error}</div>}

                <form onSubmit={handleSubmit} className="signin-form">
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button type="submit" className="btn-primary signin-btn">
                        Sign In
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="btn-icon">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                        </svg>
                    </button>
                </form>

                <div className="signin-footer">
                    <p>Don't have an account? <a href="#" className="signin-link" onClick={(e) => { e.preventDefault(); onSignIn(); }}>Try demo</a></p>
                </div>
            </div>
        </div>
    );
}

export default SignIn;
