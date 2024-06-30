from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import joblib
import numpy as np
from pydantic import BaseModel

# Charger le modèle
model = joblib.load('random_forest_insurance.pkl')

app = FastAPI()


origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173"
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
    uvicorn.run(app, host='127.0.0.1', port=8000)
