const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001/api";
export const API_ENDPOINTS = {
  // AUTH ENDPOINTS
  LOGIN: `${BASE_URL}/auth/login`,
  LOGOUT: `${BASE_URL}/auth/logout`,
  ME: `${BASE_URL}/auth/dashboard`,

  // CUSTOMER DETAILS ENDPOINTS
  ADD_CUSTOMER: `${BASE_URL}/customers`,
  CUSTOMER_COUNT: `${BASE_URL}/customers/count`,
  GET_ALL_CUSTOMERS: `${BASE_URL}/customers/all`,
  GET_CUSTOMER_BY_ID: `${BASE_URL}/customers/id`,
  UPDATE_CUSTOMER: `${BASE_URL}/customers/update/id`,
  DELETE_CUSTOMER: `${BASE_URL}/customers/delete/id`,

  //AGENT DETAILS ENDPOINTS
  CREATE_AGENT: `${BASE_URL}/agent`,
  UPDATE_AGENT: `${BASE_URL}/agent/update/id`,
  DELETE_AGENT: `${BASE_URL}/agent/delete/id`,
  GET_ALL_AGENTS: `${BASE_URL}/agent/all`,
  GET_AGENT_BY_ID: `${BASE_URL}/agent/id`,
  GET_AGENTS_OF_MANAGER: `${BASE_URL}/agent/manager`,

  // MANAGER DETAILS ENDPOINTS
  CREATE_MANAGER: `${BASE_URL}/manager`,
  UPDATE_MANAGER: `${BASE_URL}/manager/update/id`,
  DELETE_MANAGER: `${BASE_URL}/manager/delete/id`,
  GET_ALL_MANAGERS: `${BASE_URL}/manager/all`,
  GET_MANAGER_BY_ID: `${BASE_URL}/manager/id`,

  // LOAN TYPE DETAILS ENDPOINTS
  CREATE_LOAN_TYPE: `${BASE_URL}/loan-types/create`,
  UPDATE_LOAN_TYPE: `${BASE_URL}/loan-types/update/id`,
  GET_ALL_LOAN_TYPES: `${BASE_URL}/loan-types/get-all`,
  GET_LOAN_TYPE_BY_ID: `${BASE_URL}/loan-types/id`,
  DELETE_LOAN_TYPE: `${BASE_URL}/loan-types/delete/id`,

  // LOAN APPLICATION ENDPOINTS
  CREATE_LOAN: `${BASE_URL}/loan/create/`,
  GET_ALL_LOAN_APPLICATIONS: `${BASE_URL}/loan/get-all`,
  GET_LOAN_APPLICATION_BY_ID: `${BASE_URL}/loan/id`,
  CALL_VERIFY: `${BASE_URL}/loan/call-verified/id`,
  DELETE_LOAN_APPLICATION: `${BASE_URL}/loan/delete/id`,
  GENERATE_CONTRACT: `${BASE_URL}/loan/generate-contract/id`,
  UPLOAD_SIGNED_LETTER: `${BASE_URL}/loan/sign-contract/id`,
  FIELD_VERIFICATION: `${BASE_URL}/loan/field-verify/id`,
  ADMIN_APPROVAL: `${BASE_URL}/loan/admin-approve/id`,
  DISBURSE_LOAN: `${BASE_URL}/loan/disburse/id`,
  REJECT_LOAN: `${BASE_URL}/loan/reject/id`,
  CLOSE_LOAN: `${BASE_URL}/loan/close/id`,
  // FEES PAYMENTS
  GET_ALL_FEES: `${BASE_URL}/loan/get-all-fees`,
  FEES_PAYMENT: `${BASE_URL}/loan/collect-fees`,
  // REPAYMENTS
  GET_ALL_REPAYMENTS: `${BASE_URL}/loan/all-repayments`,
  GET_REPAYMENTS_FOR_LOAN: `${BASE_URL}/loan/repayments`,
  PAY_REPAYMENT: `${BASE_URL}/loan/repayment/pay`,
  ADD_PENALTY: `${BASE_URL}/loan/repayment/penalty`
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
