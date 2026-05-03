import jwt from "jsonwebtoken";
import { config } from "../config/config.js";

// Generate Access Token (short-lived)
export const generateAccessToken = (userId) => {
  return jwt.sign({ userId }, config.JWT_ACCESS_SECRET, {
    expiresIn: config.JWT_ACCESS_EXPIRE || "15m",
  });
};

// Generate Refresh Token (long-lived)
export const generateRefreshToken = (userId) => {
  return jwt.sign({ userId }, config.JWT_REFRESH_SECRET, {
    expiresIn: config.JWT_REFRESH_EXPIRE || "30d",
  });
};

// Verify Access Token
export const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, config.JWT_ACCESS_SECRET);
  } catch (error) {
    throw new Error("Invalid or expired access token");
  }
};

// Verify Refresh Token
export const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, config.JWT_REFRESH_SECRET);
  } catch (error) {
    throw new Error("Invalid or expired refresh token");
  }
};

// Decode token without verification (for debugging)
export const decodeToken = (token) => {
  return jwt.decode(token);
};
