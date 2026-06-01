import api from "./api";

export const getAllMenuItems = async () => {
  const res = await api.get("/menu/");
  return res.data;
};

export const getActiveMenuItems = async () => {
  const res = await api.get("/menu/active");
  return res.data;
};

export const addMenuItem = async (data) => {
  const res = await api.post("/menu/", data);
  return res.data;
};

export const updateMenuItem = async (id, data) => {
  const res = await api.put(`/menu/${id}`, data);
  return res.data;
};

export const toggleMenuItem = async (id) => {
  const res = await api.patch(`/menu/${id}/toggle`);
  return res.data;
};

export const deleteMenuItem = async (id) => {
  const res = await api.delete(`/menu/${id}`);
  return res.data;
};