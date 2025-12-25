import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  withCredentials: true, // optional but safe
});

export const fetchCategories = () =>
  API.get("/api/post/categories");

export const fetchPostsByCategory = (category) =>
  API.get(`/api/post/by-category?category=${category}`);

export default API;
