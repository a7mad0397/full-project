// src/pages/Register.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // أضفنا useNavigate

export default function Register() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false); // حالة التحميل
  const [apiError, setApiError] = useState(""); // خطأ من السيرفر

  const validate = () => {
    const newErrors = {};
    if (!username.trim()) {
      newErrors.username = "Username is required";
    } else if (username.trim().length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // --- الربط مع الباك إيند هنا ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setApiError("");

    try {
      const response = await fetch("http://127.0.0.1:8000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          email: email,
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // إذا نجح التسجيل، ننتقل لصفحة تسجيل الدخول
        alert("Account created successfully! Please sign in.");
        navigate("/login");
      } else {
        // عرض الخطأ (مثل: الإيميل موجود مسبقاً)
        setApiError(data.detail || "Registration failed. Try again.");
      }
    } catch (error) {
      setApiError("Network error. Please check if the backend is running.");
      console.error("Register Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        {/* Left side يبقى كما هو */}
        <div className="auth-side">
            {/* ... كود الـ Brand و Side-text ... */}
        </div>

        {/* Right side (form) */}
        <div className="auth-main">
          <div className="auth-header">
            <h1>Create Account</h1>
            <p>Enter your details to sign up</p>
          </div>

          {/* عرض خطأ السيرفر إذا وجد */}
          {apiError && <p style={{ color: "#ff4d4d", marginBottom: "15px" }}>{apiError}</p>}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="field">
              <label className="field-label">Username</label>
              <input
                type="text"
                className={`field-input ${errors.username ? "field-input-error" : ""}`}
                placeholder="e.g. raed_crypto"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              {errors.username && <span className="error-text">{errors.username}</span>}
            </div>

            <div className="field">
              <label className="field-label">Email Address</label>
              <input
                type="email"
                className={`field-input ${errors.email ? "field-input-error" : ""}`}
                placeholder="example@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>

            <div className="field">
              <label className="field-label">Password</label>
              <input
                type="password"
                className={`field-input ${errors.password ? "field-input-error" : ""}`}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {errors.password && <span className="error-text">{errors.password}</span>}
            </div>

            <button type="submit" className="primary-btn" disabled={isSubmitting}>
              {isSubmitting ? "Creating Account..." : "Register"}
            </button>
          </form>

          <p className="auth-footer-text">
            Already have an account?{" "}
            <Link to="/login" className="link">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}