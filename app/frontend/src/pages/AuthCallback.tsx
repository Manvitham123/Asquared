import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const API_BASE = import.meta.env.VITE_API_URL;

type MyJwtPayload = {
  email: string;
  // Add other fields from your JWT here if needed
};

const AuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Step 1: Normalize the URL hash if it's a raw token hash (e.g., #id_token=...)
    if (
      window.location.hash.includes('id_token') &&
      !window.location.hash.includes('/login-callback')
    ) {
      const rawParams = window.location.hash.substring(1); // Remove the initial #
      window.location.hash = `#/login-callback?${rawParams}`;
      return; // Wait for the redirect to reload this component
    }

    // Step 2: Extract `id_token` from hash or query
    let idToken: string | null = null;
  

    if (window.location.hash.startsWith('#/login-callback')) {
      const [, queryString] = window.location.hash.substring(1).split('?'); // remove '#' and split path/query
      const hashParams = new URLSearchParams(queryString || '');
      idToken = hashParams.get('id_token');
      
    } else {
      const params = new URLSearchParams(window.location.search);
      idToken = params.get('id_token');

    }


    // Step 3: Send token to backend and redirect
    if (idToken) {
      try {
        const decoded = jwtDecode<MyJwtPayload>(idToken);
        console.log('User Email:', decoded.email);

        fetch(`${API_BASE}/auth/set-cookie`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id_token: idToken }),
        })
          .then((response) => {
            if (response.ok) {
              navigate('/blog-upload', { replace: true });
            } else {
              console.error('Failed to set cookie');
            }
          })
          .catch((err) => {
            console.error('Error setting cookie:', err);
          });
      } catch (err) {
        console.error('JWT decoding failed:', err);
      }
    }
  }, [navigate, location]);

  return <p>Signing you in...</p>;
};

export default AuthCallback;
