import React from "react";
import "./carCard.css"; 

const CAR_DOOR_ICON =  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M19 14h-3v2h3zm3 7H3V11l8-8h10a1 1 0 0 1 1 1zM11.83 5l-6 6H20V5z"></path></svg>;
const GROUP_OF_PEOPLE_ICON =  <span className="material-icons-sharp"> groups </span>; 
const TWO_PEOPLE_ICON = <span className="material-icons-sharp"> people </span>;
const CASES_ICON = <span className="material-icons-sharp"> cases </span>;



export default function CarCard({car, onClick}){

    const NUMBER_OF_PASSENGERS = car.numberOfPassenger; 

    return (
        <div className="car-card" onClick={onClick}>
         <img src={car.imageUrl} alt={car.make} className="car-image"/>
          <div className="car-info">
           <h3 className="car-name">{car.make} {car.model}</h3>
          

            <div className="icon-info">

               <div className="car-number-of-doors">
                   <span className="number-of-doors">{NUMBER_OF_PASSENGERS}</span>
                   {CAR_DOOR_ICON}
              </div>

                <div className="car-capacity">
                    <span className="capacity-number">{NUMBER_OF_PASSENGERS}</span>
                    {NUMBER_OF_PASSENGERS > 2 ? GROUP_OF_PEOPLE_ICON : TWO_PEOPLE_ICON}
                </div>

                <div className="car-luggage-room">
                    <span className="luggage-room-number">{NUMBER_OF_PASSENGERS}</span>
                    {CASES_ICON}
                </div>

                
            </div>

            <div className="price-button-container">
                <p className="car-price">${car.price} / day</p>
                <button className="car-card-button">Book Deal</button>
            </div>

          </div>
        </div>
    );
}