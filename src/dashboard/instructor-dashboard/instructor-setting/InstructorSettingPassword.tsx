"use client";

import { useState } from "react";
import { useAuthContext } from "@/context/AuthContext"; // ton contexte global
import { toast } from "react-hot-toast"; // tu peux installer avec: npm i react-hot-toast

const InstructorSettingPassword = () => {
  const { user, updatePassword } = useAuthContext();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error("You must be logged in.");
      return;
    }

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("All fields are required.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }

    if (newPassword === currentPassword) {
      toast.error("New password must be different from current password.");
      return;
    }

    try {
      setLoading(true);
      const msg = await updatePassword(user.id || user._id, newPassword);
      toast.success(msg || "Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      toast.error("Failed to update password. Please try again.");
      console.error("Update password error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="instructor__profile-form-wrap">
      <form onSubmit={handleSubmit} className="instructor__profile-form">
        <div className="form-grp">
          <label htmlFor="currentpassword">Current Password</label>
          <input
            id="currentpassword"
            type="password"
            placeholder="Current Password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
        </div>
        <div className="form-grp">
          <label htmlFor="newpassword">New Password</label>
          <input
            id="newpassword"
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>
        <div className="form-grp">
          <label htmlFor="repassword">Re-Type New Password</label>
          <input
            id="repassword"
            type="password"
            placeholder="Re-Type New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <div className="submit-btn mt-25">
          <button
            type="submit"
            className="btn"
            disabled={loading}
            style={{
              opacity: loading ? 0.7 : 1,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default InstructorSettingPassword;
