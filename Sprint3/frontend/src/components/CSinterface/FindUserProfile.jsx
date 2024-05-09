import React, { useState } from 'react';
import './CSinterface.css';

export default function FindUserForm({ onUserData, type }) {
    const [email, setEmail] = useState('');
    const [inputClass, setInputClass] = useState('input');

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        try {
            const response = await fetch('http://localhost:5000/getUserByEmail', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: email }),
            });
            
          
            const data = await response.json();
            if(data.success){
                onUserData(data.data);
                setInputClass("input right");
            }else{
                setInputClass("input wrong");
            }
            
            
        } catch (error) {
            console.error('There was an error!', error);
        }
    };

   

    return (
        
        <form className= {type === "findUserFromCar" ? "registrationformCS CAR" : "registrationformCS"} onSubmit={handleSubmit}>
            <p className="title">Find User</p>
            {inputClass === "input wrong" ? <label className='labelForBadInput'>invalid Email</label> : null}
            <input
                placeholder="User's Email"
                type="email"
                className = {inputClass}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <button type="submit" className="register-button">
                Find User
            </button>
        </form>
    );
}
