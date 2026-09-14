const dotenv = require("dotenv");
const mongoose = require("mongoose");

const app = require("./src/app");

const {
  startReservationExpiryJob
} = require("./src/jobs/reservationExpiryJob");


/* =====================================================
   LOAD ENVIRONMENT VARIABLES
===================================================== */

dotenv.config();


/* =====================================================
   CONFIGURATION
===================================================== */

const PORT = process.env.PORT || 5001;

const MONGO_URI = process.env.MONGO_URI;


/* =====================================================
   VALIDATE ENVIRONMENT VARIABLES
===================================================== */

if (!MONGO_URI) {

  console.error(
    "MONGO_URI is not defined in the .env file"
  );

  process.exit(1);

}


/* =====================================================
   START SERVER
===================================================== */

const startServer = async () => {

  try {

    /* ================================================
       CONNECT TO MONGODB
    ================================================= */

    await mongoose.connect(MONGO_URI);

    console.log(
      "MongoDB connected successfully"
    );


    /* ================================================
       START RESERVATION EXPIRY JOB
    ================================================= */

    startReservationExpiryJob();


    /* ================================================
       START EXPRESS SERVER
    ================================================= */

    app.listen(PORT, () => {

      console.log(
        `Server is running on port ${PORT}`
      );

      console.log(
        `API URL: http://localhost:${PORT}`
      );

    });


  } catch (error) {

    console.error(
      "MongoDB connection failed:",
      error.message
    );

    process.exit(1);

  }

};


/* =====================================================
   RUN SERVER
===================================================== */

startServer();