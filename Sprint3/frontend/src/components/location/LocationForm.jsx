import React, { useState, useRef, useEffect } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import "./location.css";

export default function LocationForm() {
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [province, setProvince] = useState('');
  const mapRef = useRef(null);
  const googleMapRef = useRef(null);

  // Load the Google Maps script and initialize the map with markers
  useEffect(() => {
    const loader = new Loader({
      apiKey: "AIzaSyDpBb0YTNf0vAig51bOVBFeanl_xn5I2iA", // Replace with your actual API key
      version: "weekly",
    });

    loader.load().then(() => {
      const google = window.google;
      const montrealCenter = { lat: 45.5017, lng: -73.5673 };
      const map = new google.maps.Map(mapRef.current, {
        center: montrealCenter,
        zoom: 8,
      });
      googleMapRef.current = map;

      const branches = [
        {
          branchNumber: 1,
          mainBranch: true,
          branchAddress: "2311 Pl. Transcanadienne, Dorval, QC H9P 2X7",
          branchCoordinates: "45.478783720683225, -73.79033616625186",
        },
        {
          branchNumber: 2,
          mainBranch: false,
          branchAddress: "690 Bd René-Lévesque E Estates, Québec City, Quebec G1R 5A8",
          branchCoordinates: "46.81024553919734, -71.21810893650535",
        },
        {
          branchNumber: 3,
          mainBranch: false,
          branchAddress: "9101 Bd Ray-Lawson, Anjou, QC H1J 1K6",
          branchCoordinates: "45.62124971018465, -73.5641308862887",
        },
        {
          branchNumber: 4,
          mainBranch: false,
          branchAddress: "1872 Merivale Rd d, Nepean, ON K2G 1E6",
          branchCoordinates: "45.33362455499242, -75.72451283057421",
        },
        {
          branchNumber: 5,
          mainBranch: false,
          branchAddress: "947 Dovercourt Rd, Toronto, ON M6H 2X6",
          branchCoordinates: "43.6722329937224, -79.43145411594199",
        },
        {
          branchNumber: 6,
          mainBranch: false,
          branchAddress: "449 Gladstone Ave, Ottawa, ON K1R 5N7",
          branchCoordinates: "45.412662508713424, -75.69617547183954",
        },
        {
          branchNumber: 7,
          mainBranch: false,
          branchAddress: "1579 Cyrville Rd, Gloucester, ON K1B 3L7",
          branchCoordinates: "45.42333248784953, -75.61107385157035",
        },
        {
          branchNumber: 8,
          mainBranch: false,
          branchAddress: "2572 Bd Daniel-Johnson 2nd Floor, Laval, QC H7T 2R3",
          branchCoordinates: "45.57084628139844, -73.75691005994688",
        },
      ];


      branches.forEach(branch => {
        const [lat, lng] = branch.branchCoordinates.split(', ').map(Number);
        const marker = new google.maps.Marker({
          position: { lat, lng },
          map: map,
          title: branch.branchAddress,
        });

        // Define InfoWindow content
        const infoWindowContent = `
        <div class="info-window-content">
          <h3>${branch.branchAddress}</h3>
          <button class="register-button" onclick="window.selectBranch(${branch.branchNumber}, \`${branch.branchAddress.replace(/'/g, "\\'")}\`)">Mark as my Branch</button>
        </div>
      `;
        // Create an InfoWindow for each marker
        const infoWindow = new google.maps.InfoWindow({
          content: infoWindowContent
        });

        // Attach a click event listener to the marker to open the InfoWindow
        marker.addListener('click', () => {
          infoWindow.open(map, marker);
        });
      });
    });
  }, []);

  
  // to handle branch selection from the InfoWindow button
  window.selectBranch = async (branchNumber, branchAddress) => {
    try {
     
      const branch = {
        branchNumber: branchNumber,
        branchAddress: branchAddress
      };
  
      
      const response = await fetch('http://localhost:5000/selectBranch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(branch),
        credentials: 'include'
      });
  
      
  
      const responseData = await response.json();
      console.log("Branch selection response:", responseData);
      alert(`Branch ${branchNumber} has been set as your branch.`);
    } catch (error) {
      console.error('There has been a problem with your fetch operation:', error);
    }
  };
  

  const handleSubmit = async (event) => {
    event.preventDefault();

    const userAddress = `${address}, ${city}, ${province}`;
    const addressData = { userAddress };

    try {
      const response = await fetch('http://localhost:5000/findNearestBranch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(addressData),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const responseData = await response.json();
      console.log("Received data:", responseData);

      if (responseData.success && responseData.data && responseData.data.branchCoordinates) {
        const [latitude, longitude] = responseData.data.branchCoordinates.split(', ').map(Number);
        const branchLocation = { lat: latitude, lng: longitude };

        // Re-center the map to the branch location and zoom in
        googleMapRef.current.setCenter(branchLocation);
        googleMapRef.current.setZoom(12);

        alert(responseData.message + " the nearest branch is " + responseData.data.branchAddress);
      } else {
        console.error('Error or missing data in response');
      }
    } catch (error) {
      console.error('There has been a problem with your fetch operation:', error);
    }
  };

  return (
    <div className='locationFormContainer'>
      <div className='formContainer'>
      <h1 className='formTitle'>Find Your Branch</h1>
      <form onSubmit={handleSubmit}>
      <input
          required
          placeholder="address"
          type="text"
          className="input"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <input
          required
          placeholder="city"
          type="text"
          className="input"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <input
          required
          placeholder="province"
          type="text"
          className="input"
          value={province}
          onChange={(e) => setProvince(e.target.value)}
        />
        <button type="submit" className="register-button">Find Location</button>
      </form>
      </div>
      <div ref={mapRef} style={{ height: '400px', width: '100%' }}></div> {/* Map container */}
    </div>
  );
}
