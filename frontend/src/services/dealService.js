import api from "./api";

export const getAllDeals = async () => {
  const res = await api.get("/deals/");
  return res.data;
};

export const getActiveDeals = async () => {
  const res = await api.get("/deals/active");
  return res.data;
};

export const addDeal = async (data) => {
  const res = await api.post("/deals/", data);
  return res.data;
};

export const updateDeal = async (id, data) => {
  const res = await api.put(`/deals/${id}`, data);
  return res.data;
};

export const toggleDeal = async (id) => {
  const res = await api.patch(`/deals/${id}/toggle`);
  return res.data;
};

export const deleteDeal = async (id) => {
  const res = await api.delete(`/deals/${id}`);
  return res.data;
};