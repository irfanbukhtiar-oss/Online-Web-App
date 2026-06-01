import api from "./api";

export const trackOrder = async (data) => {
  const res = await api.post("/tracking/", data);
  return res.data;
};