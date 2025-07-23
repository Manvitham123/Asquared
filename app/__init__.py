from flask import Flask
from app.routes.s3_api import s3_api
from app.routes.login import login_bp
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    CORS(app, origins=["http://localhost:5173", "https://manvitham123.github.io", "https://www.asquaredmag.org", "https://api.asquaredmag.org"], supports_credentials=True)

    app.register_blueprint(s3_api)
    app.register_blueprint(login_bp)
    return app
