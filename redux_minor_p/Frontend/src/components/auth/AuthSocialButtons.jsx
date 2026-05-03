import { GitBranch } from "lucide-react";

const AuthSocialButtons = ({ onGoogleClick, googleLabel = "Continue with Google" }) => {
  return (
    <div className="auth-social-row">
      <button className="social-button google" type="button" onClick={onGoogleClick}>
        <svg viewBox="0 0 48 48" aria-hidden="true">
          <path fill="#FFC107" d="M43.6 20.4H42V20H24v8h11.3C33.7 32.6 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.7 1.1 7.8 2.9l5.6-5.6C34 6 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.5-.4-3.6z" />
          <path fill="#FF3D00" d="M6.3 14.7l6.5 4.8C14.5 16 18.8 12 24 12c3 0 5.7 1.1 7.8 2.9l5.6-5.6C34 6 29.3 4 24 4c-7.7 0-14.4 4.3-17.7 10.7z" />
          <path fill="#4CAF50" d="M24 44c5.2 0 10-2 13.6-5.2l-6.3-5.3C29.4 35.2 26.9 36 24 36c-5.2 0-9.7-3.4-11.3-8.1l-6.4 4.9C9.5 40 16.1 44 24 44z" />
          <path fill="#1976D2" d="M43.6 20.4H42V20H24v8h11.3c-1.1 3-3.2 5.5-5.9 7.1l.1.1 6.3 5.3C35.4 39.8 44 33.6 44 24c0-1.3-.1-2.5-.4-3.6z" />
        </svg>
        {googleLabel}
      </button>
      <button className="social-button ghost" type="button">
        <span className="social-mark">
          <GitBranch size={11} />
        </span>
        GitHub soon
      </button>
    </div>
  );
};

export default AuthSocialButtons;
