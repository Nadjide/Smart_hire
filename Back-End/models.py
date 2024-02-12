from pydantic import BaseModel

class User(BaseModel):
    email: str
    password: str

class Candidate(BaseModel):
    email: str
    password: str
    nom: str
    prenom: str
    date_de_naissance: str
    telephone: str