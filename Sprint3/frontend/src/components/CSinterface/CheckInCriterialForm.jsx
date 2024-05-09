import React, { useState } from "react";
import "./CSinterface.css"; 
import CustomModal from "../CarCard/CustomModal";

export default function CheckInCriteriaForm({ onAllChecked, statusAgreementConfirmed}) {

    const [checkboxStates, setCheckboxStates] = useState({
        bookingConfirmation: false,
        driverLicense: false,
        creditCardConfirmation: false,
        agreementSigned: false,
        depositConfirmed: false,
      });
    
      const [showAgrement, setShowAgrement] = useState(false);
      const [agreementConfirmed, setAgreementConfirmed] = useState(false);

      const handleCheckboxChange = (event) => {
        const { name, checked } = event.target;

        if (name === "agreementSigned") {
            // Prevent default action and show the modal instead
            event.preventDefault();
            setShowAgrement(true);
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
        statusAgreementConfirmed(agreementConfirmed);
        
    };
    
    const handleAgreementConfirm = () => {
        setAgreementConfirmed(true); // Confirm the agreement
        setCheckboxStates({ ...checkboxStates, agreementSigned: true }); // Check the agreementSigned checkbox
        setShowAgrement(false); // Close the modal
    };

    const handleCloseWithoutConfirmation = () => {
        if (!agreementConfirmed) {
            // Reset agreementSigned to false if the agreement wasn't confirmed
            setCheckboxStates({ ...checkboxStates, agreementSigned: false });
        }
        setShowAgrement(false);
    };
      
    return (
        <>
        <form className="checkin-form" onSubmit={handleSubmit}>
            <h2 className="form-title">Car Rental Check-In</h2>

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
                        <span>Booking Confirmation Presented</span>
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
                        <span>Valid Driver's License Presented</span>
                    </label>
                </div>

                <div className="checkbox-wrapper">
                    <input type="checkbox"  name="creditCardConfirmation" id="creditCardConfirmation" className="inp-cbx" style={{display: "none"}} onChange={handleCheckboxChange}/>
                    <label htmlFor="creditCardConfirmation" className="cbx">
                        <span className="checkbox-icon">
                            <svg viewBox="0 0 12 10" height="10px" width="12px">
                                <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
                            </svg>
                        </span>
                        <span>Credit Card Used for Reservation Presented</span>
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

            <section className="form-section">
                <h4 className="section-title">Sign Rental Agreement</h4>
                <div className="checkbox-wrapper">
                    <input type="checkbox" name="agreementSigned" id="agreementSigned" className="inp-cbx" style={{display: "none"}} onChange={handleCheckboxChange}/>
                    <label htmlFor="agreementSigned" className="cbx">
                        <span className="checkbox-icon">
                            <svg viewBox="0 0 12 10" height="10px" width="12px">
                                <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
                            </svg>
                        </span>
                        <span>Rental Agreement Signed</span>
                    </label>
                </div>
            </section>

            <section className="form-section">
                <h4 className="section-title">Take Deposit</h4>
                <div className="checkbox-wrapper">
                    <input type="checkbox" name="depositConfirmed" id="depositConfirmed" className="inp-cbx" style={{display: "none"}} onChange={handleCheckboxChange}/>
                    <label htmlFor="depositConfirmed" className="cbx">
                        <span className="checkbox-icon">
                            <svg viewBox="0 0 12 10" height="10px" width="12px">
                                <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
                            </svg>
                        </span>
                        <span>Deposit of 500 CAD Confirmed</span>
                    </label>
                </div>
            </section>

            <button type="submit" className="form-submit-btn">Submit</button>
        </form>

        
        <CustomModal isOpen={showAgrement} onClose={handleCloseWithoutConfirmation} className = "rentalModal">
                <div className="rental-agreement-content">
                <p>This Car Rental Agreement ("Agreement") is entered into as of [Date], by and between [Car Rental Company Name], ("Company"), and [Renter's Name], ("Renter"). The Company hereby agrees to rent to the Renter the motor vehicle described as [Vehicle Make, Model, Year, Color, and VIN], ("Vehicle"), under the following terms and conditions:</p>

<p><strong>1. Rental Period:</strong> The rental period shall commence on [Start Date] and shall conclude on [End Date], unless sooner terminated in accordance with the terms herein or extended by mutual agreement.</p>

<p><strong>2. Rental Fee:</strong> Renter agrees to pay the Company a rental fee of [Rental Fee Amount] for the rental period. Payment is due at the beginning of the rental period. Late returns may incur additional charges at a rate of [Late Return Fee Amount] per [hour/day] beyond the agreed return time.</p>

<p><strong>3. Security Deposit:</strong> Upon execution of this Agreement, Renter shall provide a security deposit amounting to [Security Deposit Amount]. This deposit will cover any potential damages to the Vehicle, fines, or additional charges incurred during the rental period. The security deposit will be fully refunded to the Renter within [Number of Days] days after the Vehicle is returned in satisfactory condition, minus any deductions for damages or outstanding charges.</p>

<p><strong>4. Use of Vehicle:</strong> The Vehicle shall be used solely for lawful purposes and in a manner consistent with normal use. The Renter agrees not to engage in any illegal activities with the Vehicle, including but not limited to racing, transporting illegal substances, or use in areas not suitable for the Vehicle's operation as per the manufacturer's guidelines.</p>

<p><strong>5. Maintenance and Repairs:</strong> The Renter agrees to maintain the Vehicle in a clean condition and to immediately report any mechanical failures or issues to the Company. The Renter shall not be responsible for mechanical repairs due to regular wear and tear. Any unauthorized repairs or modifications made by the Renter will be the Renter's responsibility and may result in additional charges.</p>

<p><strong>6. Insurance:</strong> The Renter must carry at least the minimum insurance coverage required by Quebec law. The Company provides [Type of Insurance Coverage] insurance for the Vehicle, which is included in the rental fee. The Renter may opt for additional insurance coverage at an extra cost.</p>

<p><strong>7. Restrictions on Use:</strong> The Renter shall not sublease the Vehicle or use it to transport passengers or property for hire. The Vehicle must remain within the Province of Quebec unless prior written consent is obtained from the Company for out-of-province travel.</p>

<p><strong>8. Governing Law:</strong> This Agreement shall be governed by and construed in accordance with the laws of the Province of Quebec and the applicable laws of Canada.</p>

<p><strong>9. Entire Agreement:</strong> This Agreement constitutes the entire agreement between the Company and the Renter regarding the rental of the Vehicle and supersedes all prior agreements, understandings, negotiations, and discussions, whether oral or written. No amendment or waiver of this Agreement will be binding unless executed in writing by both parties.</p>

<p>By signing below, the Company and the Renter agree to the terms and conditions outlined in this Car Rental Agreement and acknowledge receipt of a copy of this Agreement.</p>

<div>
    <form onSubmit={handleAgreementConfirm}>
        <input type="text" placeholder="SIGNATURE" className="agreementInput" required />
        <button className="register-button agrementBTN" type="submit">Confirm</button>
    </form>
</div>
                </div>
            </CustomModal>
      
        </>
    );
}
