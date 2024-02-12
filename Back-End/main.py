from fastapi import FastAPI, HTTPException
import sqlite3

from models import Candidate, User

app = FastAPI()

def get_db_connection():
    return sqlite3.connect('database.db')

@app.post("/register/user")
def register_user(user: User):
    conn = get_db_connection()
    c = conn.cursor()
    c.execute("INSERT INTO User (Email, password) VALUES (?, ?)", (user.email, user.password))
    conn.commit()
    conn.close()
    return {"status": "success"}

@app.post("/register/candidat")
def register_candidat(candidate: Candidate):
    conn = get_db_connection()
    c = conn.cursor()
    c.execute("INSERT INTO Candidats (Email, Nom, Prénom, Date_de_naissance, Téléphone) VALUES (?, ?, ?, ?, ?)", (candidate.email, candidate.nom, candidate.prenom, candidate.date_de_naissance, candidate.telephone))
    conn.commit()
    conn.close()
    return {"status": "success"}

@app.post("/login/admin")
def login_admin(user: User):
    conn = get_db_connection()
    c = conn.cursor()
    c.execute("SELECT * FROM User WHERE Email = ? AND password = ?", (user.email, user.password))
    result = c.fetchone()
    conn.close()
    if result:
        return {"status": "success"}
    else:
        raise HTTPException(status_code=400, detail="Invalid credentials")