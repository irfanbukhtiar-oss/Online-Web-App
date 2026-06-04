import api from "./api";

export const placeOrder = async (data) => {
  const res = await api.post("/orders/", data);
  return res.data;
};

export const getAllOrders = async (date = "") => {
  const url = date ? `/admin/orders?date=${date}` : "/admin/orders";
  const res = await api.get(url);
  return res.data;
};

export const getDashboardStats = async (date = "") => {
  const url = date ? `/admin/dashboard?date=${date}` : "/admin/dashboard";
  const res = await api.get(url);
  return res.data;
};

export const getSalesReport = async (date = "") => {
  const url = date ? `/admin/sales-report?date=${date}` : "/admin/sales-report";
  const res = await api.get(url);
  return res.data;
};

export const getOrderById = async (id) => {
  const res = await api.get(`/orders/${id}`);
  return res.data;
};

export const getMyOrders = async (phone) => {
  const res = await api.post("/orders/my-orders", { phone });
  return res.data;
};

export const updateOrderStatus = async (orderId, status) => {
  const res = await api.patch(`/admin/orders/${orderId}/status`, {
    status
  });

  return res.data;
};

export const deleteOrder = async (orderId) => {
  const res = await api.delete(`/admin/orders/${orderId}`);
  return res.data;
};