"use client";

import { useState, useEffect } from "react";
import { useAuthContext } from "@/context/AuthContext";

interface StyleType {
  style?: boolean;
}

const InstructorSettingProfile = ({ style }: StyleType) => {
  const { user, updateProfile, loading: authLoading } = useAuthContext();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    dateOfBirth: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      let safeDate = "";
      if (user.dateOfBirth) {
        const parsed = new Date(user.dateOfBirth);
        if (!isNaN(parsed.getTime())) {
          safeDate = parsed.toISOString().slice(0, 10);
        }
      }

      setFormData({
        username: user.username || "",
        email: user.email || "",
        dateOfBirth: safeDate,
      });
    }
  }, [user]);

  if (authLoading) return <p>Loading user...</p>;
  if (!user)
    return <p style={{ color: "red" }}>User not found. Please log in.</p>;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(null);

    try {
      await updateProfile(user._id || user.id, formData);
      setSuccess("✅ Profile updated successfully!");
    } catch (err) {
      console.error("Error updating profile:", err);
      setSuccess("❌ Error updating profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="account__form">
      <div className="form-grp">
        <label>Username</label>
        <input
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-grp">
        <label>Email</label>
        <input
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-grp">
        <label>Date of Birth</label>
        <input
          type="date"
          name="dateOfBirth"
          value={formData.dateOfBirth || ""}
          onChange={handleChange}
        />
      </div>

      <button
        type="submit"
        className={`btn ${style ? "btn-two" : "btn-three"} arrow-btn`}
        disabled={loading}
      >
        {loading ? "Updating..." : "Save Changes"}
      </button>

      {success && (
        <p
          style={{
            color: success.startsWith("✅") ? "green" : "red",
            marginTop: "10px",
          }}
        >
          {success}
        </p>
      )}
    </form>
  );
};

export default InstructorSettingProfile;
