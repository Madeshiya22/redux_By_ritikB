import { Sparkles } from "lucide-react";

const AuthBanner = () => {
  return (
    <div className="auth-badge">
      <Sparkles size={14} />
      Secure auth flow
    </div>
  );
};

export default AuthBanner;
