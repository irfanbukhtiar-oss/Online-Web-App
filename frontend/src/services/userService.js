import api from "./api";

export const getUsers = async () => {
  const res = await api.get("/admin/users");
  return res.data;
};

export const getUserById = async (id) => {
  const res = await api.get(`/admin/users/${id}`);
  return res.data;
};

export const createUser = async (data) => {
  const res = await api.post("/admin/users", data);
  return res.data;
};

export const updateUser = async (id, data) => {
  const res = await api.put(`/admin/users/${id}`, data);
  return res.data;
};

export const toggleUserStatus = async (id) => {
  const res = await api.patch(`/admin/users/${id}/toggle`);
  return res.data;
};

export const deleteUser = async (id) => {
  const res = await api.delete(`/admin/users/${id}`);
  return res.data;
};