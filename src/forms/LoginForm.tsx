"use client";

import { useState } from "react";
import BtnArrow from "@/svg/BtnArrow";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/context/AuthContext"; // ✅ utilise le contexte global

const LoginForm = () => {
  const router = useRouter();
  const { login, error } = useAuthContext(); // ✅ récupère depuis le contexte

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage(null);

    try {
      const res = await login(email, password);

      if (res && res.access_token) {
        setSuccessMessage("✅ Login successful! Redirecting...");
        if (remember) localStorage.setItem("rememberedEmail", email);

        // ✅ Redirection selon rôle utilisateur
        const role = res.user?.role;
        if (role === "etudiant") router.push("/student-dashboard");
        else if (role === "enseignant") router.push("/instructor-dashboard");
        else if (role === "admin") router.push("/admin");
        else router.push("/");
      }
    } catch (err) {
      console.error("❌ Login failed:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="account__form">
      <div className="form-grp">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="form-grp">
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <div className="account__check">
        <div className="account__check-remember">
          <input
            type="checkbox"
            className="form-check-input"
            id="terms-check"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
          />
          <label htmlFor="terms-check" className="form-check-label">
            Remember me
          </label>
        </div>
        <div className="account__check-forgot">
          <Link href="/registration">Forgot Password?</Link>
        </div>
      </div>

      <button
        type="submit"
        className="btn btn-two arrow-btn"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Signing in..." : "Sign In"} <BtnArrow />
      </button>

      {/* Messages d’état */}
      {error && (
        <p className="text-danger mt-2" style={{ color: "red" }}>
          ❌ {error}
        </p>
      )}
      {successMessage && (
        <p className="text-success mt-2" style={{ color: "green" }}>
          {successMessage}
        </p>
      )}
    </form>
  );
};

export default LoginForm;
