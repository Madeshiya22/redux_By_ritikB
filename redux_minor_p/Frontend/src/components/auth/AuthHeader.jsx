const AuthHeader = ({ mode }) => {
  return (
    <div className="auth-hero">
      <p className="eyebrow">Redux Minor Project</p>
      <h1>{mode === "login" ? "Welcome back" : "Create your account"}</h1>
      <p className="auth-subtitle">
        Clean UI, JWT auth, refresh tokens, and Google login in one flow.
      </p>
    </div>
  );
};

export default AuthHeader;
