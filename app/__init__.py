from flask import Flask
from app.routes.s3_api import s3_api
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    CORS(app, origins=["http://localhost:5173", "https://manvitham123.github.io"])
    app.register_blueprint(s3_api)
    return app
