import React, { useState } from 'react';
import axios from 'axios';
import 'react-dom'
import './InsuranceForm.css'
import backImage from './assets/images/back.png'
import nextImage from './assets/images/next.png'

const StepOne = ({ formData, handleChange, nextStep }) => (
  <div>
    <h2>1/5: Age</h2>
    <label>
      
      <input
        type="number"
        name="age"
        value={formData.age}
        onChange={handleChange}
      />
    </label>
    <br />
    <button onClick={nextStep} className='next'><img src={nextImage} alt="" /></button>
  </div>
);

const StepTwo = ({ formData, handleChange, nextStep, prevStep }) => (
  <div>
    <h2>2/5: BMI</h2>
    <label>
      
      <input
        type="number"
        name="bmi"
        value={formData.bmi}
        onChange={handleChange}
      />
    </label>
    <br />
    <button onClick={prevStep}><img src={backImage} alt="retour" /></button>
    <button onClick={nextStep} className='nexti'><img src={nextImage} alt="" /></button>
  </div>
);

const StepThree = ({ formData, handleChange, nextStep, prevStep }) => (
  <div>
    <h2>3/5: Children</h2>
    <label>
    
      <input
        type="number"
        name="children"
        value={formData.children}
        onChange={handleChange}
      />
    </label>
    <br />
    <button onClick={prevStep}><img src={backImage} alt="retour" /></button>
    <button onClick={nextStep}className='nexti'><img src={nextImage} alt="" /></button>
  </div>
);

const StepFour = ({ formData, handleChange, nextStep, prevStep }) => (
  <div>
    <h2>4/5: Smoker</h2>
    <label>
      
      <select
        name="smoker"
        value={formData.smoker}
        onChange={handleChange}
      >
        <option value="">Select</option>
        <option value="0">Non</option>
        <option value="1">Oui</option>
      </select>
    </label>
    <br />
    <button onClick={prevStep}><img src={backImage} alt="retour" /></button>
    <button onClick={nextStep} className='nexti'><img src={nextImage} alt="" /></button>
  </div>
);

const StepFive = ({ formData, handleChange, handleSubmit, prevStep }) => (
  <div>
    <h2>5/5: Region</h2>
    <label>
      
      <select
        name="region"
        value={formData.region}
        onChange={handleChange}
      >
        <option value="">Select</option>
        <option value="0">Nord-Ouest</option>
        <option value="1">Nord-Est</option>
        <option value="2">Sud-Ouest</option>
        <option value="3">Sud-Est</option>
      </select>
    </label>
    <br />
    <button onClick={prevStep}><img src={backImage} alt="retour" /></button>
    <button onClick={handleSubmit} className='nexti'>Go</button>
  </div>
);

const Result = ({ charge, resetForm }) => (
  <div>

    <div className="result">
      <h2>Primes approximatives..:</h2>
      <h3>{charge}</h3>
      <button onClick={resetForm}>Reprendre</button>
    </div>
    
  </div>
);

const InsuranceForm = () => {
  const [formData, setFormData] = useState({
    age: '',
    bmi: '',
    children: '',
    smoker: '',
    region: ''
  });
  const [step, setStep] = useState(1);
  const [charge, setCharge] = useState(null);
  const [error, setError] = useState(null);

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateInputs = () => {
    const { age, bmi, children, smoker, region } = formData;
    return age > 0 && bmi > 0 && children >= 0 && (smoker === '0' || smoker === '1') && (region === '0' || region === '1' || region === '2' || region === '3');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateInputs()) {
      setError('Please enter valid inputs.');
      return;
    }
    try {
      const response = await axios.post('http://127.0.0.1:8000/predict', formData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      setCharge(response.data.charge);
      setError(null);
      setStep(step + 1); 
    } catch (error) {
      console.error('Error during prediction:', error);
      setError('Error during prediction. Please try again.');
    }
  };

  const resetForm = () => {
    setFormData({
      age: '',
      bmi: '',
      children: '',
      smoker: '',
      region: ''
    });
    setStep(1);
    setCharge(null);
    setError(null);
  };

  

  switch (step) {
    case 1:
      return <StepOne formData={formData} handleChange={handleChange} nextStep={nextStep} />;
    case 2:
      return <StepTwo formData={formData} handleChange={handleChange} nextStep={nextStep} prevStep={prevStep} />;
    case 3:
      return <StepThree formData={formData} handleChange={handleChange} nextStep={nextStep} prevStep={prevStep} />;
    case 4:
      return <StepFour formData={formData} handleChange={handleChange} nextStep={nextStep} prevStep={prevStep} />;
    case 5:
      return <StepFive formData={formData} handleChange={handleChange} handleSubmit={handleSubmit} prevStep={prevStep} />;
    case 6:
      return <Result charge={charge} resetForm={resetForm} />;
    default:
      return null;
  }
};

export default InsuranceForm;
