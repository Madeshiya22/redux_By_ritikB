import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { config } from "../../config/config.js";
import User from "../models/user.model.js";

export const configureGoogleStrategy = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: config.GOOGLE_CLIENT_ID,
        clientSecret: config.GOOGLE_CLIENT_SECRET,
        callbackURL: config.GOOGLE_CALLBACK_URL,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Check if user exists
          let user = await User.findOne({
            $or: [
              { googleId: profile.id },
              { email: profile.emails[0]?.value },
            ],
          });

          if (!user) {
            // Create new user
            user = await User.create({
              googleId: profile.id,
              name: profile.displayName,
              email: profile.emails[0]?.value,
              profilePicture: profile.photos[0]?.value,
              authProvider: "google",
              isVerified: true,
            });
          } else if (!user.googleId) {
            // Link Google account to existing user
            user.googleId = profile.id;
            user.authProvider = "google";
            user.profilePicture =
              profile.photos[0]?.value || user.profilePicture;
            user.isVerified = true;
            await user.save();
          }

          return done(null, user);
        } catch (error) {
          return done(error, null);
        }
      }
    )
  );

  // Serialize user
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  // Deserialize user
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });
};

export default configureGoogleStrategy;
