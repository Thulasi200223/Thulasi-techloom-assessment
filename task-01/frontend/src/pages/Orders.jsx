import { useEffect, useMemo, useState } from "react";
import {
  Search,
  RefreshCw,
  Package,
  CreditCard,
  XCircle,
  RotateCcw,
  CheckCircle2,
  Clock,
  AlertTriangle
} from "lucide-react";

import { orderAPI } from "../services/api";

import "./OrderList.css";


function Orders() {

  // =====================================================
  // STATE
  // =====================================================

  const [orders, setOrders] = useState([]);

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] =
    useState("All");

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] = useState("");

  const [processingId, setProcessingId] =
    useState(null);


  // =====================================================
  // FETCH ORDERS
  // =====================================================

  const fetchOrders = async () => {

    try {

      setError("");

      const response =
        await orderAPI.getAll();

      setOrders(
        response.orders || []
      );

    } catch (err) {

      console.error(
        "Fetch orders error:",
        err
      );

      setError(
        err.message ||
        "Failed to load orders"
      );

    } finally {

      setLoading(false);
      setRefreshing(false);

    }
  };


  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {

    fetchOrders();

  }, []);


  // =====================================================
  // REFRESH
  // =====================================================

  const handleRefresh = async () => {

    setRefreshing(true);

    await fetchOrders();

  };


  // =====================================================
  // FILTER
  // =====================================================

  const filteredOrders = useMemo(() => {

    const keyword =
      search.trim().toLowerCase();

    return orders.filter((order) => {

      const orderId =
        String(
          order._id || ""
        ).toLowerCase();

      const customerName =
        String(
          order.customer?.fullName ||
          order.customer?.name ||
          ""
        ).toLowerCase();

      const customerEmail =
        String(
          order.customer?.email ||
          ""
        ).toLowerCase();

      const matchesSearch =
        !keyword ||
        orderId.includes(keyword) ||
        customerName.includes(keyword) ||
        customerEmail.includes(keyword);


      const matchesStatus =
        statusFilter === "All" ||
        order.status === statusFilter;


      return (
        matchesSearch &&
        matchesStatus
      );

    });

  }, [
    orders,
    search,
    statusFilter
  ]);


  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (date) => {

    if (!date) {
      return "-";
    }

    return new Date(date)
      .toLocaleString("en-LK", {
        dateStyle: "medium",
        timeStyle: "short"
      });

  };


  // =====================================================
  // FORMAT CURRENCY
  // =====================================================

  const formatMoney = (amount) => {

    return `Rs. ${Number(
      amount || 0
    ).toLocaleString()}`;

  };


  // =====================================================
  // STATUS CLASS
  // =====================================================

  const getStatusClass = (status) => {

    switch (status) {

      case "Completed":
        return "order-status-completed";

      case "Paid":
        return "order-status-paid";

      case "Processing":
        return "order-status-processing";

      case "Reserved":
        return "order-status-reserved";

      case "Pending":
        return "order-status-pending";

      case "Cancelled":
        return "order-status-cancelled";

      case "Failed":
        return "order-status-failed";

      case "Expired":
        return "order-status-expired";

      default:
        return "order-status-default";

    }

  };


  // =====================================================
  // STATUS ICON
  // =====================================================

  const getStatusIcon = (status) => {

    switch (status) {

      case "Completed":
        return <CheckCircle2 size={14} />;

      case "Paid":
        return <CreditCard size={14} />;

      case "Processing":
        return <Package size={14} />;

      case "Reserved":
        return <Clock size={14} />;

      case "Pending":
        return <Clock size={14} />;

      case "Cancelled":
        return <XCircle size={14} />;

      case "Failed":
        return <AlertTriangle size={14} />;

      case "Expired":
        return <Clock size={14} />;

      default:
        return <Package size={14} />;

    }

  };


  // =====================================================
  // UPDATE STATUS
  // =====================================================

  const updateStatus = async (
    orderId,
    newStatus
  ) => {

    try {

      setProcessingId(orderId);

      const response =
        await fetch(
          `${
            import.meta.env.VITE_API_URL ||
            "http://localhost:5001/api"
          }/orders/${orderId}/status`,
          {
            method: "PUT",
            headers: {
              "Content-Type":
                "application/json"
            },
            body: JSON.stringify({
              status: newStatus
            })
          }
        );


      const data =
        await response.json();


      if (!response.ok) {
        throw new Error(
          data.message ||
          "Failed to update order"
        );
      }


      await fetchOrders();

    } catch (err) {

      alert(
        err.message ||
        "Failed to update order"
      );

    } finally {

      setProcessingId(null);

    }

  };


  // =====================================================
  // CANCEL ORDER
  // =====================================================

  const cancelOrder = async (orderId) => {

    const confirmed =
      window.confirm(
        "Are you sure you want to cancel this order?"
      );

    if (!confirmed) {
      return;
    }


    try {

      setProcessingId(orderId);

      const response =
        await fetch(
          `${
            import.meta.env.VITE_API_URL ||
            "http://localhost:5001/api"
          }/orders/${orderId}/cancel`,
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json"
            }
          }
        );


      const data =
        await response.json();


      if (!response.ok) {
        throw new Error(
          data.message ||
          "Failed to cancel order"
        );
      }


      alert(
        data.message ||
        "Order cancelled successfully"
      );


      await fetchOrders();

    } catch (err) {

      alert(
        err.message ||
        "Failed to cancel order"
      );

    } finally {

      setProcessingId(null);

    }

  };


  // =====================================================
  // REFUND ORDER
  // =====================================================

  const refundOrder = async (orderId) => {

    const confirmed =
      window.confirm(
        "Process mock refund for this order?"
      );

    if (!confirmed) {
      return;
    }


    try {

      setProcessingId(orderId);

      const response =
        await fetch(
          `${
            import.meta.env.VITE_API_URL ||
            "http://localhost:5001/api"
          }/orders/${orderId}/refund`,
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json"
            }
          }
        );


      const data =
        await response.json();


      if (!response.ok) {
        throw new Error(
          data.message ||
          "Failed to refund order"
        );
      }


      alert(
        data.message ||
        "Refund processed successfully"
      );


      await fetchOrders();

    } catch (err) {

      alert(
        err.message ||
        "Failed to refund order"
      );

    } finally {

      setProcessingId(null);

    }

  };


  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (

      <div className="order-list-page">

        <div className="order-list-loading">

          <RefreshCw
            size={28}
            className="order-spin"
          />

          <p>
            Loading orders...
          </p>

        </div>

      </div>

    );

  }


  // =====================================================
  // PAGE
  // =====================================================

  return (

    <div className="order-list-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="order-list-header">

        <div>

          <div className="order-list-breadcrumb">
            POSFLOW / SALES / ORDERS
          </div>

          <h1>
            Orders
          </h1>

          <p>
            View and manage customer orders,
            payments and order status.
          </p>

        </div>


        <button
          className="order-refresh-button"
          onClick={handleRefresh}
          disabled={refreshing}
        >

          <RefreshCw
            size={17}
            className={
              refreshing
                ? "order-spin"
                : ""
            }
          />

          {refreshing
            ? "Refreshing..."
            : "Refresh"}

        </button>

      </div>


      {/* =================================================
          ERROR
      ================================================= */}

      {error && (

        <div className="order-error">

          <AlertTriangle size={18} />

          <span>
            {error}
          </span>

          <button
            onClick={fetchOrders}
          >
            Try Again
          </button>

        </div>

      )}


      {/* =================================================
          TOOLBAR
      ================================================= */}

      <div className="order-toolbar">

        <div className="order-search">

          <Search size={17} />

          <input
            type="text"
            placeholder="Search order, customer or email..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
          />

        </div>


        <select
          className="order-filter"
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(
              event.target.value
            )
          }
        >

          <option value="All">
            All Statuses
          </option>

          <option value="Pending">
            Pending
          </option>

          <option value="Reserved">
            Reserved
          </option>

          <option value="Processing">
            Processing
          </option>

          <option value="Paid">
            Paid
          </option>

          <option value="Completed">
            Completed
          </option>

          <option value="Cancelled">
            Cancelled
          </option>

          <option value="Expired">
            Expired
          </option>

          <option value="Failed">
            Failed
          </option>

        </select>

      </div>


      {/* =================================================
          ORDER TABLE
      ================================================= */}

      <div className="order-list-card">

        <div className="order-list-card-header">

          <div>

            <h2>
              Order History
            </h2>

            <p>
              {filteredOrders.length} order
              {filteredOrders.length !== 1
                ? "s"
                : ""} found
            </p>

          </div>

        </div>


        {filteredOrders.length === 0 ? (

          <div className="order-list-empty">

            <Package size={42} />

            <h3>
              No orders found
            </h3>

            <p>
              Orders will appear here after
              customers place them.
            </p>

          </div>

        ) : (

          <div className="order-table-wrapper">

            <table className="order-table">

              <thead>

                <tr>

                  <th>
                    Order
                  </th>

                  <th>
                    Customer
                  </th>

                  <th>
                    Items
                  </th>

                  <th>
                    Total
                  </th>

                  <th>
                    Payment
                  </th>

                  <th>
                    Status
                  </th>

                  <th>
                    Date
                  </th>

                  <th>
                    Actions
                  </th>

                </tr>

              </thead>


              <tbody>

                {filteredOrders.map(
                  (order) => {

                    const itemCount =
                      order.items?.reduce(
                        (sum, item) =>
                          sum +
                          Number(
                            item.quantity || 0
                          ),
                        0
                      ) || 0;


                    const customerName =
                      order.customer?.fullName ||
                      order.customer?.name ||
                      "Customer";


                    const paymentStatus =
                      order.paymentStatus ||
                      "Pending";


                    const isProcessing =
                      processingId ===
                      order._id;


                    return (

                      <tr
                        key={order._id}
                      >

                        {/* ORDER */}

                        <td>

                          <div className="order-id">

                            <strong>
                              #
                              {String(
                                order._id
                              ).slice(-8)}
                            </strong>

                            <span>
                              {order.checkoutSessionId
                                ? "Session linked"
                                : "Order"}
                            </span>

                          </div>

                        </td>


                        {/* CUSTOMER */}

                        <td>

                          <div className="order-customer">

                            <strong>
                              {customerName}
                            </strong>

                            <span>
                              {order.customer?.email ||
                                "-"}
                            </span>

                          </div>

                        </td>


                        {/* ITEMS */}

                        <td>

                          <span className="order-item-count">
                            {itemCount} item
                            {itemCount !== 1
                              ? "s"
                              : ""}
                          </span>

                        </td>


                        {/* TOTAL */}

                        <td>

                          <strong className="order-total">
                            {formatMoney(
                              order.totalAmount
                            )}
                          </strong>

                        </td>


                        {/* PAYMENT */}

                        <td>

                          <div className="order-payment">

                            <strong>
                              {order.paymentMethod ||
                                "-"}
                            </strong>

                            <span>
                              {paymentStatus}
                            </span>

                          </div>

                        </td>


                        {/* STATUS */}

                        <td>

                          <span
                            className={`order-status ${getStatusClass(
                              order.status
                            )}`}
                          >

                            {getStatusIcon(
                              order.status
                            )}

                            {order.status ||
                              "Unknown"}

                          </span>

                        </td>


                        {/* DATE */}

                        <td>

                          <span className="order-date">
                            {formatDate(
                              order.createdAt
                            )}
                          </span>

                        </td>


                        {/* ACTIONS */}

                        <td>

                          <div className="order-actions">

                            {/* COMPLETE */}

                            {(order.status ===
                              "Paid" ||
                              order.status ===
                                "Processing") && (

                              <button
                                className="order-action-complete"
                                title="Mark Completed"
                                disabled={
                                  isProcessing
                                }
                                onClick={() =>
                                  updateStatus(
                                    order._id,
                                    "Completed"
                                  )
                                }
                              >

                                <CheckCircle2
                                  size={15}
                                />

                              </button>

                            )}


                            {/* CANCEL */}

                            {order.status !==
                              "Cancelled" &&
                              order.status !==
                                "Completed" &&
                              order.status !==
                                "Failed" &&
                              order.status !==
                                "Expired" && (

                              <button
                                className="order-action-cancel"
                                title="Cancel Order"
                                disabled={
                                  isProcessing
                                }
                                onClick={() =>
                                  cancelOrder(
                                    order._id
                                  )
                                }
                              >

                                <XCircle
                                  size={15}
                                />

                              </button>

                            )}


                            {/* REFUND */}

                            {order.paymentStatus ===
                              "Success" && (

                              <button
                                className="order-action-refund"
                                title="Process Refund"
                                disabled={
                                  isProcessing
                                }
                                onClick={() =>
                                  refundOrder(
                                    order._id
                                  )
                                }
                              >

                                <RotateCcw
                                  size={15}
                                />

                              </button>

                            )}

                          </div>

                        </td>

                      </tr>

                    );

                  }
                )}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>

  );

}


export default Orders;