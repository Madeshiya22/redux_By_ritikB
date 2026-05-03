import { useEffect, useMemo, useState } from "react";
import { ArrowRight, CircleAlert, Eye, EyeOff, Mail } from "lucide-react";
import { useLoginMutation, useRegisterMutation } from "../hooks/useAuth";
import AuthBanner from "../components/auth/AuthBanner";
import AuthField from "../components/auth/AuthField";
import AuthHeader from "../components/auth/AuthHeader";
import AuthTabs from "../components/auth/AuthTabs";
import AuthSocialButtons from "../components/auth/AuthSocialButtons";

const googleAuthUrl = import.meta.env.VITE_AUTH_GOOGLE_URL || "http://localhost:3001/api/auth/google";

const fieldConfig = {
  login: [
    {
      name: "email",
      label: "Email",
      type: "email",
      placeholder: "you@example.com",
      autoComplete: "email",
      icon: <Mail size={16} />,
      variant: "icon",
    },
    {
      name: "password",
      label: "Password",
      type: "password",
      placeholder: "Enter password",
      autoComplete: "current-password",
      variant: "password",
    },
  ],
  register: [
    {
      name: "name",
      label: "Name",
      type: "text",
      placeholder: "Your name",
      autoComplete: "name",
      variant: "plain",
    },
    {
      name: "email",
      label: "Email",
      type: "email",
      placeholder: "you@example.com",
      autoComplete: "email",
      icon: <Mail size={16} />,
      variant: "icon",
    },
    {
      name: "password",
      label: "Password",
      type: "password",
      placeholder: "Enter password",
      autoComplete: "new-password",
      variant: "password",
    },
    {
      name: "confirmPassword",
      label: "Confirm password",
      type: "password",
      placeholder: "Confirm password",
      autoComplete: "new-password",
      variant: "plain",
    },
  ],
};

const AuthPage = () => {
  const [mode, setMode] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });

  useEffect(() => {
    document.body.classList.add("auth-page");

    return () => {
      document.body.classList.remove("auth-page");
    };
  }, []);

  const loginMutation = useLoginMutation();
  const registerMutation = useRegisterMutation();
  const activeMutation = mode === "login" ? loginMutation : registerMutation;

  const errorMessage = useMemo(() => {
    return activeMutation.error?.response?.data?.message || activeMutation.error?.message || "";
  }, [activeMutation.error]);

  const renderField = (field) => {
    const value = form[field.name];

    return (
      <AuthField key={field.name} label={field.label} compact={field.variant === "plain"}>
        {field.variant === "password" ? (
          <div className="auth-input-wrap">
            <input
              name={field.name}
              type={showPassword ? "text" : "password"}
              value={value}
              onChange={handleChange}
              placeholder={field.placeholder}
              autoComplete={field.autoComplete}
            />
            <button type="button" className="icon-button" onClick={() => setShowPassword((current) => !current)}>
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        ) : field.variant === "icon" ? (
          <div className="auth-input-wrap">
            {field.icon}
            <input
              name={field.name}
              type={field.type}
              value={value}
              onChange={handleChange}
              placeholder={field.placeholder}
              autoComplete={field.autoComplete}
            />
          </div>
        ) : (
          <div className="auth-input-wrap auth-input-wrap--plain">
            <input
              name={field.name}
              type={field.type}
              value={value}
              onChange={handleChange}
              placeholder={field.placeholder}
              autoComplete={field.autoComplete}
            />
          </div>
        )}
      </AuthField>
    );
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (mode === "login") {
      loginMutation.mutate({ email: form.email, password: form.password });
      return;
    }

    registerMutation.mutate({
      name: form.name,
      email: form.email,
      password: form.password,
      confirmPassword: form.confirmPassword,
    });
  };

  const switchMode = (nextMode) => {
    setMode(nextMode);
    setForm({ name: "", email: "", password: "", confirmPassword: "" });
    loginMutation.reset();
    registerMutation.reset();
    setShowPassword(false);
  };

  const fields = fieldConfig[mode];

  return (
    <div className="auth-shell">
      <div className="auth-glow auth-glow-left" />
      <div className="auth-glow auth-glow-right" />

      <div className={mode === "register" ? "auth-card auth-card--register" : "auth-card auth-card--login"}>
        <AuthBanner />
        <AuthHeader mode={mode} />
        <AuthTabs mode={mode} onChange={switchMode} />

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className={mode === "register" ? "auth-grid auth-grid-register" : "auth-grid"}>
            {fields.map(renderField)}
          </div>

          {errorMessage && (
            <div className="auth-error">
              <CircleAlert size={16} />
              <span>{errorMessage}</span>
            </div>
          )}

          <button className="auth-submit" type="submit" disabled={activeMutation.isPending}>
            {activeMutation.isPending ? "Please wait..." : mode === "login" ? "Login" : "Create account"}
            <ArrowRight size={16} />
          </button>

          <div className="auth-divider">
            <span>or continue with</span>
          </div>

          <AuthSocialButtons onGoogleClick={() => (window.location.href = googleAuthUrl)} />
        </form>

        <p className="auth-footer-note">
          {mode === "login" ? "No account yet?" : "Already have an account?"}
          <button type="button" className="text-button" onClick={() => switchMode(mode === "login" ? "register" : "login")}>
            {mode === "login" ? "Register now" : "Back to login"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
