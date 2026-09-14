const express = require("express");
const cors = require("cors");

const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");


/* =====================================================
   CREATE EXPRESS APP
===================================================== */

const app = express();


/* =====================================================
   MIDDLEWARE
===================================================== */

// Enable Cross-Origin Resource Sharing
app.use(cors());

// Parse JSON request bodies
app.use(express.json());


/* =====================================================
   HOME ROUTE
===================================================== */

app.get("/", (req, res) => {

  res.status(200).send(
    "POS Order & Inventory API is running"
  );

});


/* =====================================================
   HEALTH CHECK ROUTE
===================================================== */

app.get("/api/health", (req, res) => {

  res.status(200).json({

    success: true,

    message: "Server is healthy"

  });

});


/* =====================================================
   PRODUCT ROUTES
===================================================== */

app.use(
  "/api/products",
  productRoutes
);


/* =====================================================
   ORDER ROUTES
===================================================== */

app.use(
  "/api/orders",
  orderRoutes
);


/* =====================================================
   404 ROUTE HANDLER
===================================================== */

app.use((req, res) => {

  res.status(404).json({

    success: false,

    message: "Route not found"

  });

});


/* =====================================================
   GLOBAL ERROR HANDLER
===================================================== */

app.use((error, req, res, next) => {

  console.error(
    "Server Error:",
    error.message
  );


  res.status(
    error.status || 500
  ).json({

    success: false,

    message:
      error.message ||
      "Internal server error"

  });

});


/* =====================================================
   EXPORT APP
===================================================== */

module.exports = app;