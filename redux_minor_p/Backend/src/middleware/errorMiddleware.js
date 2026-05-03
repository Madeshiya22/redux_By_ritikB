import { errorResponse } from "../utils/errorHandler.js";

// Global error handling middleware
const errorMiddleware = (err, req, res, next) => {
  errorResponse(err, req, res, next);
};

export default errorMiddleware;
