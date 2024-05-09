import "./header.css"
import React from "react";

export default function Header ({onClick}){
    return(
        <>
             <h1 className="logo">
             <span className="logo-drive">DRIVE</span><span className="logo-dev">DEV</span>
             </h1>
            <button className="signIn-button" onClick={onClick}>Sign In / Register</button>
        </>
    );
}