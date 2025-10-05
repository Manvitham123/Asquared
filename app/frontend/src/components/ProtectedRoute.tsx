import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
const API_BASE = import.meta.env.VITE_API_URL;

// Define default allowed emails
const DEFAULT_ALLOWED_EMAILS = ['manvithm@umich.edu'];

// Get allowed emails from environment variable or use default
let ALLOWED_EMAILS: string[] = DEFAULT_ALLOWED_EMAILS;

try {
  const envEmails = import.meta.env.VITE_ALLOWED_EMAIL;
  if (envEmails && typeof envEmails === 'string') {
    const parsedEmails = envEmails.split(',')
      .map(email => email.trim())
      .filter(email => email.length > 0);
    if (parsedEmails.length > 0) {
      ALLOWED_EMAILS = parsedEmails;
    }
  } else {
    console.warn('VITE_ALLOWED_EMAIL is not set, using default emails:', DEFAULT_ALLOWED_EMAILS);
  }
} catch (error) {
  console.error('Error parsing VITE_ALLOWED_EMAIL:', error);
  console.warn('Using default allowed emails:', DEFAULT_ALLOWED_EMAILS);
}

// Log configuration for debugging
console.log('Final allowed emails:', ALLOWED_EMAILS);

interface AuthErrors {
  type: 'unauthorized' | 'not-found' | 'timeout';
  message: string;
}

interface DecodedToken {
  email: string;
  [key: string]: any; // for other possible token fields
}

const ProtectedRoute: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [token, setcookie] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [authError, setAuthError] = useState<AuthErrors | null>(null);
  const location = useLocation();

  useEffect(() => {
    fetch(`${API_BASE}/auth/get-cookie`, {
      method: 'GET',
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => {
        if (!data.token) {
          // Just set authenticated to false without error for initial no-token case
          setIsAuthenticated(false);
          setcookie(null);
        } else {
          setcookie(data.token);
        }
      })
      .catch(() => {
        console.error('Failed to fetch authentication status');
        setIsAuthenticated(false);
        setcookie(null);
      });
  }, []);

  useEffect(() => {
    if (!token) return;
    // Instead of /api/userinfo, decode the JWT or fetch user info from your backend
    // Here, we'll decode the JWT on the frontend (if it's a JWT)
    try {
      if (!token) {
        // Silently return for no token case
        return;
      }

      const parts = token.split('.');
      if (parts.length !== 3) {
        console.warn('Invalid token format detected');
        setIsAuthenticated(false);
        return;
      }

      const payload = parts[1];
      const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/'))) as DecodedToken;
      
      if (!decoded.email) {
        throw new Error('No email found in token');
      }

      setUserEmail(decoded.email);
      
      const userEmailLower = decoded.email.toLowerCase();
      const allowedEmailsLower = ALLOWED_EMAILS.map((email: string) => email.toLowerCase());
      console.log('User Email:', userEmail);
      console.log('Auth Check:', {
        userEmail: userEmailLower,
        allowedEmails: allowedEmailsLower,
        isAllowed: allowedEmailsLower.includes(userEmailLower)
      });
      
      if (allowedEmailsLower.includes(userEmailLower)) {
        console.log("Authentication successful for:", decoded.email);
        setIsAuthenticated(true);
        setAuthError(null);
      } else {
        console.log("Authentication failed - email not authorized:", decoded.email);
        setAuthError({ 
          type: 'unauthorized', 
          message: 'You are not authorized to access this page' 
        });
        setIsAuthenticated(false);
      }
    } catch (e) {
      console.error('Authentication error:', e);
      setIsAuthenticated(false);
      // Only set auth error if it's not a basic token validation issue
      if (e instanceof Error && !e.message.includes('token')) {
        setAuthError({ 
          type: 'unauthorized', 
          message: e.message 
        });
      }
    }
  }, [token]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isAuthenticated === null) {
        console.warn('Login check timed out.');
        setIsAuthenticated(false); // fallback
      }
    }, 5000); // 5 seconds max wait

    return () => clearTimeout(timer);
  }, [isAuthenticated]);

  useEffect(() => {
    // Only show alert when authentication succeeded but authorization failed (wrong email)
    if (authError?.type === 'unauthorized' && 
        authError.message === 'You are not authorized to access this page') {
      alert('Access denied: You are not authorized to access this page.');
    }
  }, [authError]);

  if (isAuthenticated === null) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '1.2rem',
        color: '#666'
      }}>
        Checking login...
      </div>
    );
  }

  if (!isAuthenticated) {
    // Store the current location for redirect after login
    const redirectPath = location.pathname;
    console.log('ProtectedRoute: Redirecting to login. Original path:', redirectPath);
    // Pass both state and URL parameter
    return <Navigate 
      to={`/login?redirect_to=${encodeURIComponent(redirectPath)}`} 
      replace 
      state={{ from: redirectPath }} 
    />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
// This component checks if the user is authenticated before rendering the child routes.