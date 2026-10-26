
import { useState } from "react";
import {
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Sparkles,
  ArrowRight,
  UserRound,
} from "lucide-react";

import { loginUser, registerUser } from "../services/authApi";
import "./Login.css";

function Login({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (isRegister && !name.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

    if (isRegister && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (isRegister && password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    try {
      setLoading(true);

      if (isRegister) {
        await registerUser(name.trim(), email.trim(), password);
      } else {
        await loginUser(email.trim(), password);
      }

        onLogin({ isNewUser: isRegister });
        } catch (err) {
      setError(
        err.message ||
          (isRegister
            ? "Registration failed. Please try again."
            : "Invalid email or password.")
      );
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setIsRegister(!isRegister);
    setError("");
    setPassword("");
    setConfirmPassword("");
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  return (
    <main className="login-page">
      <div className="login-glow login-glow-one"></div>
      <div className="login-glow login-glow-two"></div>

      <div className="login-brand">
        <div className="login-brand-icon">
          <Sparkles size={17} />
        </div>
        <span>Placement Copilot</span>
      </div>

      <section className="login-card">
        <div className="login-header">
          <div className="login-eyebrow">
            <span></span>
            AI-POWERED PLACEMENT PREP
          </div>

          <h1>{isRegister ? "Create your account." : "Welcome back."}</h1>

          <p>
            {isRegister
              ? "Start your personalized journey toward your dream role."
              : "Continue your journey toward landing your dream role."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {isRegister && (
            <div className="form-group">
              <label htmlFor="name">Full name</label>
              <div className="input-wrapper">
                <UserRound size={17} />
                <input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  autoComplete="name"
                  required
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email address</label>
            <div className="input-wrapper">
              <Mail size={17} />
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="off"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <div className="password-label-row">
              <label htmlFor="password">Password</label>
            </div>

            <div className="input-wrapper">
              <LockKeyhole size={17} />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder={
                  isRegister ? "Create a password" : "Enter your password"
                }
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete={
                  isRegister ? "new-password" : "current-password"
                }
                required
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </div>

          {isRegister && (
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm password</label>
              <div className="input-wrapper">
                <LockKeyhole size={17} />
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={(event) =>
                    setConfirmPassword(event.target.value)
                  }
                  autoComplete="new-password"
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff size={17} />
                  ) : (
                    <Eye size={17} />
                  )}
                </button>
              </div>
            </div>
          )}

          {error && (
            <div className="login-error" role="alert">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >
            {loading ? (
              isRegister ? "Creating account..." : "Signing in..."
            ) : (
              <>
                {isRegister ? "Create account" : "Sign in"}
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <div className="auth-switch">
          <span>
            {isRegister
              ? "Already have an account?"
              : "New to Placement Copilot?"}
          </span>
          <button type="button" onClick={switchMode}>
            {isRegister ? "Sign in" : "Create account"}
          </button>
        </div>

        <div className="login-trust">
          <Sparkles size={13} />
          <span>Your personalized placement workspace</span>
        </div>
      </section>

      <p className="login-footer">
        Placement Copilot · AI-powered career preparation
      </p>
    </main>
  );
}

export default Login;
