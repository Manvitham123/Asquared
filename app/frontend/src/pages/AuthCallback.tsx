import { useEffect} from 'react';
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

  // Get redirect path from URL parameters
  const getRedirectPath = () => {
    // Check URL search params
    const params = new URLSearchParams(window.location.search);
    const searchRedirectTo = params.get('redirect_to');
    console.log('AuthCallback: URL redirect_to:', searchRedirectTo);

    // Check hash params
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const hashRedirectTo = hashParams.get('redirect_to');
    console.log('AuthCallback: Hash redirect_to:', hashRedirectTo);

    // Check state
    const stateFrom = (location.state as { from?: string })?.from;
    console.log('AuthCallback: State from:', stateFrom);

    // Use sessionStorage as last resort
    const storedPath = sessionStorage.getItem('redirectPath');
    console.log('AuthCallback: Stored path:', storedPath);

    const finalPath = searchRedirectTo || hashRedirectTo || stateFrom || storedPath || '/blog-upload';
    console.log('AuthCallback: Final redirect path:', finalPath);
    return finalPath;
  };

  const handleRedirect = () => {
    const redirectPath = getRedirectPath();
    console.log('AuthCallback: Found redirect path:', redirectPath);
    navigate(redirectPath, { replace: true });
  };

  useEffect(() => {
    document.body.classList.add('authcallback-page');
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
      const [, queryString] = window.location.hash.substring(1).split('?');
      const hashParams = new URLSearchParams(queryString || '');
      idToken = hashParams.get('id_token');
    } else {
      const params = new URLSearchParams(window.location.search);
      idToken = params.get('id_token');
    }

    // Step 3: Send token to backend and redirect
    if (idToken) {
      let decoded: MyJwtPayload | null = null;
      try {
        decoded = jwtDecode<MyJwtPayload>(idToken);
        console.log('User Email:', decoded.email);
      } catch (err) {
        console.error('JWT decode error:', err);
      }
      fetch(`${API_BASE}/auth/set-cookie`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_token: idToken }),
      })
        .then((response) => {
          if (response.ok) {
            // Call our redirect handler
            handleRedirect();
          } else {
            console.error('Failed to set cookie');
            navigate('/login', { replace: true });
          }
        })
        .catch((err) => {
          console.error('Error setting cookie:', err);
        });
    }
    return () => {
      document.body.classList.remove('authcallback-page');
    };
  }, [navigate, location]);

  return <p>Signing you in...</p>;
};

export default AuthCallback;
