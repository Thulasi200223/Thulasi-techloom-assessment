const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5001/api";

/* ==========================================
   COMMON API REQUEST HELPER
========================================== */

const apiRequest = async (endpoint, options = {}) => {
  const response = await fetch(
    `${API_BASE_URL}${endpoint}`,
    {
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {})
      },

      ...options
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Something went wrong"
    );
  }

  return data;
};


/* ==========================================
   PRODUCT API
========================================== */

export const productAPI = {

  // GET ALL PRODUCTS
  getAll: () => {
    return apiRequest("/products");
  },


  // GET SINGLE PRODUCT
  getById: (id) => {
    return apiRequest(`/products/${id}`);
  },


  // CREATE PRODUCT
  create: (productData) => {
    return apiRequest(
      "/products",
      {
        method: "POST",

        body: JSON.stringify(productData)
      }
    );
  },


  // UPDATE PRODUCT
  update: (id, productData) => {
    return apiRequest(
      `/products/${id}`,
      {
        method: "PUT",

        body: JSON.stringify(productData)
      }
    );
  },


  // DELETE PRODUCT
  delete: (id) => {
    return apiRequest(
      `/products/${id}`,
      {
        method: "DELETE"
      }
    );
  }

};


/* ==========================================
   ORDER API
========================================== */

export const orderAPI = {

  // CREATE ORDER
  create: (orderData) => {
    return apiRequest(
      "/orders",
      {
        method: "POST",

        body: JSON.stringify(orderData)
      }
    );
  },


  // PROCESS PAYMENT
  processPayment: (id, paymentData) => {
    return apiRequest(
      `/orders/${id}/payment`,
      {
        method: "POST",

        body: JSON.stringify(paymentData)
      }
    );
  },


  // CANCEL ORDER
  cancel: (id) => {
    return apiRequest(
      `/orders/${id}/cancel`,
      {
        method: "POST"
      }
    );
  },


  // GET ALL ORDERS
  getAll: () => {
    return apiRequest("/orders");
  },


  // GET SINGLE ORDER
  getById: (id) => {
    return apiRequest(`/orders/${id}`);
  }

};


/* ==========================================
   HEALTH CHECK
========================================== */

export const healthAPI = {

  check: () => {
    return apiRequest("/health");
  }

};


export default {
  productAPI,
  orderAPI,
  healthAPI
};