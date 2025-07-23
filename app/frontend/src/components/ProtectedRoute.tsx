import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
const API_BASE = import.meta.env.VITE_API_URL;

const ALLOWED_EMAIL = import.meta.env.VITE_ALLOWED_EMAIL || "manvithamoga@gmail.com"; // <-- Set your allowed email in .env as VITE_ALLOWED_EMAIL

const ProtectedRoute: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [token, setcookie] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${API_BASE}/auth/get-cookie`, {
      method: 'GET',
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => {
        setcookie(data.token || null);
      })
      .catch(() => setcookie(null));
  }, []);

  useEffect(() => {
    if (!token) return;
    // Instead of /api/userinfo, decode the JWT or fetch user info from your backend
    // Here, we'll decode the JWT on the frontend (if it's a JWT)
    try {
      const payload = token.split('.')[1];
      const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
      setUserEmail(decoded.email || null);
      if (decoded.email === ALLOWED_EMAIL) {
        console.log("User email is allowed: %s", userEmail);
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    } catch (e) {
      setIsAuthenticated(false);
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

  if (isAuthenticated === null) {
    return <p>Checking login...</p>; // optional loading UI
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: window.location.pathname }} />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
// This component checks if the user is authenticated before rendering the child routes.