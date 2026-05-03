import { verifyAccessToken } from "../../utils/jwt.utils.js";
import User from "../models/user.model.js";
import { AppError } from "../../utils/errorHandler.js";

export const authenticateToken = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

    if (!token) {
      throw new AppError("No token provided, authorization required", 401);
    }

    // Verify token
    const decoded = verifyAccessToken(token);
    
    // Get user from database
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      throw new AppError("User not found", 404);
    }

    // Attach user to request
    req.user = user;
    req.userId = decoded.userId;
    
    next();
  } catch (error) {
    if (error.message.includes("expired")) {
      return res.status(401).json({
        success: false,
        message: "Token has expired",
        code: "TOKEN_EXPIRED",
      });
    }
    
    return res.status(error.statusCode || 401).json({
      success: false,
      message: error.message || "Unauthorized access",
    });
  }
};

// Optional auth middleware - doesn't throw if no token
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (token) {
      const decoded = verifyAccessToken(token);
      const user = await User.findById(decoded.userId);
      if (user) {
        req.user = user;
        req.userId = decoded.userId;
      }
    }

    next();
  } catch (error) {
    // Continue without authentication
    next();
  }
};
