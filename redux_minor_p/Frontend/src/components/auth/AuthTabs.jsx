const tabs = [
  { key: "login", label: "Login" },
  { key: "register", label: "Register" },
];

const AuthTabs = ({ mode, onChange }) => {
  return (
    <div className="auth-tabs">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          className={mode === tab.key ? "auth-tab active" : "auth-tab"}
          onClick={() => onChange(tab.key)}
          type="button"
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default AuthTabs;
