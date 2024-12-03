# config.py
from firebase_admin import credentials, initialize_app, firestore
import pyrebase
import os
from dotenv import load_dotenv

load_dotenv()

# Firebase Admin SDK initialization
cred = credentials.Certificate({
    "type": "service_account",
    "project_id": "leetcode-46562",  # Updated to match your Firebase config
    "private_key_id": os.getenv("FIREBASE_PRIVATE_KEY_ID"),
    "private_key": os.getenv("FIREBASE_PRIVATE_KEY").replace('\\n', '\n'),
    "client_email": os.getenv("FIREBASE_CLIENT_EMAIL"),
    "client_id": os.getenv("FIREBASE_CLIENT_ID"),
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": os.getenv("FIREBASE_CLIENT_CERT_URL")
})

# Initialize Firebase Admin once
admin_app = initialize_app(cred)
db = firestore.client()

# Pyrebase config
firebase_config = {
    "apiKey": "firbaseconfigkey",
    "authDomain": "leetcode-46562.firebaseapp.com",
    "projectId": "leetcode-46562",
    "storageBucket": "leetcode-46562.firebasestorage.app",
    "messagingSenderId": "720711409618",
    "appId": "1:720711409618:web:dd1da1cdd65bdb614c720b",
    "measurementId": "G-BT4LW3MKLW",
    "databaseURL": "https://leetcode-46562.firebaseio.com"  # Add this
};

firebase = pyrebase.initialize_app(firebase_config)
auth = firebase.auth()
