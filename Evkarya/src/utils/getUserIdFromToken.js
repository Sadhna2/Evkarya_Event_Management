import { jwtDecode } from "jwt-decode";

export const getUserIdFromToken = (token) => {
  try {
    const decoded = jwtDecode(token); 
    console.log(decoded); 
    return decoded._id; 
  } catch (err) {
    console.error("Token decoding failed:", err);
    return null;
  }
};
