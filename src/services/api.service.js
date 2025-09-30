import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
});

// REQUEST INTERCEPTOR - Attach access token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    console.log(API_URL)
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// RESPONSE INTERCEPTOR - Handle 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.log("Unauthorized. Logging out.");
      localStorage.clear();
      window.location.href = "/auth";
    }
    return Promise.reject(error);
  }
);

export default api;