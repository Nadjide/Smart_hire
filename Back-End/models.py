from pydantic import BaseModel, EmailStr, validator

class Admin(BaseModel):
    email: EmailStr
    password: str

class Candidat(BaseModel):
    email: EmailStr
    nom: str
    prénom: str
    date_de_naissance: str
    téléphone: str

    @validator('date_de_naissance')
    def parse_date(cls, v):
        return v
    
class Question(BaseModel):
    theme: str
    content: str

class Questionnaire(BaseModel):
    category: str
    questions: list[Question]
