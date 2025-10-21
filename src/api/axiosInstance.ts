import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    let message = "Unexpected server error";
    if (error.response) {
      // Backend responded with error (4xx / 5xx)
      message =
        error.response.data?.detail ||
        error.response.data?.message ||
        `Server error (${error.response.status})`;
    } else if (error.request) {
      // No response from server (network / CORS / timeout)
      message = "Network error — unable to reach the server. Please check your connection.";
    } else {
      // Something happened before the request was sent
      message = error.message || "Unexpected client error";
    }

    console.error("Axios error:", message);

    // Normalize and reject
    return Promise.reject({ ...error, message });
  }
);


export default axiosInstance;