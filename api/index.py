from flask import Flask, jsonify, request, g
import datetime
import mysql.connector
import os
from passlib.hash import sha256_crypt

app = Flask(__name__)

UPLOAD_FOLDER = 'public/profile' 
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

db_config = {
    'user': os.getenv("DB_USERNAME"),
    'password': os.getenv("DB_PASSWORD"),
    'host': os.getenv("DB_HOST"),
    'database': os.getenv("DB_NAME"),
    'raise_on_warnings': True,
}


def get_db():
    if 'db' not in g:
        g.db = mysql.connector.connect(**db_config)
    return [g.db, g.db.cursor()]

# cleanup operations - close db
@app.teardown_appcontext
def teardown_appcontext(error):
    db = g.pop('db', None)
    if db is not None:
        db.close()

@app.route('/')
def home():
    return 'This is Pineko API'

# get all users 
@app.route("/api/users", methods =['GET'])
def get_users():
    cursor = get_db()[1]

    cursor.execute("SELECT * FROM user ORDER BY experience_points DESC")
    all_users = cursor.fetchall()
    
    return jsonify(all_users)

# login
@app.route('/api/login', methods =['GET', 'POST'])
def login():
    cursor = get_db()[1]

    user = request.get_json()

    email = user.get('email').lower() # ignore capitalization
    password = user.get('password')

    cursor.execute('SELECT * FROM user WHERE email = "%s"' % email)
    user_data = cursor.fetchone()

    if user_data:
        hashed_password_from_db = user_data[3]

        if sha256_crypt.verify(password, hashed_password_from_db):
            # Passwords match, user is authenticated
            return jsonify(user_data)
        else:
            # Incorrect password
            return jsonify("Incorrect password")

    else:
        # User not found
        return jsonify("User not found")
