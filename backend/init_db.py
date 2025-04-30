import sqlite3

# Connect to (or create) the database
conn = sqlite3.connect("database.db")
cur = conn.cursor()

# User table
cur.execute("""
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL
);
""")

# Work logs of all logged sessions
cur.execute("""
CREATE TABLE IF NOT EXISTS work_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    seconds INTEGER NOT NULL,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
""")

conn.commit()
conn.close()
print("✅ Database initialized!")
