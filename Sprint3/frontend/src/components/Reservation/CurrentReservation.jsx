import "./Reservation.css"
import CustomModal from "../CarCard/CustomModal"
import GenericForm from "../Form/GenericForm"
import React, { useState, useEffect } from 'react';
import Loader from "../Loader/Loader";

export default function CurrentReservation({placeHolderImage}){


    const [isChangeDate, setChangeDate] = useState(false); 
    const [reservationData, setReservationData] = useState(null);


    function handleChangeDateEvent(value){
        setChangeDate(value);
    }

    const  handleChangeDateEventClose = () => {
        setChangeDate(false)
    }


    useEffect(() => {
        fetch('http://localhost:5000/currentReservation', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', // If you're using sessions or cookies for authentication, include this line
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log("I am here........")
            console.log("......................", data.data[0].car.carID);
            setReservationData(data.data[0]);
        })
        .catch(error => {
            console.error('Error fetching current reservation:', error);
        });
    }, []);
    


    // the reservation cancellation is here: 
    const handleCancelReservation = () => {
        // once we have the reservation id data from the reservationData we can lunch this feature. 
       
        console.log("reservation ID " , reservationData.ReservationID);
        fetch(`http://localhost:5000/deleteReservation/${reservationData.ReservationID}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if(data.success){
                alert("your reservation has been cancelled!");
            }
            console.log('Reservation cancelled:', data);
            
            setReservationData(null); // will update the logic here once the backend portion is done. 
        })
        .catch(error => {
            console.error('Error cancelling reservation:', error);
        });
    };


    const handleChangeDate = (newDate) => {
        // Assuming you have reservationId available in your reservationData
       
    
        fetch(`http://localhost:5000/changeReservationDate/${reservationData.ReservationID}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ startDate: newDate }), // Adjust this line if your backend expects different data
            credentials: 'include', // If you're using sessions or cookies for authentication
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            alert(`Your date has been changed to ${newDate}`);
            setReservationData({ ...reservationData, startDate: newDate }); // Update local state with new date
            handleChangeDateEventClose(); // Close the modal
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('An error occurred while updating your reservation date.');
        });
    };

 

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' }; 
        return new Date(dateString).toLocaleDateString(undefined, options); 
    };
    

const ChangeDateForm = <GenericForm 
    title="Change Date" 
    message="Please enter the new pick-up date" 
    placeholder="New Date" 
    type="date" 
    buttonName="Update Date" 
    onSubmit={handleChangeDate} // Pass the function as a prop
 />
 
 let base64String = ""; // Declare base64String in an outer scope

 if (reservationData !== null && reservationData.car && reservationData.car.imageUrl && reservationData.car.imageUrl.data) { 
     base64String = btoa(String.fromCharCode(...new Uint8Array(reservationData.car.imageUrl.data))); 
 }
 
 let imageUrl = `data:image/jpeg;base64,${base64String}`;

    return(
        <div className="CurrentReservationContainer">
            <p className="CurrentReservation-title">Current Reservation</p>
            
            <div className="currentReservation">

                <div className="ResercationText-Container">
                    {reservationData  ?
                        <>
                         <p className="Reservation-Date">
                             Your upcoming reservation is from {formatDate(reservationData.startDate)} to {formatDate(reservationData.endDate)}</p>
                         <p className="res_info">
                             For the {reservationData.car.make} {reservationData.car.model} in {reservationData.car.color} color
                             with {reservationData.car.transmissionType} transmission.
                         </p>

                        <p className="Reservation-Reminder">Please remember to bring your driver Liscence and ID</p>
        
                        <div style={{ padding: '16px' }}>
                            <button className="changeReservationDate" onClick={() => handleChangeDateEvent(true)}>Change Date</button>
                            <button className="cancelReservation" onClick={handleCancelReservation}>Cancel Reservation</button>{/*onClick={handleCancelReservation}*/}
                        </div>
                        </>
                    :
                    <div className="loaderContainer">
                        <p>Loading reservation details</p>
                        <Loader className = "reservationLoader"/>
                    </div>
                    }
                

                </div>

             <div className="currentreservedcarcontainer">
                {reservationData && reservationData.car.imageUrl ? (
                    <img src={imageUrl} alt="Your reserved car" className="currentReservedCar" />
                ) : (
                    <img src={placeHolderImage} alt="Default car" className="currentReservedCar" />
                )}
            </div>
                
               
            </div>
            <CustomModal isOpen={isChangeDate} onClose={handleChangeDateEventClose}>
                {ChangeDateForm}
            </CustomModal>
           
        </div>
    )
}