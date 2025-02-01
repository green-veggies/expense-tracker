// const host = "https://expense-tracker-app-knl1.onrender.com";
const host = "http://localhost:8800";
export const registerAPI = `${host}/api/v1/user/signup`;
export const loginAPI = `${host}/api/v1/user/signin`;
export const addTransaction = `${host}/api/v1/addTransaction`;
export const getTransactions = `${host}/api/v1/getTransaction`;
export const editTransactions = `${host}/api/v1/updateTransaction`;
export const deleteTransactions = `${host}/api/v1/deleteTransaction`;