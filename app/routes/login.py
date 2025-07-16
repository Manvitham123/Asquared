from flask import Blueprint, request, redirect
from flask import request, jsonify, make_response
import urllib.parse
from dotenv import load_dotenv
load_dotenv()


login_bp = Blueprint('login_bp', __name__)

GOOGLE_CLIENT_ID = '443923119590-3qmk4os051eqkmauda2d2kt0nq9uinpn.apps.googleusercontent.com'
import os

REDIRECT_URI = os.environ.get("GOOGLE_REDIRECT_URI")


@login_bp.route('/auth/google', methods=['GET'])
def google_redirect():
    email = request.args.get('email')
    print(f'email={email}')
    mode = request.args.get('mode')  # optional
    # Always use REDIRECT_URI from .env
    query = {
        'client_id': GOOGLE_CLIENT_ID,
        'redirect_uri': REDIRECT_URI,
        'response_type': 'id_token',
        'scope': 'openid email profile',
        'nonce': 'abc123',
        'login_hint': email or '',
    }
    if mode:
        query['state'] = f"mode={mode}"  # Pass the mode through state

    google_auth_url = f"https://accounts.google.com/o/oauth2/v2/auth?{urllib.parse.urlencode(query)}"
    return redirect(google_auth_url)


@login_bp.route('/auth/set-cookie', methods=['POST'])
def set_cookie():
    data = request.get_json()
    id_token = data.get('id_token')
    print(f'id:token:{id_token}')
    print('hellooo')

    if not id_token:
        return jsonify({'error': 'Missing token'}), 400

    response = make_response(jsonify({'message': 'Token set in cookie'}))
    response.set_cookie(
        key='id_token',
        value=id_token,
        httponly=True,
        secure=False,  # Set to True in prod with HTTPS
        samesite='Lax',
        max_age=3600
    )
    return response

@login_bp.route('/auth/get-cookie', methods=['GET'])
def get_cookie():
    token = request.cookies.get('id_token')
    if token: 
        print(f'Cookie token: {token}')
        return jsonify({'token': token}), 200
    else:
        return jsonify({'token': None}), 200

@login_bp.route('/auth/callback')
def callback():
    return 'Test route works!'


@login_bp.route('/logout', methods=['POST'])
def logout():
    response = make_response(jsonify({'message': 'Logged out'}))
    response.set_cookie('id_token', '', expires=0, httponly=True, samesite='Lax')
    return response