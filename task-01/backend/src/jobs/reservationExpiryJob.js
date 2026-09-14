const mongoose = require("mongoose");

const Order = require("../models/Order");
const Product = require("../models/Product");


/* =====================================================
   RELEASE EXPIRED RESERVATIONS

   FLOW:

   1. Find Reserved orders
   2. Check reservation expiry time
   3. Restore product stock
   4. Update order status to Expired
   5. Update payment status to Timeout

===================================================== */

const releaseExpiredReservations = async () => {

  try {

    const now = new Date();


    /* ==========================================
       FIND EXPIRED RESERVED ORDERS
    ========================================== */

    const expiredOrders = await Order.find({

      status: "Reserved",

      paymentStatus: "Pending",

      reservationExpiresAt: {
        $lte: now
      }

    });


    /* ==========================================
       PROCESS EACH EXPIRED ORDER
    ========================================== */

    for (const expiredOrder of expiredOrders) {


      const session =
        await mongoose.startSession();


      try {


        /* ======================================
           START TRANSACTION
        ====================================== */

        await session.withTransaction(
          async () => {


            /*
              Get the latest order inside
              the transaction.

              This prevents stock from being
              restored twice.
            */

            const order =
              await Order.findOne({

                _id:
                  expiredOrder._id,

                status:
                  "Reserved",

                paymentStatus:
                  "Pending",

                reservationExpiresAt: {
                  $lte:
                    new Date()
                }

              }).session(session);


            /* ==================================
               ALREADY PROCESSED
            ================================== */

            if (!order) {
              return;
            }


            /* ==================================
               RESTORE PRODUCT STOCK
            ================================== */

            for (
              const item of order.items
            ) {


              await Product.findByIdAndUpdate(

                item.product,

                {

                  $inc: {

                    stock:
                      Number(
                        item.quantity
                      )

                  }

                },

                {

                  session

                }

              );

            }


            /* ==================================
               UPDATE ORDER
            ================================== */

            order.status =
              "Expired";


            order.paymentStatus =
              "Timeout";


            order.reservationExpiresAt =
              null;


            await order.save({

              session

            });


            console.log(

              `Order ${order._id} expired. Stock restored successfully.`

            );

          }

        );


      } catch (error) {


        console.error(

          `Error processing expired order ${expiredOrder._id}:`,

          error.message

        );


      } finally {


        await session.endSession();


      }

    }


  } catch (error) {


    console.error(

      "Reservation Expiry Job Error:",

      error.message

    );

  }

};


/* =====================================================
   START RESERVATION EXPIRY JOB

   CHECKS EVERY 30 SECONDS
===================================================== */

const startReservationExpiryJob = () => {


  console.log(
    "Reservation Expiry Job started"
  );


  /* ==========================================
     CHECK EVERY 30 SECONDS
  ========================================== */

  setInterval(

    releaseExpiredReservations,

    30 * 1000

  );


  /* ==========================================
     RUN IMMEDIATELY ON SERVER START
  ========================================== */

  releaseExpiredReservations();

};


module.exports = {

  startReservationExpiryJob,

  releaseExpiredReservations

};