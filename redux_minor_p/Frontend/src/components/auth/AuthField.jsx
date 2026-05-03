const AuthField = ({ label, children, compact = false }) => {
  return (
    <div className={`auth-field ${compact ? "auth-field--compact" : ""}`}>
      <span>{label}</span>
      {children}
    </div>
  );
};

export default AuthField;
