const express = require("express");
const { request } = require("http");
const mysql = require("mysql");
const session = require("express-session");
const cors = require("cors");
const path = require("path");
const multer = require("multer");
const { findNearestBranch } = require("./googleAPI.cjs");

// Set up  to handle file uploads in memory
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const app = express();
app.use(express.json());

app.use(express.urlencoded({ extended: false }));
const PORT = 5000;
// CORS HANDLER
const corsOptions = {
  origin: "http://localhost:3000", // or true if you want to copy the origin of the request
  credentials: true, // allow session cookie from browser to pass through
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
//Session Handler
app.use(
  session({
    secret: "example",
    cookie: { maxAge: 300000 },
    saveUninitialized: true, // needed because we have a login system
    resave: false,
  })
);

const db = mysql.createConnection({
  host: "soen341db.cjse668aqyoq.us-east-2.rds.amazonaws.com",
  user: "admin",
  password: "admin123",
  database: "soen341db",
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    process.exit(1); // Exit the process with an error code
  } else {
    console.log("Connected to the database.");
    // Perform a simple query to check the database connection
    db.query("SELECT 1 + 1 AS solution", (error, results, fields) => {
      if (error) {
        console.error("Failed to execute test query:", error);
        return;
      }
      console.log(
        "Test query executed successfully, solution:",
        results[0].solution
      );
    });
  }
});

/////////////////////////////////////////////////////////////SIGN UP ///////////////////////////////////////////////////////
app.post("/register", (request, response) => {
  console.log("received the sign-up");
  let newUser = {
    firstName: request.body.firstName,
    lastName: request.body.lastName,
    email: request.body.email,
    password: request.body.password,
  };

  let sql2 = "SELECT EXISTS(SELECT 1 FROM users WHERE email = ?) AS 'exists';";
  db.query(sql2, newUser.email, (err, result) => {
    if (err) {
      console.log("There was an error querying the database");
      response.status(500).json({
        message: "Database query error",
      });
    } else if (result[0].exists) {
      console.log("User with this email already exists");
      response.status(409).json({
        message: "An account with this email already exists." + newUser.email,
        duplicate: true,
      });
    } else {
      // Email does not exist, proceed with insertion
      let sql1 = "INSERT INTO users SET ?";
      db.query(sql1, newUser, (err) => {
        if (err) {
          console.log(
            "There was an error inserting the new user into the database"
          );
          response.status(500).json({
            message: "Error inserting the new user into the database",
          });
        } else {
          response
            .status(201)
            .json({ message: "Good, you are signed up.", duplicate: false });
        }
      });
    }
  });
});

///////////////////////////////////////////////////////////// LOG IN ///////////////////////////////////////////////////////

app.post("/logIn", (request, response) => {
  //123@gmail.com

  let email = request.body.email;
  let password = request.body.password;

  let sql = `SELECT userID, email, password, access_level  FROM users WHERE email = ? AND password = ? `;

  let query = db.query(sql, [email, password], (err, result) => {
    if (err) {
      console.log("There was an error communicating with the database");
    } else {
      if (result.length > 0 && result[0].access_level === "user") {
        console.log("you logged in");
        let userID = result[0].userID;
        request.session.userID = userID;
        request.session.email = email; // here we are setting uo the email for the current session to later on be used in the program,
        request.session.password = password;
        console.log(userID);
        response.status(200).json({ success: true, type: "user" });
      } else if (result.length > 0 && result[0].access_level === "admin") {
        response.json({ success: true, type: "admin" });
      } else if (result.length > 0 && result[0].access_level === "CSrep") {
        response.json({ success: true, type: "CSrep" });
      } else {
        response.json({ success: false, message: "Invalid email or password" });
      }
    }
  });
});
////////////////////////////////////////////CRUD OPERATIONS//////////////////////////////////////////////////

////////////////////////////////////////////CHANGE FIRST NAME//////////////////////////////////////////////////
app.post("/NameChange", (request, response) => {
  let userID = request.session.userID;

  let firstName = request.body.firstName;
  console.log("UserID:", userID);
  let sql = "UPDATE users SET firstName = ? WHERE userID = ?";

  let query = db.query(sql, [firstName, userID], (err, results) => {
    if (err) {
      console.error("Error updating user info:", err);
      response.json({ success: false });
      console.log("Update results:", results);
    } else {
      response.json({ success: true });
      console.log("Update results:", results);
    }
  });
});

