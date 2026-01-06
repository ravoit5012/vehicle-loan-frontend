const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001/api";
export const API_ENDPOINTS = {
  // AUTH ENDPOINTS
  LOGIN: `${BASE_URL}/auth/login`,
  LOGOUT: `${BASE_URL}/auth/logout`,
  ME: `${BASE_URL}/auth/dashboard`,

  // CUSTOMER DETAILS ENDPOINTS
  ADD_CUSTOMER: `${BASE_URL}/customers`,
  CUSTOMER_COUNT: `${BASE_URL}/customers/count`,
  GET_ALL_CUSTOMERS:  `${BASE_URL}/customers/all`,
  GET_CUSTOMER_BY_ID: `${BASE_URL}/customers/id`,
  UPDATE_CUSTOMER: `${BASE_URL}/customers/update/id`,
  DELETE_CUSTOMER: `${BASE_URL}/customers/delete/id`,

  //AGENT DETAILS ENDPOINTS
  GET_ALL_AGENTS: `${BASE_URL}/agent/all`,
  GET_AGENT_BY_ID:  `${BASE_URL}/agent/id`,
  GET_AGENTS_OF_MANAGER: `${BASE_URL}/agent/manager`,

  // MANAGER DETAILS ENDPOINTS
  GET_ALL_MANAGERS: `${BASE_URL}/manager/all`,
  GET_MANAGER_BY_ID:  `${BASE_URL}/manager/id`,
};

export const FILES_URL = process.env.NEXT_PUBLIC_API_FILES_URL || "http://localhost:3001";
export default BASE_URL;
export const RELIGIONS = [
  "HINDU",
  "MUSLIM",
  "CHRISTIAN",
  "SIKH",
  "BUDDHIST",
  "JAIN",
  "OTHER",
] as const;

export const NOMINEE_RELATIONS = [
  "FATHER",
  "MOTHER",
  "SPOUSE",
  "SON",
  "DAUGHTER",
  "BROTHER",
  "SISTER",
  "OTHER",
] as const;
