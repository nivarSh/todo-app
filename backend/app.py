from flask import Flask, request, session, jsonify
from flask_session import Session
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
from pytz import timezone
from flask_sqlalchemy import SQLAlchemy

import os
import psycopg2
import psycopg2.extras

# init flask app
app = Flask(__name__)
app.secret_key = os.environ.get("SECRET_KEY")

# SQLAlchemy setup
db_url = os.environ.get("DATABASE_URL")
app.config["SQLALCHEMY_DATABASE_URI"] = db_url
db = SQLAlchemy(app)

app.config["SESSION_TYPE"] = "sqlalchemy"
app.config["SESSION_SQLALCHEMY_TABLE"] = "flask_sessions"
app.config["SESSION_SQLALCHEMY"] = db
app.config["SESSION_COOKIE_SAMESITE"] = "None"
app.config["SESSION_COOKIE_SECURE"] = True
Session(app)
CORS(app, supports_credentials=True, origins=[
    "http://localhost:5173",              # local dev
    "https://todo-app-nivar.vercel.app"   # deployed frontend
])

def get_db_connection():
    db_url = os.environ.get("DATABASE_URL")
    conn = psycopg2.connect(db_url, cursor_factory=psycopg2.extras.RealDictCursor)
    return conn


# Route: signup
@app.route('/signup', methods=["POST"])
def register():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({"error": "Missing username or password"}), 400

    conn = get_db_connection()
    cur = conn.cursor()

    # Check if username exists
    cur.execute("SELECT * FROM users WHERE username = %s", (username,))
    if cur.fetchone():
        conn.close()
        return jsonify({"error": "Username already exists"}), 400

    # Insert user
    hashed_pw = generate_password_hash(password)
    cur.execute(
        "INSERT INTO users (username, password_hash) VALUES (%s, %s) RETURNING id",
        (username, hashed_pw)
    )
    user_id = cur.fetchone()["id"]
    conn.commit()
    conn.close()

    # Immediately log the user in
    session['user_id'] = user_id
    session['username'] = username

    return jsonify({"message": "User registered successfully and logged in"}), 201


# Route: Login
@app.route('/login', methods=["POST"])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({"error": "Missing username or password"}), 400

    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT * FROM users WHERE username = %s", (username,))
    user = cur.fetchone()
    conn.close()

    if user and check_password_hash(user['password_hash'], password):
        session['user_id'] = user['id'] # write to session (start of session)
        session['username'] = user['username']
        return jsonify({"message": "Logged in successfully"})
    else:
        return jsonify({"error": "Invalid username or password"}), 401


# Route: Logout
@app.route('/logout', methods=["POST"])
def logout():
    session.clear()
    return jsonify({"message": "Logged out successfully"})


# Route: me
@app.route('/me', methods=["GET"])
def me():
    user_id = session.get('user_id') #read from session
    username = session.get('username')
    if user_id:
        return jsonify({"user_id": user_id, "username": username})
    return jsonify({"user_id": None, "username": None})


# when user logs minutes post that session into database with the date it occurred (timestamp)
# Route: work_logs
@app.route('/work_logs', methods=["POST"])
def work_logs():
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({"error": "Not logged in"}), 401
    
    data = request.json
    seconds = data.get('seconds')

    if seconds is None:
        return jsonify({"error": "Missing seconds"}), 400
    
    # Use local timezone
    local_tz = timezone("America/New_York")
    now = datetime.now(local_tz).date() 
    
    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute(
        "INSERT INTO work_logs (user_id, seconds, date) VALUES (%s, %s, %s)",
        (user_id, seconds, now)
    )

    conn.commit()
    cur.close()
    conn.close()

    return jsonify({"message": "Work logged successfully"})


# Goal: get the most recent logs for the timeframe: current date to last monday. (SQL Magic)
# Route: work_logs/weekly
@app.route('/work_logs/weekly', methods=["GET"])
def work_logs_weekly():
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({"error": "Not logged in"}), 401
    
    conn = get_db_connection()
    cur = conn.cursor()

    # Get today's date and Monday of this week
    today = datetime.today()
    start_of_week = today - timedelta(days=today.weekday())  # Monday

    # Query: group total seconds by date from this week's Monday to today
    cur.execute("""
        SELECT date, SUM(seconds) as total_seconds
        FROM work_logs
        WHERE user_id = %s
          AND date BETWEEN DATE(%s) AND DATE(%s)
        GROUP BY date
    """, (user_id, start_of_week.date(), today.date()))

    rows = cur.fetchall()
    conn.close()

    # Initialize response with 0s
    result = {
        "Monday": 0,
        "Tuesday": 0,
        "Wednesday": 0,
        "Thursday": 0,
        "Friday": 0,
        "Saturday": 0,
        "Sunday": 0
    }

    # Convert dates to day names and fill in the result
    for row in rows:
        day = row["date"].strftime("%A")
        seconds = row["total_seconds"]
        result[day] = seconds

    return jsonify(result)

@app.route('/work_logs/history', methods=["GET"])
def work_logs_history():
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({"error": "Not logged in"}), 401
    
    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute("""
                SELECT seconds, date
                FROM work_logs
                WHERE user_id = %s
                ORDER BY date DESC
                """, (user_id,))
    
    rows = cur.fetchall()
    cur.close()
    conn.close()

    history = [
        {"seconds": row["seconds"], "date": row["date"]}
        for row in rows
    ]

    return jsonify(history)



if __name__ == "__main__":
    app.run(debug=True)