//////////////////////////////////////////// CHANGE EMAIL //////////////////////////////////////////////////

app.post("/EmailChange", (request, response) => {
  let userID = request.session.userID;

  let email = request.body.email;

  console.log("UserID:", userID);

  let sql = "UPDATE users SET email = ? WHERE userID = ?";

  let query = db.query(sql, [email, userID], (err, results) => {
    if (err) {
      console.error("Error updating user info:", err);
      response.json({ success: false });
      console.log("Update results:", results);
    } else {
      response.json({ success: true });
      console.log("Update results:", results);
    }
  });
});

//////////////////////////////////////////// CHANGE PASSWORD //////////////////////////////////////////////////

app.post("/PasswordChange", (request, response) => {
  let userID = request.session.userID;

  let password = request.body.password;

  console.log("UserID:", userID);

  let sql = "UPDATE users SET password = ? WHERE userID = ?";

  let query = db.query(sql, [password, userID], (err, results) => {
    if (err) {
      console.error("Error updating user info:", err);
      response.json({ success: false });
      console.log("Update results:", results);
    } else {
      response.json({ success: true });
      console.log("Update results:", results);
    }
  });
});

//////////////////////////////////////////// START RESERVATION //////////////////////////////////////////////////
app.post("/startReservation", (request, response) => {
  console.log("Received startReservation request");
  
  // Use userID from request body if provided and not null, otherwise use session userID
  const userID = request.body.userID != null ? request.body.userID : request.session.userID;

  let newReservation = {
    carID: request.body.carID,
    userID: userID, // Assign the determined userID here
    startDate: request.body.startDate,
    endDate: request.body.endDate,
    totalPrice: request.body.totalPrice,
  };

  console.log("New reservation details", newReservation);
  let sql = "INSERT INTO reservations SET ?";

  db.query(sql, newReservation, (err) => {
    if (err) {
      console.error("Error inserting the new reservation into the database", err);
      response.status(500).json({
        message: "Error inserting the new reservation into the database",
      });
    } else {
      response.status(201).json({ message: "Reservation successfully created" });
    }
  });
});

////////////////////////////////////////////GET RESERVATION DETAILS//////////////////////////////////////////////////

app.get("/currentReservation", (request, response) => {
  let userID = request.session.userID;
  console.log(userID);
  let sql1 = "SELECT * FROM reservations WHERE userID = ? AND completed = false";
  let sql2 =
    "SELECT * FROM car WHERE carID IN (SELECT carID FROM reservations WHERE userID = ?)";
  db.query(sql1, userID, (err, reservationsResult) => {
    if (err) {
      console.log("Error with reservation query", err.message);
      return response.json({
        success: false,
        message: "Error fetching reservations",
      });
    }

    db.query(sql2, userID, (err, carsResult) => {
      if (err) {
        console.log("Error with car query", err.message);
        return response.json({
          success: false,
          message: "Error fetching cars",
        });
      }

      let combinedData = reservationsResult.map((reservation) => {
        let carData = carsResult.find((car) => car.carID === reservation.carID);
        return { ...reservation, car: carData };
      });

      response.json({ success: true, data: combinedData });
    });
  });
});

//////////////////////////////////////////// CHANGE RESERVATION DETAILS //////////////////////////////////////////////////

app.post("/changeReservationDate/:reservationID", (request, response) => {
  let reservationID = request.params.reservationID;

  let startDate = request.body.startDate;

  console.log("UserID:", reservationID);

  let sql = "UPDATE reservations SET startDate = ? WHERE reservationID = ?";

  let query = db.query(sql, [startDate, reservationID], (err, results) => {
    if (err) {
      console.error("Error updating user info:", err);
      response.json({ success: false });
      console.log("Update results:", results);
    } else {
      response.json({ success: true });
      console.log("Update results:", results);
    }
  });
});

