import "./AccountManagement.css"
import React from 'react';


export default function AccountManagementSection({ManagementSection, onClick}){
    return(
        <div className="AccountManagementSection-Container" onClick={onClick}>
           <p className="AccountManagementSection-Title">{ManagementSection}</p> 
        </div>
    )
}