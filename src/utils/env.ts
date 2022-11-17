export const isProduction = process.env.NODE_ENV === "production";

// https://jsonplaceholder.typicode.com/
export const baseURL = !isProduction ? "/" : "";
