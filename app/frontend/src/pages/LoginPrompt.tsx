import React, { useState } from 'react';


const API_BASE = import.meta.env.VITE_API_URL ;

const LoginPrompt: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
 

  // After login, redirect to the page the user originally wanted
 

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    if (!email) {
      setError('Please enter your email.');
      setLoading(false);
      return;
    }
    try {
      // Redirect to your backend's OAuth login endpoint
      window.location.href = `${API_BASE}/auth/google?email=${encodeURIComponent(email)}`;
    } catch (e) {
      setError('Failed to start login process.');
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f7f7fa' }}>
      <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 4px 24px rgba(0,0,0,0.08)', padding: '2.5rem 2rem', maxWidth: 400, width: '100%' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '1.2rem' }}>Sign In Required</h2>
        <p style={{ color: '#555', fontSize: '1rem', marginBottom: '1.5rem', textAlign: 'center' }}>
          You must be logged in with your authorized email to access this page.
        </p>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Enter your email"
          style={{
            width: '100%',
            padding: '0.6rem',
            borderRadius: '6px',
            border: '1px solid #ccc',
            marginBottom: '1rem',
            fontSize: '1rem',
          }}
          required
        />
        <button onClick={handleLogin} disabled={loading} style={{
          background: loading ? '#aaa' : '#2d72d9',
          color: '#fff',
          border: 'none',
          borderRadius: '6px',
          padding: '0.7rem',
          fontWeight: 600,
          fontSize: '1.08rem',
          cursor: loading ? 'not-allowed' : 'pointer',
          width: '100%',
          marginBottom: '1rem',
          transition: 'background 0.2s'
        }}>{loading ? 'Redirecting...' : 'Sign in with Google'}</button>
        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
      </div>
    </div>
  );
};

export default LoginPrompt;
