import os
from dotenv import load_dotenv
load_dotenv()


class Config: 
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'a_default_secret_key' 
    #SQLALCHEMY_DATABASE_URI = 'postgresql://<username>:<password>@<host>:<port>/<database>'
    DB_HOSTNAME = os.environ.get('DB_HOSTNAME')
    DB_USERNAME = os.environ.get('DB_USERNAME')
    DB_PASSWORD = os.environ.get('DB_PASSWORD')
    SQLALCHEMY_DATABASE_URI= f"postgresql://{DB_USERNAME}:{DB_PASSWORD}@{DB_HOSTNAME}:5432/postgres"
    
    #SQLALCHEMY_DATABASE_URI = 'postgresql://mannytest:T#uO7ysZ2xK3<nA!nU~qzM$NjeuR@scheduleapp-dev.cluster-c3gk6u20wjqi.us-east-2.rds.amazonaws.com:5432/postgres'
    GOOGLE_CLIENT_ID = os.environ.get("GOOGLE_CLIENT_ID", "dev-client-id")
    GOOGLE_CLIENT_SECRET = os.environ.get("GOOGLE_CLIENT_SECRET", "dev-client-secret")
    SECRET_KEY = os.environ.get("FLASK_SECRET_KEY", "dev") 

