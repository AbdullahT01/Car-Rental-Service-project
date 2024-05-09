import React, { useState, useEffect } from 'react';
import CustomModal from "../CarCard/CustomModal";
import "./CSinterface.css";
import ChooseReservation from "./ChooseReservation";

export default function UserProfile({userData, checkOutValue}) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [carData, setCarData] = useState(null);
    const [valueBTN, setValueBTN] = useState("register-button notReady")
    const [reservationData, setReservationData] = useState(null);
    const [isAllChecked, setIsAllChecked] = useState(false); // To track if all items are checked
    const [isAllSigned, setIsAllSigned] = useState(false);


    useEffect(() => {
        const  endpoint = checkOutValue ? "http://localhost:5000/checkActiveIncompleteReservationsWithCar" : "http://localhost:5000/checkInactiveReservationsWithCar";
        if (userData !== null) {
          // Define the async function inside the effect
          const fetchUserData = async () => {
            try {
              const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userID: userData.userID }),
              });
    
            
    
              const data = await response.json();
              if(data.success){
                if (data.car.imageUrl) {
               
                // Convert the buffer array to a Base64 string
                const base64String = btoa(String.fromCharCode(...data.car.imageUrl.data));
                // Construct the image URL
                const imageUrl = `data:image/jpeg;base64,${base64String}`; // Replace 'jpeg' with the correct format if necessary
         
                // Update carData with the new imageUrl and other car data
                setCarData({
                    ...data.car,
                    imageUrl: imageUrl
                });
                setReservationData(data.reservation); 

            } else {
                setCarData(data.car);
                setReservationData(data.reservation); 
            }
        }else{
            setReservationData(null); 
        }
        } catch (error) {
            console.error('There was an error fetching the data!', error);
        }
    };

    fetchUserData();
}
}, [userData]);

const handleSetIsActiveReservation = async (event) =>{
    event.preventDefault(); 

    let endpoint = checkOutValue ? "http://localhost:5000/completedReservation ": "http://localhost:5000/setActivateReservation ";

    const response = await fetch(endpoint, {
        method: 'POST',
        headers:  {
            'Content-Type': 'application/json',
        }, 
        body: JSON.stringify({reservationID: reservationData.ReservationID})
    });

    const data = await response.json(); 


    if(data.success && !checkOutValue){
        alert("The client is now checked in")
    }else if (data.success && checkOutValue){
        alert("The client is now checked out")
    }else{
        alert("An error occured, please try again.")
    }
}; 

    const openModal = () => {
      setIsModalOpen(true);
    };
  
    const closeModal = () => {
      setIsModalOpen(false);
    };

    useEffect(() => {
        // This effect watches for changes in isAllChecked and isAllSigned
        if (isAllChecked && isAllSigned) {
            setValueBTN("register-button ready");
        } else if (checkOutValue && isAllChecked) {
            setValueBTN("register-button ready"); // Ensure the button is not ready if either condition is false
        }else {
            setValueBTN("register-button");
        }
    }, [isAllChecked, isAllSigned]); 


    const handleAllChecked = (checked) => {
        setIsAllChecked(checked);
    };
    const handleAllSigned = (signed) => {
        setIsAllSigned(signed);
    };

    return (
        <>
        {userData === null ? 
        <div className="ProfileContainer">
            <div className="pfpContainer">
                <span id="pfp" className="material-icons-sharp">account_circle</span>
                <hr className="separator" /> {/* Faint line under the profile picture */}
            </div>
            <div className="userInfo">
                {/* Display First Name, Last Name, and Email */}
                <div className="infoItem"> input valid user email first</div>
            </div>
            <div className="actionButtons btn">
               
                
            </div>
        </div>
        :
        <div className="ProfileContainer">
            <div className="pfpContainer">
                <span id="pfp" className="material-icons-sharp">account_circle</span>
                <hr className="separator" /> {/* Faint line under the profile picture */}
            </div>
            <div className="userInfo">
                {/* Display First Name, Last Name, and Email */}
                <div className="infoItem"> {userData.firstName}</div>
                <div className="infoItem"> {userData.lastName}</div>
                <div className="infoItem">{userData.email}</div>
            </div>
            <div className="actionButtons btn">
                {/* Action Buttons */}
                <button className="register-button" onClick={openModal}>Find Reservation</button>

                        {checkOutValue && valueBTN === "register-button ready" ? (
                            <button className={valueBTN} onClick={handleSetIsActiveReservation}>Check-Out</button>
                        ) : valueBTN === "register-button ready" && !checkOutValue ? (
                            <button className={valueBTN} onClick={handleSetIsActiveReservation}>Check-In</button>
                        ) : (
                            <button className={valueBTN}>Check-In</button>
                        )}


            </div>
        </div>
        }
        {checkOutValue ?  
            <CustomModal isOpen={isModalOpen} onClose={closeModal}>
            <ChooseReservation carData={carData} reservationData = {reservationData} everythingChecked = {handleAllChecked} everythingSigned={handleAllSigned} checkoutValue = {true}/> {/* This is where you can add more complex modal content */}
            </CustomModal>
             :
            <CustomModal isOpen={isModalOpen} onClose={closeModal}>
            <ChooseReservation carData={carData} reservationData = {reservationData} everythingChecked = {handleAllChecked} everythingSigned={handleAllSigned} /> {/* This is where you can add more complex modal content */}
            </CustomModal>
        }
       
     </>
    );
}
