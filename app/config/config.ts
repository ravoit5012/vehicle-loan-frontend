const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api";

export const API_ENDPOINTS = {
  LOGIN: `${BASE_URL}/auth/login`,
  LOGOUT: `${BASE_URL}/auth/logout`,
  ME: `${BASE_URL}/auth/dashboard`,
  ADMINS: `${BASE_URL}/admin`,
  AGENTS: `${BASE_URL}/agents`,
  BRANCHES: `${BASE_URL}/branches`,
  LOANS: `${BASE_URL}/loans`,
};

export default BASE_URL;
