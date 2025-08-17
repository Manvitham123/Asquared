from flask import Flask, request
from app.routes.s3_api import s3_api
from app.routes.login import login_bp
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    
    # Configure CORS
    CORS(app, 
        resources={
            r"/*": {
                "origins": [
                    "http://localhost:5173",
                    "https://manvitham123.github.io",
                    "https://www.asquaredmag.org",
                    "https://api.asquaredmag.org"
                ],
                "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
                "allow_headers": ["Content-Type", "Authorization"],
                "expose_headers": ["Content-Type", "Authorization"],
                "supports_credentials": True,
                "max_age": 600  # Cache preflight requests for 10 minutes
            }
        }
    )

    # Add CORS headers to all responses
    @app.after_request
    def after_request(response):
        response.headers.add('Access-Control-Allow-Origin', request.headers.get('Origin', '*'))
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
        response.headers.add('Access-Control-Allow-Credentials', 'true')
        return response

    app.register_blueprint(s3_api)
    app.register_blueprint(login_bp)
    return app
