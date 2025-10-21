"use client";

import { useState } from "react";
import BtnArrow from "@/svg/BtnArrow";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/context/AuthContext"; // ✅ utilise le contexte global

const RegistrationForm = () => {
  const router = useRouter();
  const { signup, error } = useAuthContext(); // ✅ vient du contexte partagé

  // Champs du formulaire
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("etudiant");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("❌ Passwords do not match!");
      return;
    }

    setIsSubmitting(true);
    setSuccessMessage(null);

    try {
      const username = `${firstName.trim()} ${lastName.trim()}`.trim();

      const res = await signup({
        email,
        password,
        username,
        dateOfBirth,
        role,
      });

      if (res) {
        setSuccessMessage("✅ Account created successfully! Redirecting...");
        setTimeout(() => router.push("/login"), 2000);
      }
    } catch (err) {
      console.error("❌ Signup failed:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="account__form">
      <div className="row gutter-20">
        <div className="col-md-6">
          <div className="form-grp">
            <label htmlFor="fast-name">First Name</label>
            <input
              type="text"
              id="fast-name"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="col-md-6">
          <div className="form-grp">
            <label htmlFor="last-name">Last Name</label>
            <input
              type="text"
              id="last-name"
              placeholder="Last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
        </div>
      </div>

      <div className="form-grp">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="form-grp">
        <label htmlFor="dob">Date of Birth</label>
        <input
          type="date"
          id="dob"
          value={dateOfBirth}
          onChange={(e) => setDateOfBirth(e.target.value)}
          required
        />
      </div>

      <div className="form-grp">
        <label htmlFor="role">Role</label>
        <select
          id="role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="form-select"
        >
          <option value="etudiant">Student</option>
          <option value="enseignant">Instructor</option>
          <option value="recruteur">Recruiter</option>
        </select>
      </div>

      <div className="form-grp">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <div className="form-grp">
        <label htmlFor="confirm-password">Confirm Password</label>
        <input
          type="password"
          id="confirm-password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
      </div>

      <button
        type="submit"
        className="btn btn-two arrow-btn"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Creating Account..." : "Sign Up"} <BtnArrow />
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

export default RegistrationForm;