app.post("/addCar", upload.single("imageUrl"), (request, response) => {
  let { make, model, price, year, color, transmissionType, branchLocation } = request.body;
  let numberOfPassenger = 2;
  // Use the buffer from the uploaded file directly
  let imageBuffer = request.file ? request.file.buffer : null;

  console.log("Received car details:", request.body);

  let sql =
    "INSERT INTO car (make, model, price, year, color, transmissionType, numberOfPassenger, imageUrl, branchLocation) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

  db.query(
    sql,
    [
      make,
      model,
      price,
      year,
      color,
      transmissionType,
      numberOfPassenger,
      imageBuffer,
      branchLocation
    ],
    (err, results) => {
      if (err) {
        console.error("Error inserting car data:", err);
        response.json({ success: false });
      } else {
        console.log("Insert results:", results);
        response.json({ success: true });
      }
    }
  );
});

app.get("/getCars", (req, res) => {
  const sql = "SELECT * FROM car";
  console.log("reached car");
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching cars:", err);
      res.status(500).json({ success: false, message: "Error fetching cars" });
    } else {
      // Converting BLOB data to a Base64 string for each car
      const carsWithImages = results.map((car) => {
        if (car.imageUrl && Buffer.isBuffer(car.imageUrl)) {
          const base64Image = Buffer.from(car.imageUrl).toString("base64");
          car.imageUrl = `data:image/jpeg;base64,${base64Image}`;
        }
        return car;
      });
      console.log("Fetched cars:", carsWithImages);
      res.json(carsWithImages); // Send the result with Base64 encoded images back to the client
    }
  });
});

app.delete("/deleteReservation/:reservationID", (request, response) => {
  let reservationID = request.params.reservationID;
  console.log("resID:", reservationID);

  let sql = "DELETE FROM reservations WHERE reservationID = ?";
  let query = db.query(sql, [reservationID], (err, results) => {
    if (err) {
      console.error("Error deleting reservation:", err);
      response.json({ success: false });
    } else {
      response.json({ success: true, affectedRows: results.affectedRows });
      console.log("Deleted:", results);
    }
  });
});



////////////////////////////////////////////////////////////// GOOGLE API //////////////////////////////////////////////////////////////

/////////////////////////////////////////// FINDING NEAREST BRANCH ///////////////////////////////////////////

app.post("/findNearestBranch", async (request, response) => {
  let userAddress = request.body.userAddress;
  console.log("User address :", userAddress);
  try {
    let nearestBranch = await findNearestBranch(userAddress);
    console.log("Google maps query successful");
    console.log(nearestBranch);
    return response.json({
      success: true,
      data: nearestBranch,
      message: "Successfully found the nearest branch",
    });
  } catch (err) {
    console.error("Error finding nearest branch:", err.message);
    return response.json({ success: false, message: "Invalid address" });
  }
});
////////////////////////////////////////////////////////////// CHECK-IN/CHECK-OUT //////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////// CHECK-IN (original) ///////////////////////////////////////////////////////

app.post("/check-in", async (request, response) => {
  let reservationID = request.body.reservationID;
  let access_level = request.session.userID;
  if (access_level && access_level != "CSrep") {
    console.log("can't check-in unless they're a csrep");
    response.json({
      message: "Only CS reps can check the customer in",
      success: false,
    });
  }
  const findReservationQuery =
    "SELECT * FROM reservations WHERE reservationID = ?";
  const activateResrvationQuery =
    "UPDATE reservations SET isActive = ? WHERE reservationID = ?";
  db.query(findReservationQuery, [reservationID], (err, result) => {
    if (err) {
      console.log("Error querying the database");
      return response.json({
        message: "error querying the db",
        success: false,
      });
    }
    if (result.length > 0) {
      // check if reservation exists
      if (result[0].isActive == true) {
        // check if reservation already active
        console.log("Reservation Already active");
        return response.json({
          alreadyActive: true,
          message: "Can't check-in because reservation already active",
        });
      } else {
        db.query(activateResrvationQuery, [true, reservationID]);
        console.log("Reservation's been activated");
        return response.json({
          success: true,
          message: "Successfully checked-in customer",
        });
      }
    } else {
      console.log("Reservation doesn't exist");
      return response.json({
        message: "Reservation doesn't exist",
        success: false,
      });
    }
  });
});

app.post("/check-out", async (request, response) => {
  let reservationID = request.body.reservationID;
  let access_level = request.session.access_level;
  if (access_level && access_level != "CSrep") {
    console.log("can't check-out unless they're a csrep");
    response.json({
      message: "Only CS reps can check the customer out",
      success: false,
    });
  }
});

