import axios from "axios"; 

export const http = axios.create({
  baseURL: "http://localhost:8088",
  headers: { "Content-Type": "application/json" },
});

http.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`; 
  return config;
});
