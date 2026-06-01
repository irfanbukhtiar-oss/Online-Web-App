import api from "./api";

export const placeOrder = async (data) => {
  const res = await api.post("/orders/", data);
  return res.data;
};

export const getAllOrders = async () => {
  const res = await api.get("/admin/orders");
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