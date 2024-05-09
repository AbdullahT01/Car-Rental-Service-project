import React, { useState } from 'react';
import './PaymentForm.css'; 

const PaymentForm = ({onSubmit}) => {
    const [paymentDetails, setPaymentDetails] = useState({
        cardNumber: '',
        cardName: '',
        expiryDate: '',
        cvv: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPaymentDetails({
            ...paymentDetails,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    

        if (paymentDetails.cardNumber.length < 16 || paymentDetails.cardNumber.length > 19) {
            alert('The card number must be between 16 and 19 digits.');
            return;
        }
    
        // Check if the expiry date is in the future
        const currentDate = new Date();
        const currentYear = currentDate.getUTCFullYear();
        const currentMonth = currentDate.getUTCMonth() + 1; // getUTCMonth() returns months from 0-11
        const [expiryYear, expiryMonth] = paymentDetails.expiryDate.split('-').map(Number);
    
        if (expiryYear < currentYear || (expiryYear === currentYear && expiryMonth < currentMonth)) {
            alert('The card is already expired.');
            return;
        }
       
        const url = 'http://localhost:5000/saveCreditInfo';
    
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    
                },
                credentials: 'include',
                body: JSON.stringify(paymentDetails), 
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
    
            const data = await response.json();
            if(data.success){
                alert("credit card info has been inputted");
                onSubmit(true);
            }
          
            //
        } catch (error) {
            console.error('Payment failed:', error);
            
        }
    };
    

    return (
        <>
        <h1 style={{marginTop: '15px'}}>CREDIT INFORMATION</h1>
        <form className="payment-form" onSubmit={handleSubmit}>
            <div className="form-group">
                <label htmlFor="cardNumber">Card Number</label>
                <input
                    type="text"
                    id="cardNumber"
                    name="cardNumber"
                    maxLength="16"
                    placeholder="Your card number"
                    value={paymentDetails.cardNumber}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="form-group">
                <label htmlFor="cardName">Cardholder Name</label>
                <input
                    type="text"
                    id="cardName"
                    name="cardName"
                    placeholder="Name on card"
                    value={paymentDetails.cardName}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="form-group">
                <label htmlFor="expiryDate">Expiry Date</label>
                <input
                    type="month"
                    id="expiryDate"
                    name="expiryDate"
                    value={paymentDetails.expiryDate}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="form-group">
                <label htmlFor="cvv">CVV</label>
                <input
                    type="text"
                    id="cvv"
                    name="cvv"
                    maxLength="3"
                    placeholder="Security code"
                    value={paymentDetails.cvv}
                    onChange={handleChange}
                    required
                />
            </div>
            <button type="submit" className="register-button">Submit Payment</button>
        </form>
        </>
    );
};

export default PaymentForm;
