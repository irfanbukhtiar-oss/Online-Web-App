import axios from "axios";

const api = axios.create({
  baseURL: "https://broastchasers-api.onrender.com/api",
  headers: {
    "Content-Type": "application/json"
  }
});

export default api;