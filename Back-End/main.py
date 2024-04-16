from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pymongo import errors
from bson import ObjectId
from models import Admin, Candidat, Questionnaire
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
import bcrypt
from datetime import datetime
from typing import List

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

async def connect_to_mongo():
    app.mongodb_client = AsyncIOMotorClient("mongodb://localhost:27017")
    app.mongodb = app.mongodb_client.SmartHire

def disconnect_from_mongo():
    if app.mongodb_client:
        app.mongodb_client.close()
        

app.add_event_handler("startup", connect_to_mongo)
app.add_event_handler("shutdown", disconnect_from_mongo)


def verify_password(plain_password, hashed_password):
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password)

@app.get('/api')
def principal():
    return {"message": "Bienvenue sur notre site"}

def document_to_dict(document):
    return {**document, "_id": str(document["_id"])}

@app.get("/candidats/")
async def read_candidats():
    candidats = []
    async for candidat in app.mongodb.Candidats.find():
        candidats.append(document_to_dict(candidat))
    return candidats

@app.post("/candidats/")
async def create_candidat(candidat: Candidat):
    existing_user = await app.mongodb.Candidats.find_one({"Email": candidat.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Un candidat avec cet email existe déjà")
    
    candidat_dict = candidat.model_dump()
    result = await app.mongodb.Candidats.insert_one(candidat_dict)
    print(candidat.email)
    return {"_id": str(result.inserted_id), "email": candidat.email}, 200

@app.post("/admin/connexion/")
async def admin_connexion(admin: Admin):
    existing_admin = await app.mongodb["Admin"].find_one({"email": admin.email})
    if not existing_admin or admin.password != existing_admin["password"]:
        raise HTTPException(status_code=400, detail="Identifiants incorrects")
    print(existing_admin)
    return {"message": "Connexion réussie", "email": existing_admin["email"]}, 200


@app.post("/questionnaires/")
async def create_questionnaire(questionnaire: Questionnaire):
    existing = await app.mongodb.Questionnaires.find_one({"category": questionnaire.category})
    if existing:
        raise HTTPException(status_code=400, detail="Un questionnaire de cette catégorie existe déjà.")
    result = await app.mongodb.Questionnaires.insert_one(questionnaire.model_dump())
    return {"id": str(result.inserted_id), "category": questionnaire.category}

@app.get("/questionnaires/{category}", response_model=List[Questionnaire])
async def get_questionnaire_by_category(category: str):
    questionnaires = []
    async for questionnaire in app.mongodb.Questionnaires.find({"category": category}):
        questionnaires.append(questionnaire)
    return questionnaires