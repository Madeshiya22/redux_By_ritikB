import dotenv from "dotenv";

dotenv.config();

export const config = {
  PORT: process.env.PORT || 3000,
  MONGO_URI: process.env.MONGO_URI || "mongodb://localhost:27017/redux_minor_p",
  
  // JWT Configuration
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || "your_access_token_secret_key_change_in_production",
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || "your_refresh_token_secret_key_change_in_production",
  JWT_ACCESS_EXPIRE: process.env.JWT_ACCESS_EXPIRE || "15m",
  JWT_REFRESH_EXPIRE: process.env.JWT_REFRESH_EXPIRE || "30d",

  // Google OAuth Configuration
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || "your_google_client_id",
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || "your_google_client_secret",
  GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL || "http://localhost:3001/api/auth/google/callback",

  // Frontend URL
  FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:3000",
  
  // Environment
  NODE_ENV: process.env.NODE_ENV || "development",
};
