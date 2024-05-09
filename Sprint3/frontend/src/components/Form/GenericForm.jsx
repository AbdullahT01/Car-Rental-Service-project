import "./form.css";
import React, { useState } from "react";

export default function GenericForm({ title, message, placeholder, type, buttonName, onSubmit }) {
    const [value, setValue] = useState("");

    const handleSubmit = (event) => {
        event.preventDefault(); // Prevent the default form submission
        onSubmit(value); // Call the onSubmit function passed as a prop with the input value
    };
    return(
        <form className="GenericForm" onSubmit={handleSubmit}>
        <p className="title">{title}</p>
        <p className="message">{message}</p>
       
        <input 
                required 
                placeholder={placeholder} 
                type={type} 
                className="input" 
                value={value} 
                onChange={e => setValue(e.target.value)} 
            />
       

        <button className="register-button">{buttonName}</button>

    </form>
    );
}