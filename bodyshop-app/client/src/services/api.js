// client/src/services/api.js
import axios from "axios";

// Use direct URL in dev to avoid proxy issues.
// You can still override with REACT_APP_API_BASE in production.
const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE || "http://localhost:5001/api",
});

export default api;