/////////////////////////////////////////getting user data from email//////////////////////////////////////////

app.post("/getUserByEmail", (req, res) => {
  const userEmail = req.body.email;

  if (!userEmail) {
    return res.status(400).json({ message: "Email is required" });
  }

  const query = "SELECT * FROM users WHERE email = ?";

  db.query(query, [userEmail], (err, results) => {
    if (err) {
      console.error("Error fetching user from the database:", err);
      return res.status(500).json({ message: "Error fetching user data" });
    }

    if (results.length > 0) {
      const user = results[0];
      return res.json({
        message: "User data fetched successfully",
        data: user,
        success: true,
      });
    } else {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }
  });
});

///////////////////////////////////////// CHECK-IN //////////////////////////////////////////

app.post("/checkInactiveReservationsWithCar", (req, res) => {
  const userID = req.body.userID;
  console.log(userID);
  if (!userID) {
    return res.status(400).json({ message: "UserID is required" });
  }

  // First, find inactive reservations for the given userID
  const reservationQuery =
    "SELECT * FROM reservations WHERE userID = ? AND isActive = false LIMIT 1";

  db.query(reservationQuery, [userID], (err, reservationResults) => {
    if (err) {
      console.error("Error fetching reservations from the database:", err);
      return res
        .status(500)
        .json({ message: "Error fetching reservations data" });
    }

    if (reservationResults.length > 0) {
      // An inactive reservation is found, now find the car details for the carID from the reservation
      const carID = reservationResults[0].carID;
      const carQuery = "SELECT * FROM car WHERE carID = ?";

      db.query(carQuery, [carID], (carErr, carResults) => {
        console.log("reached here");
        if (carErr) {
          console.error("Error fetching car from the database:", carErr);
          return res.status(500).json({ message: "Error fetching car data" });
        }

        if (carResults.length > 0) {
          // Car found, send back the details

          return res.json({
            message: "Car details found for inactive reservation",
            car: carResults[0],
            reservation: reservationResults[0],
            success: true,
          });
        } else {
          // Car not found
          return res
            .status(404)
            .json({ message: "Car not found for the reservation" });
        }
      });
    } else {
      // No inactive reservations found
      return res
        .status(404)
        .json({ message: "No inactive reservations found", success: false });
    }
  });
});

