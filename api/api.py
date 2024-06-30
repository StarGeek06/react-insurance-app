from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import joblib
import numpy as np
from pydantic import BaseModel
import os 

# Charger le modèle
model = joblib.load('random_forest_insurance.pkl')

app = FastAPI()


origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://react-insurance-app.onrender.com/"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class InputData(BaseModel):
    age: int
    bmi: float
    children: int
    smoker: int
    region: int

@app.get("/")
def home():
    return {"message":"Hello"}

@app.post("/predict")
def predict(data: InputData):
    input_data = np.array([[data.age, data.bmi, data.children, data.smoker, data.region]])
    prediction = model.predict(input_data)
    return {'charge': prediction[0]}

if __name__ == '__main__':
    import uvicorn
    port = int(os.environ.get('PORT', 8000))
    uvicorn.run(app, host='0.0.0.0', port=port)