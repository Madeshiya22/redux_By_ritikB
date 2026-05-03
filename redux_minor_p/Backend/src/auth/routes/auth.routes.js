import express from "express";
import {
  register,
  login,
  refreshAccessToken,
  logout,
  logoutAll,
  getCurrentUser,
  googleCallback,
} from "../controllers/auth.controller.js";
import { authenticateToken } from "../middleware/jwt.middleware.js";
import passport from "passport";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../utils/jwt.utils.js";

const router = express.Router();

// Public routes
router.post("/register", register);
router.post("/login", login);
router.post("/refresh-token", refreshAccessToken);
router.post("/google-callback", googleCallback);

// Google OAuth routes
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"], session: false })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login", session: false }),
  async (req, res) => {
    try {
      const user = req.user;

      // Generate tokens
      const accessToken = generateAccessToken(user._id);
      const refreshToken = generateRefreshToken(user._id);

      // Save refresh token
      user.refreshTokens.push({ token: refreshToken });
      await user.save();

      // Redirect to frontend with tokens
      const redirectUrl = `${process.env.FRONTEND_URL || "http://localhost:3000"}/auth/callback?accessToken=${accessToken}&refreshToken=${refreshToken}&userId=${user._id}`;
      res.redirect(redirectUrl);
    } catch (error) {
      res.redirect(
        `${process.env.FRONTEND_URL || "http://localhost:3000"}/login?error=authentication_failed`
      );
    }
  }
);

// Private routes (require authentication)
router.post("/logout", authenticateToken, logout);
router.post("/logout-all", authenticateToken, logoutAll);
router.get("/me", authenticateToken, getCurrentUser);

export default router;
