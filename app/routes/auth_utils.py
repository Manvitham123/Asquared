import time
import requests
from functools import wraps
from flask import request, jsonify, g
from authlib.jose import jwt, JoseError

_jwks_cache = {}
_jwks_cache_expiry = {}

OIDC_PROVIDERS = {
    "https://accounts.google.com/": "https://accounts.google.com/.well-known/openid-configuration",
    "https://login.microsoftonline.com/": "https://login.microsoftonline.com/common/v2.0/.well-known/openid-configuration",
}



def get_jwks(jwks_uri, cache_seconds=3600):
    now = time.time()
    if (jwks_uri in _jwks_cache and
        now < _jwks_cache_expiry.get(jwks_uri, 0)):
        return _jwks_cache[jwks_uri]
    resp = requests.get(jwks_uri)
    jwks = resp.json()
    _jwks_cache[jwks_uri] = jwks
    _jwks_cache_expiry[jwks_uri] = now + cache_seconds
    return jwks

def get_jwks_for_issuer(issuer):
    discovery_url = OIDC_PROVIDERS.get(issuer)
    if not discovery_url:
        raise Exception("Unknown OIDC provider")
    resp = requests.get(discovery_url)
    jwks_uri = resp.json()['jwks_uri']
    return get_jwks(jwks_uri)

def token_and_user_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth = request.headers.get('Authorization', None)
        if not auth or not auth.startswith('Bearer '):
            return jsonify({'error': 'Missing or invalid Authorization header'}), 401
        token = auth.split()[1]
        print(f"Token: {token}")
        # Decode header to get issuer (iss) without verifying signature
       
        try:
            jwks = get_jwks_for_issuer("https://accounts.google.com/")
            claims = jwt.decode(token, jwks)
            claims.validate()  # Checks exp, nbf, etc.
        except JoseError:
            return jsonify({'error': 'Invalid or expired token'}), 401
        except Exception as ex:
            print(f"Error: {ex}")
            return jsonify({'error': 'OIDC provider or JWKS error'}), 401

        # Map to local user (adjust claim as needed)
        username = claims.get('preferred_username') or claims.get('email')
        print(username)
        #user = User.query.filter_by(email=username).first()
        #if not user:
            #print(f"User not found: {username}")
            #return jsonify({'error': 'User not found'}), 403    
     
        #g.current_user = user
        return f(*args, **kwargs)
    return decorated


def get_email_from_token():
    jwks = get_jwks_for_issuer("https://accounts.google.com/")
    auth = request.headers.get('Authorization', None)
    if not auth or not auth.startswith('Bearer '):
        return jsonify({'error': 'Missing or invalid Authorization header'}), 401
    token = auth.split()[1]
    print(f"Token: {token}")
    print(f"token from cookie: {token}")
    if not token:
        return None
    try:
        decoded = jwt.decode(token, jwks)
        print(f"decoded token: {decoded}")
        return decoded.get("email")
    except Exception as e:
        print("JWT decode error:", e)
        return None