import User from "../models/user.model.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../../utils/jwt.utils.js";
import {
  validateRegistrationInput,
  validateLoginInput,
} from "../../utils/validators.js";
import { AppError, catchAsync } from "../../utils/errorHandler.js";

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const register = catchAsync(async (req, res, next) => {
  const { name, email, password, confirmPassword } = req.body;

  // Validate input
  const validation = validateRegistrationInput(name, email, password);
  if (!validation.isValid) {
    throw new AppError(
      `Validation Error: ${JSON.stringify(validation.errors)}`,
      400
    );
  }

  // Check if passwords match
  if (password !== confirmPassword) {
    throw new AppError("Passwords do not match", 400);
  }

  // Check if user already exists
  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    throw new AppError("User already exist with this email address", 409);
  }

  // Create new user
  const user = await User.create({
    name: name.trim(),
    email: email.toLowerCase(),
    password,
    authProvider: "local",
  });

  // Generate tokens
  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  // Save refresh token to database
  user.refreshTokens.push({ token: refreshToken });
  await user.save();

  // Return response
  return res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: {
      user: user.toJSON(),
      accessToken,
      refreshToken,
    },
  });
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // Validate input
  const validation = validateLoginInput(email, password);
  if (!validation.isValid) {
    throw new AppError(
      `Validation Error: ${JSON.stringify(validation.errors)}`,
      400
    );
  }

  // Find user by email
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  // For Google OAuth users without password
  if (!user.password) {
    throw new AppError(
      "This account is registered with Google. Please use Google login.",
      400
    );
  }

  // Compare passwords
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new AppError("Invalid email or password", 401);
  }

  // Generate tokens
  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  // Save refresh token to database
  user.refreshTokens.push({ token: refreshToken });
  await user.save();

  // Return response
  return res.status(200).json({
    success: true,
    message: "Login successful",
    data: {
      user: user.toJSON(),
      accessToken,
      refreshToken,
    },
  });
});

// @desc    Refresh access token
// @route   POST /api/auth/refresh-token
// @access  Public
export const refreshAccessToken = catchAsync(async (req, res, next) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    throw new AppError("Refresh token is required", 400);
  }

  // Verify refresh token
  const decoded = verifyRefreshToken(refreshToken);

  // Find user
  const user = await User.findById(decoded.userId);
  if (!user) {
    throw new AppError("User not found", 404);
  }

  // Check if refresh token exists in database
  const tokenExists = user.refreshTokens.some(
    (rt) => rt.token === refreshToken
  );
  if (!tokenExists) {
    throw new AppError("Refresh token is invalid or has been revoked", 401);
  }

  // Generate new access token
  const newAccessToken = generateAccessToken(user._id);

  return res.status(200).json({
    success: true,
    message: "Access token refreshed successfully",
    data: {
      accessToken: newAccessToken,
    },
  });
});

// @desc    Logout user (revoke refresh token)
// @route   POST /api/auth/logout
// @access  Private
export const logout = catchAsync(async (req, res, next) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    throw new AppError("Refresh token is required", 400);
  }

  // Find user and remove refresh token
  const user = await User.findByIdAndUpdate(
    req.userId,
    {
      $pull: { refreshTokens: { token: refreshToken } },
    },
    { new: true }
  );

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return res.status(200).json({
    success: true,
    message: "Logout successful",
  });
});

// @desc    Logout from all devices (revoke all refresh tokens)
// @route   POST /api/auth/logout-all
// @access  Private
export const logoutAll = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.userId,
    {
      refreshTokens: [],
    },
    { new: true }
  );

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return res.status(200).json({
    success: true,
    message: "Logged out from all devices successfully",
  });
});

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
export const getCurrentUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.userId);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return res.status(200).json({
    success: true,
    data: {
      user: user.toJSON(),
    },
  });
});

// @desc    Google OAuth callback
// @route   POST /api/auth/google-callback
// @access  Public
export const googleCallback = catchAsync(async (req, res, next) => {
  const { googleId, email, name, profilePicture } = req.body;

  if (!googleId || !email) {
    throw new AppError("Google ID and email are required", 400);
  }

  // Find or create user
  let user = await User.findOne({
    $or: [{ googleId }, { email: email.toLowerCase() }],
  });

  if (!user) {
    // Create new user with Google
    user = await User.create({
      name: name || email.split("@")[0],
      email: email.toLowerCase(),
      googleId,
      profilePicture: profilePicture || null,
      authProvider: "google",
      isVerified: true, // Google verified
    });
  } else if (!user.googleId) {
    // Link Google account to existing email user
    user.googleId = googleId;
    user.authProvider = "google";
    user.profilePicture = profilePicture || user.profilePicture;
    await user.save();
  }

  // Generate tokens
  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  // Save refresh token
  user.refreshTokens.push({ token: refreshToken });
  await user.save();

  return res.status(200).json({
    success: true,
    message: "Google login successful",
    data: {
      user: user.toJSON(),
      accessToken,
      refreshToken,
    },
  });
});
