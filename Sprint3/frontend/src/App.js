import React, { useState, useEffect } from "react";
import "./index.css";

import Header from "./components/Header/header";
import Sidebar from "./components/Sidebar/Sidebar";
import SidebarSection from "./components/Sidebar/SidebarSection";
import RegistrationForm from "./components/Form/RegistrationForm";
import CarCard from "./components/CarCard/CarCard";
import CarCardForm from "./components/CarCard/CarCardForm";
import CustomModal from "./components/CarCard/CustomModal";
import CurrentReservation from "./components/Reservation/CurrentReservation";
import PastReservation from "./components/Reservation/PastReservation";
import AccountManagementSection from "./components/AccountManagement/AccountManagementSection";
import GenericForm from "./components/Form/GenericForm";
import AddCar from "./components/admin/AddCar";
import LocationForm from "./components/location/LocationForm";
import FindUserFrom from "./components/CSinterface/FindUserProfile";
import UserProfile from "./components/CSinterface/UserProfile";
import FindUserProfile from "./components/CSinterface/FindUserProfile"
import PaymentForm from "./components/payment/Payment";

import toyotaCamryImage from "./components/CarCard/car-images/2024_toyota_camry_black.png";
import hondaAccordImage from "./components/CarCard/car-images/2024-Honda-Accord Hybrid.avif";
import hondaCivic from "./components/CarCard/car-images/MY24_Civic_Si_key-features_desktop_1036x520.avif";
import toyotaCamryWhite from "./components/CarCard/car-images/TOYOTA_CAMRY_WHITE.png";
import toyota_rav_4 from "./components/CarCard/car-images/toyota_rav_4.png";
import dodge_challenger from "./components/CarCard/car-images/2019-dodge-challenger-hellcat-white.png";


// hard coded values to display cars
const cars = [
  { carID: 1, make: 'Toyota', model: 'Camry', price: 50, year: '2020', color: 'black', transmissionType: 'automatic', numberOfPassenger: 4, imageUrl: toyotaCamryImage, branchLocation: "2311 Pl. Transcanadienne, Dorval, QC H9P 2X7" },
  { carID: 2, make: 'Honda', model: 'Civic', price: 45, year: '2020', color: 'black', transmissionType: 'automatic', numberOfPassenger: 4, imageUrl: hondaAccordImage, branchLocation: "690 Bd René-Lévesque E Estates, Québec City, Quebec G1R 5A8" },
  { carID: 3, make: 'Honda', model: 'Accord ', price: 65, year: '2020', color: 'black', transmissionType: 'manual', numberOfPassenger: 2, imageUrl: hondaAccordImage, branchLocation: "947 Dovercourt Rd, Toronto, ON M6H 2X6" },
  { carID: 4, make: 'Honda', model: 'Civic', price: 35, year: '2020', color: 'red', transmissionType: 'automatic', numberOfPassenger: 4, imageUrl: hondaCivic, branchLocation: "2311 Pl. Transcanadienne, Dorval, QC H9P 2X7" },
  { carID: 5, make: 'Toyota', model: 'Sonata', price: 50, year: '2020', color: 'black', transmissionType: 'manual', numberOfPassenger: 4, imageUrl: toyotaCamryImage, branchLocation: "2572 Bd Daniel-Johnson 2nd Floor, Laval, QC H7T 2R3" },
  { carID: 6, make: 'Toyota', model: 'Camry ', price: 70, year: '2020', color: 'black', transmissionType: 'automatic', numberOfPassenger: 2, imageUrl: toyotaCamryImage, branchLocation: "690 Bd René-Lévesque E Estates, Québec City, Quebec G1R 5A8" },
  { carID: 7, make: 'Toyota', model: 'Camry ', price: 70, year: '2020', color: 'white', transmissionType: 'automatic', numberOfPassenger: 4, imageUrl: toyotaCamryWhite, branchLocation: "9101 Bd Ray-Lawson, Anjou, QC H1J 1K6" },
  { carID: 8, make: 'Toyota', model: 'Camry ', price: 70, year: '2020', color: 'black', transmissionType: 'automatic', numberOfPassenger: 2, imageUrl: toyotaCamryImage, branchLocation: "690 Bd René-Lévesque E Estates, Québec City, Quebec G1R 5A8" },
  { carID: 9, make: 'Toyota', model: 'RAV4', price: 60, year: '2024', color: 'blue', transmissionType: 'automatic', numberOfPassenger: 6, imageUrl: toyota_rav_4, branchLocation: "9101 Bd Ray-Lawson, Anjou, QC H1J 1K6" },
  { carID: 10, make: 'Dodge', model: 'Challenger', price: 90, year: '2023', color: 'white', transmissionType: 'automatic', numberOfPassenger: 2, imageUrl: dodge_challenger, branchLocation: "1872 Merivale Rd d, Nepean, ON K2G 1E6" },
];

