import React, { useState } from 'react';
import "./addcar.css";


export default function AddCar() {
  const [carDetails, setCarDetails] = useState({
    make: '',
    model: '',
    price: '',
    year: '',
    color: '',
    transmissionType: '',
    numberOfPassenger: '',
    branchLocation: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCarDetails({ ...carDetails, [name]: value });
  };

  const handleImageChange = (e) => {
    if (e.target.files.length) {
      setCarDetails({ ...carDetails, imageUrl: e.target.files[0] }); // Store file data instead of URL
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.keys(carDetails).forEach(key => {
      formData.append(key, carDetails[key]);
    });

    try {
      const response = await fetch('http://localhost:5000/addCar', { // Replace with your backend endpoint
        method: 'POST',
        body: formData, 
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        alert('Car details submitted successfully!');
        // Clear form, handle success, etc.
      } else {
        throw new Error('Failed to submit car details');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error submitting form');
    }
  };


  return (
    <form className = "CarInputForm" onSubmit={handleSubmit}>
      <input type="text" name="make" placeholder="Make" value={carDetails.make} onChange={handleChange} required />
      <input type="text" name="model" placeholder="Model" value={carDetails.model} onChange={handleChange} required />
      <input type="number" name="price" placeholder="Price" value={carDetails.price} onChange={handleChange} required />
      <input type="text" name="year" placeholder="Year" value={carDetails.year} onChange={handleChange} required />
      <input type="text" name="color" placeholder="Color" value={carDetails.color} onChange={handleChange} required />
      <select name="transmissionType" value={carDetails.transmissionType} onChange={handleChange} required>
        <option value="">Select Transmission Type</option>
        <option value="automatic">Automatic</option>
        <option value="manual">Manual</option>
      </select>
      <input type="number" name="numberOfPassenger" placeholder="Number Of Passengers" value={carDetails.numberOfPassenger} onChange={handleChange} required />
      <select name="branchLocation" value={carDetails.branchLocation} onChange={handleChange} required>
        <option value="">Select Branch Location</option>
        <option value="2311 Pl. Transcanadienne, Dorval, QC H9P 2X7">2311 Pl. Transcanadienne, Dorval, QC H9P 2X7</option>
        <option value="690 Bd René-Lévesque E Estates, Québec City, Quebec G1R 5A8">690 Bd René-Lévesque E Estates, Québec City, Quebec G1R 5A8</option>
        <option value="9101 Bd Ray-Lawson, Anjou, QC H1J 1K6">9101 Bd Ray-Lawson, Anjou, QC H1J 1K6</option>
        <option value="1872 Merivale Rd d, Nepean, ON K2G 1E6">1872 Merivale Rd d, Nepean, ON K2G 1E6</option>
        <option value="947 Dovercourt Rd, Toronto, ON M6H 2X6">947 Dovercourt Rd, Toronto, ON M6H 2X6</option>
        <option value="449 Gladstone Ave, Ottawa, ON K1R 5N7">449 Gladstone Ave, Ottawa, ON K1R 5N7</option>
        <option value="1579 Cyrville Rd, Gloucester, ON K1B 3L7">1579 Cyrville Rd, Gloucester, ON K1B 3L7</option>
        <option value="2572 Bd Daniel-Johnson 2nd Floor, Laval, QC H7T 2R3">2572 Bd Daniel-Johnson 2nd Floor, Laval, QC H7T 2R3</option>
      </select>
      <input type="file" name="imageUrl" accept="imageUrl/*" onChange={handleImageChange} required />
      {carDetails.imageUrl && <img src={carDetails.imageUrl} alt="Car" style={{ width: '100px', height: 'auto' }} />}
      <button className = "submit-button" type="submit">Submit Car</button>
    </form>
  );
}


