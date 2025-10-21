"use client";

import { useState, useEffect } from "react";
import { userApi } from "@/lib/userApi";
import { getItem, setItem, removeItem } from "@/lib/localstorage";
import {
  User,
  LoginResponse,
  MessageResponse,
  VerifyOtpResponse,
  VerifyTempPasswordResponse,
  UpdatePasswordResponse,
  CheckStatusResponse,
  VerifyDiplomaResponse,
} from "@/modals/user.model";

/**
 * 🔁 Hook d’authentification global
 * Gère : connexion, déconnexion, OTP, mot de passe, profil, statut et diplôme.
 */
export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // =====================================================
  // 🧠 INITIALISATION — Recharger la session au démarrage
  // =====================================================
  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedUser = getItem("user");
        const token =
          getItem("token") ||
          document.cookie
            .split("; ")
            .find((row) => row.startsWith("token="))
            ?.split("=")[1];

        if (storedUser && typeof storedUser === "string") {
          try {
            const parsed = JSON.parse(storedUser);
            setUser(parsed);

            // 🔁 Si on a un token et un ID valide → recharger depuis backend
            if (token && parsed?.id) {
              try {
                const fresh = await userApi.findById(parsed.id);
                setItem("user", JSON.stringify(fresh));

                if (fresh) {
                  setUser(fresh);
                  setItem("user", JSON.stringify(fresh));
                }
              } catch (err) {
                console.warn("⚠️ Impossible de rafraîchir le profil :", err);
                removeItem("token");
                removeItem("user");
                document.cookie = "token=; path=/; max-age=0;";
                setUser(null);
              }
            }
          } catch {
            console.warn("⚠️ Invalid user data in localStorage. Resetting...");
            removeItem("user");
          }
        } else if (token) {
          // 🔁 Si pas de user mais token présent → on récupère l’utilisateur
          try {
            const payload = JSON.parse(atob(token.split(".")[1]));
            const userId = payload?.id;
            if (userId) {
              const fetchedUser = await userApi.findById(userId);
              if (fetchedUser) {
                setUser(fetchedUser);
                setItem("user", JSON.stringify(fetchedUser));
              }
            }
          } catch {
            console.warn("⚠️ Token invalide ou expiré.");
            removeItem("token");
            document.cookie = "token=; path=/; max-age=0;";
          }
        }
      } catch (err) {
        console.error("❌ Auth initialization failed:", err);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // =====================================================
  // 🔐 AUTHENTIFICATION
  // =====================================================
  async function signup(data: {
    email: string;
    password?: string;
    username: string;
    dateOfBirth?: string;
    role: string;
  }): Promise<MessageResponse | void> {
    try {
      setError(null);
      const res = await userApi.signup(data);
      return res;
    } catch (err: any) {
      handleError(err);
    }
  }

  async function login(email: string, password: string): Promise<LoginResponse | void> {
    try {
      setError(null);
      const res = await userApi.login({ email, password });

      // ✅ Stockage local + cookie (pour middleware)
      setItem("token", res.access_token);
      setItem("user", JSON.stringify(res.user));
      document.cookie = `token=${res.access_token}; path=/; max-age=3600; Secure; SameSite=Strict`;

      setUser(res.user);
      return res;
    } catch (err: any) {
      handleError(err);
    }
  }

  async function logout(): Promise<void> {
    try {
      const token = getItem("token");
      if (token) await userApi.logout(token);
    } catch {
      // aucune importance
    } finally {
      removeItem("token");
      removeItem("user");
      document.cookie = "token=; path=/; max-age=0;";
      setUser(null);
    }
  }

  // =====================================================
  // 📬 OTP MANAGEMENT
  // =====================================================
  async function sendOtp(email: string): Promise<string | void> {
    try {
      const res = await userApi.sendOtp(email);
      return res.message;
    } catch (err: any) {
      handleError(err);
    }
  }

  async function verifyOtp(
    identifier: string,
    otp: string,
    sendTemporaryPassword = false
  ): Promise<string | void> {
    try {
      const res = await userApi.verifyOtp({ identifier, otp, sendTemporaryPassword });
      return res.message;
    } catch (err: any) {
      handleError(err);
    }
  }

  async function resendOtp(email: string): Promise<string | void> {
    try {
      const res = await userApi.resendOtp(email);
      return res.message;
    } catch (err: any) {
      handleError(err);
    }
  }

  // =====================================================
  // 🔑 PASSWORD MANAGEMENT
  // =====================================================
  async function forgetPassword(email: string): Promise<string | void> {
    try {
      const res = await userApi.forgetPassword(email);
      return res.message;
    } catch (err: any) {
      handleError(err);
    }
  }

  async function verifyTempPassword(email: string, tempPassword: string): Promise<string | void> {
    try {
      const res = await userApi.verifyTempPassword({ email, tempPassword });
      return res.message;
    } catch (err: any) {
      handleError(err);
    }
  }

  async function updatePassword(userId: string, newPassword: string): Promise<string | void> {
    try {
      const res = await userApi.updatePassword({ userId, newPassword });
      return res.message;
    } catch (err: any) {
      handleError(err);
    }
  }

  // =====================================================
  // 👤 USER MANAGEMENT
  // =====================================================
  async function updateProfile(id: string, data: Record<string, any>): Promise<User | void> {
    try {
      const res = await userApi.updateProfile(id, data);

      if (user && (user._id === id || user.id === id)) {
        const updatedUser = { ...user, ...data };
        setUser(updatedUser);
        setItem("user", JSON.stringify(updatedUser));
      }
      return res;
    } catch (err: any) {
      handleError(err);
    }
  }

  async function updateRole(id: string, role: string): Promise<User | void> {
    try {
      const res = await userApi.updateRole(id, role);
      return res;
    } catch (err: any) {
      handleError(err);
    }
  }

  async function updateStatus(id: string, status: string): Promise<User | void> {
    try {
      const res = await userApi.updateStatus(id, status);
      return res;
    } catch (err: any) {
      handleError(err);
    }
  }

  async function addPortfolio(
    id: string,
    project: { titre: string; lien?: string; description?: string }
  ): Promise<User | void> {
    try {
      const res = await userApi.addPortfolio(id, project);
      return res;
    } catch (err: any) {
      handleError(err);
    }
  }

  async function checkStatus(identifier: string): Promise<string | void> {
    try {
      const res = await userApi.checkStatus(identifier);
      return res.status;
    } catch (err: any) {
      handleError(err);
    }
  }

  async function getAllUsers(): Promise<User[] | void> {
    try {
      const res = await userApi.getAll();
      return res;
    } catch (err: any) {
      handleError(err);
    }
  }

  // =====================================================
  // 🎓 DIPLOMA VERIFICATION
  // =====================================================
  async function verifyDiploma(imageBase64: string, lang: string): Promise<VerifyDiplomaResponse | void> {
    try {
      const res = await userApi.verifyDiploma({ imageBase64, lang });
      return res;
    } catch (err: any) {
      handleError(err);
    }
  }

  // =====================================================
  // ⚙️ HELPERS
  // =====================================================
  function handleError(err: any): void {
    console.error("❌ API Error:", err.response?.data || err.message);
    setError(err.response?.data?.message || "Something went wrong");
    throw err;
  }
  async function uploadProfileImage(file: File): Promise<void> {
    if (!user?._id && !user?.id) return;
    const id = user._id || user.id!;
    const updated = await userApi.uploadProfileImage(id, file);
    setUser(updated);
    setItem("user", JSON.stringify(updated));
  }

  async function uploadCoverImage(file: File): Promise<void> {
    if (!user?._id && !user?.id) return;
    const id = user._id || user.id!;
    const updated = await userApi.uploadCoverImage(id, file);
    setUser(updated);
    setItem("user", JSON.stringify(updated));
  }

  // =====================================================
  // 🔄 RETOUR PUBLIC
  // =====================================================
  return {
    
    user,
    loading,
    error,
    // Auth
    signup,
    login,
    logout,
    // OTP
    sendOtp,
    verifyOtp,
    resendOtp,
    // Password
    forgetPassword,
    verifyTempPassword,
    updatePassword,
    // User
    updateProfile,
    updateRole,
    updateStatus,
    addPortfolio,
    checkStatus,
    getAllUsers,
    // Diploma
    verifyDiploma,
    uploadProfileImage,
uploadCoverImage,

  };
}