function App() {
  const [activeSection, setActiveSection] = useState("Homepage");

  const [selectedCar, setSelectedCar] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isFormRegistrationVisible, setIsRegistrationFormVisible] = useState(false);
  const [isFindUserProfile, setIsFindUserProfile] = useState(false);

  const [selectedAccountSection, setSelectedAccountSection] = useState(null);
  const [isAccountModalVisible, setIsAccountModalVisible] = useState(false);

  const [tempMakeFilter, setTempMakeFilter] = useState('');
  const [tempColorFilter, setTempColorFilter] = useState('');

  // Add final state variables for make and color to be used for filtering
  const [finalMakeFilter, setFinalMakeFilter] = useState('');
  const [finalColorFilter, setFinalColorFilter] = useState('');

  const [user_Id, setUserId] = useState(null);
  const [typeOfUser, setTypeOfUser] = useState("");
  const colorOptions = ['white', 'red', 'black'];

  const [userData, setUserData] = useState(null);

  const handleUserData2 = (data) => {
    setUserData(data);
    // Perform any additional actions with user data
  };

  // Temporal price filter state for user input
  const [tempPriceFilter, setTempPriceFilter] = useState({ min: '', max: '' });

  // Final price filter state to store the values when the user applies the filter
  const [finalPriceFilter, setFinalPriceFilter] = useState({ min: '', max: '' });


  const uniqueMakes = Array.from(new Set(cars.map(car => car.make)));


  // Update the price filter state
  const handleTempPriceFilterChange = (value, type) => {
    setTempPriceFilter({ ...tempPriceFilter, [type]: value });
  };

  const uniqueBranchLocations = Array.from(new Set(cars.map(car => car.branchLocation)));
  const [finalBranchLocationFilter, setFinalBranchLocationFilter] = useState('');

  const applyFilters = () => {
    setFinalPriceFilter(tempPriceFilter);
    setFinalMakeFilter(tempMakeFilter);
    setFinalColorFilter(tempColorFilter);
  };

  function handleActiveSidebar(title) {
    setActiveSection(title);
  }

  function handleCarClick(car) {
    setSelectedCar(car);
    setIsFormVisible(true); // this is to make the form visible
  }

  function handleSignIn_Register() {
    setIsRegistrationFormVisible(true);
  }

  function handleFindUserProfileBtn() {
    setIsFindUserProfile(true);
  }

  function handleAccountManagementClick(section) {
    setSelectedAccountSection(section);
    setIsAccountModalVisible(true);
  }

  const handleLogout = () => {
    setTypeOfUser("");
    setActiveSection("Homepage");
    setUserData(null)

  }
  const handleCloseModal = () => setIsFormVisible(false);

  const handleCloseRegistrationModal = () =>
    setIsRegistrationFormVisible(false);

  const handlecloseFindUserProfile = () =>
  setIsFindUserProfile(false);

  const handleCloseAccountModal = () => {
    setIsAccountModalVisible(false);
    setSelectedAccountSection(null); // Clear the selected section
  };



  const handleUserLogin = (type) => {
    setTypeOfUser(type);
  };




  //THIS IS TO HANDLE THE CRUD OPERATIONS. 
  const handleUpdateName = (newName) => {

    fetch('http://localhost:5000/NameChange', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ firstName: newName }),
    }).then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
      .then(data => {
        if (data.success) {
          alert('Your name has been successfully updated.');
        } else {
          alert('There was a problem updating your name.');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        alert('An error occurred while updating your name.');
      });

  };

  const handleUpdateEmail = (newEmail) => {

    fetch('http://localhost:5000/EmailChange', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ email: newEmail }),
    }).then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
      .then(data => {
        if (data.success) {
          alert('Your EMAIL has been successfully updated.');
        } else {
          alert('There was a problem updating your EMAIL.');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        alert('An error occurred while updating your Email.');
      });

  };

  const handleUpdatePasword = (newPassword) => {

    fetch('http://localhost:5000/PasswordChange', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ password: newPassword }),
    }).then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
      .then(data => {
        if (data.success) {
          alert('Your Password has been successfully updated.');
        } else {
          alert('There was a problem updating your Password.');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        alert('An error occurred while updating your Email.');
      });

  };
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  const renderAccountForm = () => {
    switch (selectedAccountSection) {
      case "Change Name":
        return (
          <GenericForm
            title="Change Name"
            message="Please enter your new name"
            placeholder="New Name"
            type="text"
            buttonName="Update Name"
            onSubmit={handleUpdateName}
          />
        );
      case "Change Email":
        return (
          <GenericForm
            title="Change Email"
            message="Please enter your new email address"
            placeholder="New Email"
            type="email"
            buttonName="Update Email"
            onSubmit={handleUpdateEmail}
          />
        );
      case "Change Password":
        return (
          <GenericForm
            title="Change Password"
            message="Please enter your new password"
            placeholder="New Password"
            type="password"
            buttonName="Update Password"
            onSubmit={handleUpdatePasword}
          />
        );
      case "Change Location":
        return (
          <PaymentForm />
        );
      default:
        return null; // In case no section is selected or an unknown section is provided
    }
  };

  const [dynamicCars, setDynamicCars] = useState([]);
  useEffect(() => {

    fetch('http://localhost:5000/getCars')
      .then(response => response.json())
      .then(data => {
        console.log('Fetched cars:', data);
        setDynamicCars(data); // Update state with the fetched data
      })
      .catch(error => {
        console.error('Error fetching cars:', error);
      });
  }, []); // The empty array ensures the effect runs only once on component mount




  const allCars = [...cars, ...dynamicCars]; // Combine static and dynamic car data

  // Filter cars based on price
  const filteredCars = allCars.filter(car => {
    const minPrice = finalPriceFilter.min !== '' ? parseFloat(finalPriceFilter.min) : -Infinity;
    const maxPrice = finalPriceFilter.max !== '' ? parseFloat(finalPriceFilter.max) : Infinity;
    const matchesMake = finalMakeFilter ? car.make === finalMakeFilter : true;
    const matchesColor = finalColorFilter ? car.color === finalColorFilter : true;
    const matchesLocation = finalBranchLocationFilter ? car.branchLocation === finalBranchLocationFilter : true;
    return car.price >= minPrice && car.price <= maxPrice && matchesMake && matchesColor && matchesLocation;
  });

  const [user, setUser] = useState(null);

  const handleUserData = (userData) => {
    setUser(userData);
    // Now the user state contains the userData, you can pass it down to other components or use it directly in this component
    console.log(user);
  };

  return (

    <div className="container">
      <div className="header">
        {
          typeOfUser === "" ? (
            <Header onClick={() => handleSignIn_Register()} />
          ) : userData === null ? (
            <div style={{ textAlign: 'right', fontWeight: 'bold', marginLeft: '90vw', marginTop: '2rem'  }}>
              You are logged in
            </div>
          ) : (
            <div  >
            <div style={{ textAlign: 'right', fontWeight: 'bold', marginLeft: '90vw', marginTop: '2rem'  }}>
              You are logged in
            </div>
            <div style={{ textAlign: 'left', fontWeight: 'bold', marginLeft: '17.5vw', marginTop: '-0.5rem' }}>
              Looking car for {userData.firstName}
            </div>
            </div>
          )
        }
      </div>
      <CustomModal
        isOpen={isFormRegistrationVisible}
        onClose={handleCloseRegistrationModal}
      >
        <RegistrationForm onUserLogin={handleUserLogin} type="user" />
      </CustomModal>

      <Sidebar>
        {typeOfUser === "admin" ? (
          // Render only Input Car and Logout for admin users
          <>
            <SidebarSection
              icon="directions_car_filled"
              title="add car"
              active={activeSection === "add car"}
              onClick={() => handleActiveSidebar("add car")}
            />
            <SidebarSection
              icon="person_add"
              title="Add Rep"
              active={activeSection === "Add Rep"}
              onClick={() => handleActiveSidebar("Add Rep")}
            />
            <SidebarSection
              icon="logout"
              title="Logout"
              active={activeSection === "logout"}
              onClick={handleLogout}
            />
          </>
        ) : (typeOfUser === "" || typeOfUser === 'user') ? (
          // Render full sidebar for non-admin users
          <>
            <SidebarSection
              icon="dashboard"
              title="Homepage"
              active={activeSection === "Homepage"}
              onClick={() => handleActiveSidebar("Homepage")}
            />
            <SidebarSection
              icon="search"
              title="Find car"
              active={activeSection === "FindCar"}
              onClick={() => handleActiveSidebar("FindCar")}
            />
            <SidebarSection
              icon="directions_car_filled"
              title="Reservation"
              active={activeSection === "reservation"}
              onClick={() => handleActiveSidebar("reservation")}
            />
            <SidebarSection
              icon="manage_accounts"
              title="Account Management"
              active={activeSection === "Account_Management"}
              onClick={() => handleActiveSidebar("Account_Management")}
            />
            <SidebarSection
              icon="logout"
              title="Logout"
              active={activeSection === "logout"}
              onClick={handleLogout}
            />
          </>
        ) :
          <>
            <SidebarSection
              icon="search"
              title="Find Car for Client"
              active={activeSection === "Find Car for Client"}
              onClick={() => handleActiveSidebar("Find Car for Client")}
            />
            <SidebarSection
              icon="arrow_back"
              title="Check In"
              active={activeSection === "Check In"}
              onClick={() => handleActiveSidebar("Check In")}
            />
            <SidebarSection
              icon="arrow_forward"
              title="Check Out"
              active={activeSection === "Check Out"}
              onClick={() => handleActiveSidebar("Check Out")}
            />
            <SidebarSection
              icon="logout"
              title="Logout"
              active={activeSection === "logout"}
              onClick={handleLogout}
            />
          </>
        }
      </Sidebar>

      <main>
        {activeSection === 'Homepage' && typeOfUser === "user" && <div>
          <LocationForm />
        </div>}

        {activeSection === 'Add Rep' && <div>
          <RegistrationForm type="CSrep" className="registrationForRep" />
        </div>}

        {activeSection === 'FindCar' && <div>
          {/* Price filter inputs */}
          <div className="filters">
            {/* Price filter inputs */}
            <input
              type="number"
              value={tempPriceFilter.min}
              placeholder="Min price"
              onChange={(e) => handleTempPriceFilterChange(e.target.value, 'min')}
            />
            <input
              type="number"
              value={tempPriceFilter.max}
              placeholder="Max price"
              onChange={(e) => handleTempPriceFilterChange(e.target.value, 'max')}
            />

            <select value={tempMakeFilter} onChange={(e) => setTempMakeFilter(e.target.value)}>
              <option value="">All Makes</option>
              {uniqueMakes.map(make => (
                <option key={make} value={make}>{make}</option>
              ))}
            </select>
            <select value={tempColorFilter} onChange={(e) => setTempColorFilter(e.target.value)}>
              <option value="">All Colors</option>
              {colorOptions.map(color => (
                <option key={color} value={color}>{color}</option>
              ))}
            </select>
            <select value={finalBranchLocationFilter} onChange={(e) => setFinalBranchLocationFilter(e.target.value)}>
              <option value="">All Locations</option>
              {uniqueBranchLocations.map(location => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>

            <button onClick={applyFilters}>Apply Filters</button>
          </div>


          <div className="car-gallery">
            {filteredCars.map(car => (
              <CarCard key={car.carID} car={car} onClick={() => handleCarClick(car)} />
            ))};
          </div>

          <CustomModal isOpen={isFormVisible} onClose={handleCloseModal}>
            <CarCardForm car={selectedCar} typeOfUser={typeOfUser} />
          </CustomModal>

        </div>}

        {activeSection === 'reservation' && <div className="Reservation-Container">

          <CurrentReservation placeHolderImage={hondaAccordImage} />
          <PastReservation />


        </div>}

        {activeSection === 'Account_Management' && <div className="Account_Management-Container">
          <div>
            <AccountManagementSection ManagementSection={"Change FirstName"} onClick={() => handleAccountManagementClick("Change Name")} />
            <AccountManagementSection ManagementSection={"Change Email"} onClick={() => handleAccountManagementClick("Change Email")} />
            <AccountManagementSection ManagementSection={"Change Password"} onClick={() => handleAccountManagementClick("Change Password")} />
            <AccountManagementSection ManagementSection={"Add or Change credit Information"} onClick={() => handleAccountManagementClick("Change Location")} />

          </div>


        </div>}


        {activeSection === 'add car' && <div className="Account_Management-Container">

          <AddCar />


        </div>}

        {activeSection === 'Check In' && <div className="RepContainer">
          
          <FindUserFrom onUserData={handleUserData} />
          <UserProfile userData={user} />


        </div>}

        {activeSection === 'Check Out' && <div className="RepContainer">
         
          <FindUserFrom onUserData={handleUserData} />
          <UserProfile userData={user} checkOutValue = {true}/>


        </div>}

        {activeSection === 'Find Car for Client' && <div>
          <CustomModal
            isOpen={isFormRegistrationVisible}
            onClose={handleCloseRegistrationModal}
          >
            <RegistrationForm onUserLogin={handleUserLogin} type="user" repForRegisteringClient={true} />
          </CustomModal>

          <CustomModal
            isOpen={isFindUserProfile}
            onClose={handlecloseFindUserProfile}
          >
           <FindUserProfile onUserData={handleUserData2} type = "findUserFromCar"/>

          </CustomModal>

          <div className="filters repFilter">
            <div className="buttonFilterCSrep">
              <button type="button" className="register-button" onClick={handleSignIn_Register}>New Client</button>
              <button type="button" className="register-button" onClick={handleFindUserProfileBtn}>Existing Client</button>
            </div>
            {/* Price filter inputs */}
            <input
              type="number"
              value={tempPriceFilter.min}
              placeholder="Min price"
              onChange={(e) => handleTempPriceFilterChange(e.target.value, 'min')}
            />
            <input
              type="number"
              value={tempPriceFilter.max}
              placeholder="Max price"
              onChange={(e) => handleTempPriceFilterChange(e.target.value, 'max')}
            />

            <select value={tempMakeFilter} onChange={(e) => setTempMakeFilter(e.target.value)}>
              <option value="">All Makes</option>
              {uniqueMakes.map(make => (
                <option key={make} value={make}>{make}</option>
              ))}
            </select>
            <select value={tempColorFilter} onChange={(e) => setTempColorFilter(e.target.value)}>
              <option value="">All Colors</option>
              {colorOptions.map(color => (
                <option key={color} value={color}>{color}</option>
              ))}
            </select>
            <select value={finalBranchLocationFilter} onChange={(e) => setFinalBranchLocationFilter(e.target.value)}>
              <option value="">All Locations</option>
              {uniqueBranchLocations.map(location => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>

            <button onClick={applyFilters}>Apply Filters</button>

          </div>


          <div className="car-gallery">
            {filteredCars.map(car => (
              <CarCard key={car.carID} car={car} onClick={() => handleCarClick(car)} />
            ))};
          </div>

          <CustomModal isOpen={isFormVisible} onClose={handleCloseModal}>
            <CarCardForm car={selectedCar} typeOfUser={typeOfUser} userData={userData}/>
          </CustomModal>

        </div>}

      </main>
      {/* The way the account management section works is by having a switch statements that will choose what acount form
        to render based on the selectedAccountSection which is chosen by onlcick prop with handleAccountManagementClick passed 
        to it, thus when is isAccountModalVisible become true it will render the corresponding form*/}
      <CustomModal
        isOpen={isAccountModalVisible}
        onClose={handleCloseAccountModal}
      >
        {renderAccountForm()}
      </CustomModal>
    </div>

  );
}

export default App;