app.post("/setActivateReservation", (req, res) => {
  const { reservationID } = req.body;

  if (!reservationID) {
    return res
      .status(400)
      .json({ message: "Reservation ID is required", success: false });
  }
  
  const sql = "UPDATE reservations SET isActive = true, isSigned = true WHERE reservationID = ?";

  db.query(sql, [reservationID], (err, result) => {
    if (err) {
      console.error("Error updating reservation isActive status:", err);
      return res
        .status(500)
        .json({ message: "Error updating reservation", success: false });
    }

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "Reservation not found", success: false });
    }

    res.json({ message: "Reservation is now active", success: true });
  });
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.post("/selectBranch", (req, res) => {
  const userID = req.session.userID;
  const { branchAddress } = req.body;

  
  const sql = "UPDATE users SET  branch = ? WHERE userID = ?";

  db.query(sql, [branchAddress, userID], (error, results) => {
    if (error) {
      console.error("Error updating the user branch:", error);
      return res
        .status(500)
        .json({ message: "Error updating the user branch" });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log(`User ${userID} branch updated `);
    res.json({ message: `Your branch has been set` });
  });
});

///////////////////////////////////credit///////////////////////////////////////
app.post('/saveCreditInfo', (req, res) => {
  const userID = req.session.userID; 
  const { cardNumber, cardName, expiryDate, cvv } = req.body;
  console.log("useerrrr" + userID)
  // First, check if the userID exists in the creditInfo table
  const sqlCheckUser = 'SELECT userID FROM creditInfo WHERE userID = ?';

  db.query(sqlCheckUser, [userID], (checkError, checkResults) => {
    if (checkError) {
      console.error('Error checking for userID in creditInfo table:', checkError);
      return res.status(500).json({ message: 'Error checking credit card information' });
    }

    if (checkResults.length === 0) {
      // UserID does not exist, perform INSERT
      const sqlInsert = `
        INSERT INTO creditInfo (userID, cardNumber, cardName, expiryDate, cvv) 
        VALUES (?, ?, ?, ?, ?);
      `;
      db.query(sqlInsert, [userID, cardNumber, cardName, expiryDate, cvv], (insertError, insertResults) => {
        if (insertError) {
          console.error('Error inserting new credit card information:', insertError);
          return res.status(500).json({ message: 'Error inserting new credit card information' });
        }
        console.log(`New credit card information inserted for userID ${userID}`);
        res.json({ message: 'New credit card information has been added successfully.' , success: true });
      });
    } else {
      // UserID exists, perform UPDATE
      const sqlUpdate = `
        UPDATE creditInfo 
        SET cardNumber = ?, cardName = ?, expiryDate = ?, cvv = ?
        WHERE userID = ?;
      `;
      db.query(sqlUpdate, [cardNumber, cardName, expiryDate, cvv, userID], (updateError, updateResults) => {
        if (updateError) {
          console.error('Error updating existing credit card information:', updateError);
          return res.status(500).json({ message: 'Error updating existing credit card information' });
        }
        console.log(`Credit card information updated for userID ${userID}`);
        res.json({ message: 'Credit card information has been updated successfully.', success: true });
      });
    }
  });
});

//////////////////////////////////check credit info/////////////////////////////////////////////////////////////////////////////

app.get("/checkCreditCard", (req, res) => {
  const userID = req.session.userID;

  if (!userID) {
    return res.status(403).json({ message: "User not authenticated" });
  }

  // Query to select the credit card info for the given userID
  const sql = "SELECT 1 FROM creditInfo WHERE userID = ? LIMIT 1";

  db.query(sql, [userID], (error, results) => {
    if (error) {
      console.error("Error checking for credit card information:", error);
      return res.status(500).json({ message: "Error checking for credit card information" });
    }

    // If results array is not empty, it means a credit card record exists for the user
    const hasCreditCard = results.length > 0;

    console.log(`Credit card check for user ${userID}: ${hasCreditCard}`);
    res.json({ hasCreditCard });
  });
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.post("/checkActiveIncompleteReservationsWithCar", (req, res) => {
  const userID = req.body.userID;
  console.log(userID);
  if (!userID) {
    return res.status(400).json({ message: "UserID is required" });
  }

  // Adjust the query to find reservations where isActive is true and completed is false
  const reservationQuery =
    "SELECT * FROM reservations WHERE userID = ? AND isActive = true AND completed = false LIMIT 1";

  db.query(reservationQuery, [userID], (err, reservationResults) => {
    if (err) {
      console.error("Error fetching reservations from the database:", err);
      return res
        .status(500)
        .json({ message: "Error fetching reservations data" });
    }

    if (reservationResults.length > 0) {
      // An active and incomplete reservation is found, now find the car details for the carID from the reservation
      const carID = reservationResults[0].carID;
      const carQuery = "SELECT * FROM car WHERE carID = ?";

      db.query(carQuery, [carID], (carErr, carResults) => {
        if (carErr) {
          console.error("Error fetching car from the database:", carErr);
          return res.status(500).json({ message: "Error fetching car data" });
        }

        if (carResults.length > 0) {
          // Car found, send back the details
          return res.json({
            message: "Car details found for active and incomplete reservation",
            car: carResults[0],
            reservation: reservationResults[0],
            success: true,
          });
        } else {
          // Car not found
          return res
            .status(404)
            .json({ message: "Car not found for the reservation" });
        }
      });
    } else {
      // No active and incomplete reservations found
      return res
        .status(404)
        .json({ message: "No active and incomplete reservations found", success: false });
    }
  });
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////
app.post("/completedReservation", (req, res) => {
  const { reservationID } = req.body;

  if (!reservationID) {
    return res
      .status(400)
      .json({ message: "Reservation ID is required", success: false });
  }
  
  const sql = "UPDATE reservations SET completed = true WHERE reservationID = ?";

  db.query(sql, [reservationID], (err, result) => {
    if (err) {
      console.error("Error updating reservation isActive status:", err);
      return res
        .status(500)
        .json({ message: "Error updating reservation", success: false });
    }

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "Reservation not found", success: false });
    }

    res.json({ message: "Reservation is now active", success: true });
  });
});

app.use(express.static(path.join(__dirname, '../../frontend/build')));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/build/index.html'));
});


app.listen(PORT, (req, res) => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;