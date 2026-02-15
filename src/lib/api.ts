import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

/* ================= ENV ================= */

const API_BASE =
  (import.meta as any).env?.VITE_BACKEND_URL ||
  process.env.REACT_APP_BACKEND_URL ||
  "https://paris-boheme-api.onrender.com";

/* ================= CONFIG ================= */

const MAX_RETRIES = 3;
const RETRY_DELAY = 800; // ms base para backoff exponencial

interface RetryAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retryCount?: number;
}

export const api: AxiosInstance = axios.create({
  baseURL: `${API_BASE}/api`,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

/* ================= REQUEST INTERCEPTOR ================= */

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Futuro: añadir Authorization header
    // const token = localStorage.getItem("token");
    // if (token) config.headers.Authorization = `Bearer ${token}`;

    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

/* ================= RESPONSE INTERCEPTOR ================= */

api.interceptors.response.use(
  (response: AxiosResponse) => response,

  async (error: AxiosError) => {
    const config = error.config as RetryAxiosRequestConfig;

    /* ========= NETWORK OR TIMEOUT ========= */

    const isNetworkError = !error.response;
    const isTimeout = error.code === "ECONNABORTED";
    const status = error.response?.status;

    const isServerError = status ? status >= 500 : false;

    const shouldRetry =
      config &&
      (isNetworkError || isTimeout || isServerError) &&
      status !== 401 &&
      status !== 403 &&
      status !== 404;

    if (!shouldRetry) {
      return Promise.reject(error);
    }

    /* ========= INIT RETRY COUNT ========= */

    config._retryCount = config._retryCount || 0;

    if (config._retryCount >= MAX_RETRIES) {
      console.error("❌ Max retries alcanzado");
      return Promise.reject(error);
    }

    config._retryCount += 1;

    /* ========= EXPONENTIAL BACKOFF ========= */

    const delay =
      RETRY_DELAY * Math.pow(2, config._retryCount - 1);

    console.warn(
      `🔁 Retry ${config._retryCount}/${MAX_RETRIES} en ${delay}ms`
    );

    await new Promise((resolve) => setTimeout(resolve, delay));

    return api(config);
  }
);
