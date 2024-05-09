import React, { useState, useEffect } from "react";
import "./carCard.css";

export default function CarCardForm({ car, typeOfUser, userData }) {

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPrice, setCurrentPrice] = useState(car.price);
  const [includeInsurance, setIncludeInsurance] = useState(false);
  const [includeGPS, setIncludeGPS] = useState(false);
  const [hasCreditCard, setHasCreditCard] = useState(null);


  useEffect(() => {
    
    fetch(`http://localhost:5000/checkCreditCard`, {
      method: 'GET', 
      credentials: 'include', 
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error, status = ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log('Credit card check:', data);
      setHasCreditCard(data.hasCreditCard);
    })
    .catch((error) => {
      console.error('Error checking credit card:', error);
    });
  }, []); 
  
  
  let price = currentPrice;
  console.log(car.carID);
  function handleAmoutOfReservationDays() {

    if (!startDate || !endDate) {
      setCurrentPrice(currentPrice);
      return;
    } else {

      let gpsPrice = 0; 
      let insurancePrice = 0; 

      if (includeGPS){ gpsPrice = 4;}
      if (includeInsurance){ insurancePrice = 7;}

      let currentPriceHolder = car.price + gpsPrice + insurancePrice; 

      const start = new Date(startDate);
      const end = new Date(endDate);
      const timeDiff = end - start;
      const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
      if(daysDiff === 1){
        setCurrentPrice(currentPriceHolder);
      }else{
        setCurrentPrice(car.price*daysDiff + currentPriceHolder - car.price);
      }
      
    }
  }

  function handleAddingInsurance(value) {
    if (value) {
      setCurrentPrice(currentPrice + 7);
    } else {
      setCurrentPrice(currentPrice - 7);
    }
  }

  function handleAddingGPS(value) {
    if (value) {
      setCurrentPrice(currentPrice + 4);
    } else {
      setCurrentPrice(currentPrice - 4);
    }
  }



  useEffect(() => {
    handleAmoutOfReservationDays();
  }, [startDate, endDate]);

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent default form submission

    if (currentPrice < car.price) {
      alert("Invalid reservation period. You must change your dates.");
      return;
    }

    
    console.log(car.id);

    if(typeOfUser === ""){
      alert("Please Login or SignUp first.");
      return; 
    }
  
    if(!hasCreditCard){
      alert("Please naviage to the Account Management section and add your payment details first");
      return;
    }

    let userID = userData ? userData.userID : null;

      const carData = {
      carID: car.carID,
      startDate,
      endDate,
      totalPrice: currentPrice,
      userID: userID
    };

    fetch('http://localhost:5000/startReservation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // If you need to include cookies for cross-origin requests
      body: JSON.stringify(carData),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error, status = ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Reservation was a success', data);
        alert("your reservation has been booked!");
      })
      .catch((error) => {
        console.error('Reservation Error:', error);

      });
  };

  return (
    <div className="carCardForm-customModal-container">
      <h1>
        Reserve your {car.make} {car.model}
      </h1>

      <form className="carCardForm-customModal" onSubmit={handleSubmit}>
        <label>
          Car Make
          <input type="text" placeholder="Car Make" value={car.make} readOnly />
        </label>

        <label>
          Car Model
          <input
            type="text"
            placeholder="Car Model"
            value={car.model}
            readOnly
          />
        </label>

        <label>
          Year of Car
          <input
            type="text"
            placeholder="Year of Car"
            value={car.year}
            readOnly
          />
        </label>

        <label>
          Color
          <input type="text" placeholder="Color" value={car.color} readOnly />
        </label>

        <label>
          Transmission Type
          <input
            type="text"
            placeholder="Transmission Type"
            value={car.transmissionType}
            readOnly
          />
        </label>
        <label>
          Final Price
          <input className="price"
            type="text"
            placeholder="Year of Car"
            value={price}
            readOnly
          />
        </label>
        <div className="date-container">
          <label>
          Start Date
          <input
              type="date"
              value={startDate}
            onChange={(e) => {
              setStartDate(e.target.value);
              // Delay the invocation to ensure both states are updated
              handleAmoutOfReservationDays();
            }}
            required
            />
          </label>

          <label>
            End Date
            <input
              type="date"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                // Delay the invocation to ensure both states are updated
                handleAmoutOfReservationDays();
              }}
              required
            />
          </label>
        </div>
        <div className="toggleContainer">
          <h5 className="toggleTitle">Include insurance</h5>
          <label className="switch">
            <input
              type="checkbox"
              checked={includeInsurance}
              onChange={(e) => {
                setIncludeInsurance(e.target.checked);
                handleAddingInsurance(e.target.checked);
              }}
            />
            <span className="slider"></span>
          </label>


          <h5 className="toggleTitle2">Include gps</h5>
          <label className="switch">
            <input
              type="checkbox"
              checked={includeGPS}
              onChange={(e) => {
                setIncludeGPS(e.target.checked);
                handleAddingGPS(e.target.checked);
              }}
            />
            <span className="slider"></span>
          </label>
        </div>
        <input type="submit" value="Reserve Your Car" />
      </form>

    </div>
  );
}
