import os
import psycopg2
from psycopg2.extras import RealDictCursor
from dotenv import load_dotenv

load_dotenv()

# Connect to the PostgreSQL database using the DATABASE_URL env variable
def get_db_connection():
    db_url = os.environ.get("DATABASE_URL")
    return psycopg2.connect(db_url, cursor_factory=RealDictCursor)

# Create tables
def init():
    conn = get_db_connection()
    cur = conn.cursor()

    # Users table
    cur.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL
    );
    """)

    # Work logs table
    cur.execute("""
    CREATE TABLE IF NOT EXISTS work_logs (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id),
        seconds INTEGER NOT NULL,
        date DATE NOT NULL DEFAULT CURRENT_DATE
    );
    """)

    # Sessions table
    cur.execute("""
    CREATE TABLE flask_sessions (
        session_id TEXT PRIMARY KEY,
        data BYTEA,
        expiry TIMESTAMP
    );
    """)

    conn.commit()
    cur.close()
    conn.close()
    print("✅ PostgreSQL database initialized!")

if __name__ == "__main__":
    init()
