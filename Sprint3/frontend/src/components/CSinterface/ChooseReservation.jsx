
import React, { useState } from "react";
import CustomModal from "../CarCard/CustomModal";
import "./CSinterface.css";
import CheckInCriterialForm from "./CheckInCriterialForm";
import CheckOutCriteriaForm from "./checkoutCriteriaForm";

export default function ChooseReservation({ carData, reservationData, everythingChecked, everythingSigned, checkoutValue }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  
  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleAllChecked = (checked) =>{
    if (checked){
        setIsModalOpen(false);
        everythingChecked(true);
    }
  }

  const handleAllChecked2 = (checked) =>{
    if (checked){
        setIsModalOpen(false);
        everythingChecked(true);
    }
  }

  const handleSigned = (value) =>{
    if (value){
        everythingSigned(true);
    }
  }

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    
    <div className="chooseReservationContainer">
    { reservationData ? 
    <>
    <h2 className="ChooseReservationTitle">
         From {formatDate(reservationData.startDate)} to {formatDate(reservationData.endDate)}
    </h2>    

   
          <h4 className="carTitle">{carData.make} {carData.model} {carData.year}</h4>
          <h4>{carData.transmissionType} transmission type</h4>
          <img src={carData.imageUrl} alt="reserved car" className="reservedCar" />
    
      <button className="register-button" onClick={handleModalOpen}>Choose Reservation</button>

      {checkoutValue ? 
      <CustomModal isOpen={isModalOpen} onClose={handleModalClose}>
      <CheckOutCriteriaForm onAllChecked={handleAllChecked2} statusAgreementConfirmed = {handleSigned}/>
      </CustomModal>
      :
      <CustomModal isOpen={isModalOpen} onClose={handleModalClose}>
      <CheckInCriterialForm onAllChecked={handleAllChecked} statusAgreementConfirmed = {handleSigned}/>
      </CustomModal>
      }
      
      </>  
      : "No reservation was found for this user..."
    }
    </div>
  );
}