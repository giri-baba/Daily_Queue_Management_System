import axios from "axios";
import { toast } from "react-toastify";

let activeRequests = 0;

const updateLoading = () => {
  window.dispatchEvent(new CustomEvent("api-loading", { detail: activeRequests > 0 }));
};

const api = axios.create({
  baseURL: "http://localhost:5000/api"
});

api.interceptors.request.use((config) => {
  activeRequests += 1;
  updateLoading();

  const token = localStorage.getItem("dqmsToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  console.log(`[API Request] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`, {
    data: config.data,
    params: config.params
  });
  return config;
});

api.interceptors.response.use(
  (response) => {
    activeRequests = Math.max(activeRequests - 1, 0);
    updateLoading();

    console.log(
      `[API Response] ${response.status} ${response.config.method?.toUpperCase()} ${response.config.url}`,
      response.data
    );
    return response;
  },
  (error) => {
    activeRequests = Math.max(activeRequests - 1, 0);
    updateLoading();

    const status = error.response?.status || "NO_RESPONSE";
    const method = error.config?.method?.toUpperCase() || "API";
    const url = error.config?.url || "unknown-url";
    const message = error.response?.data?.message || error.message || "Something went wrong";

    console.error(`[API Error] ${status} ${method} ${url}`, {
      message,
      response: error.response?.data
    });

    toast.error(message);
    return Promise.reject(error);
  }
);

export default api;
