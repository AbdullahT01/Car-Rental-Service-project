import React, { useState } from "react";
import "./CSinterface.css"; 

export default function CheckOutCriteriaForm({ onAllChecked, statusAgreementConfirmed}) {

    const [checkboxStates, setCheckboxStates] = useState({
        bookingConfirmation: false,
        driverLicense: false,
      });
    
      

      const handleCheckboxChange = (event) => {
        const { name, checked } = event.target;

        if (name === "agreementSigned") {
            // Prevent default action and show the modal instead
            event.preventDefault();
        } else {
            // Handle other checkboxes normally
            setCheckboxStates({ ...checkboxStates, [name]: checked });
        }
    };
    
      
    const handleSubmit = (event) => {
        event.preventDefault();
        const allChecked = Object.values(checkboxStates).every(checked => checked);
        if (!allChecked) {
            alert("Please check all the boxes before submitting.");
            return;
        }
        onAllChecked(true);
        
    };
    
    
    return (
        <>
        <form className="checkin-form" onSubmit={handleSubmit}>
            <h2 className="form-title">Car Rental Check-Out</h2>

            <section className="form-section">
                <h4 className="section-title">Pick Up the Car</h4>
                <div className="checkbox-wrapper">
                    <input type="checkbox" name="bookingConfirmation" id="bookingConfirmation" className="inp-cbx" style={{display: "none"}} onChange={handleCheckboxChange} />
                    <label htmlFor="bookingConfirmation" className="cbx">
                        <span className="checkbox-icon">
                            <svg viewBox="0 0 12 10" height="10px" width="12px">
                                <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
                            </svg>
                        </span>
                        <span>Car returned on Time</span>
                    </label>
                </div>

                <div className="checkbox-wrapper">
                    <input type="checkbox"  name="driverLicense" id="driverLicense" className="inp-cbx" style={{display: "none"}}  onChange={handleCheckboxChange}/>
                    <label htmlFor="driverLicense" className="cbx">
                        <span className="checkbox-icon">
                            <svg viewBox="0 0 12 10" height="10px" width="12px">
                                <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
                            </svg>
                        </span>
                        <span>Client Payed</span>
                    </label>
                </div>

         
            </section>

            <section className="form-section">
                <h4 className="section-title">Inspect the Car</h4>
                <textarea
                    name="damageReport"
                    placeholder="Report any damages here..."
                    className="form-textarea"
                />
            </section>

            <button type="submit" className="form-submit-btn">Submit</button>
        </form>


      
        </>
    );
}
