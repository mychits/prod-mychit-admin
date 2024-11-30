import axios from "axios";

const token = localStorage.getItem("token");

const api = axios.create({
  baseURL: "http://13.53.131.163:3000/api",
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export default api;
