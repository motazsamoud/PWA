// src/models/user.model.ts

/**
 * 🎯 Modèle TypeScript aligné sur le schéma Mongoose du backend.
 * Il reflète exactement les propriétés exposées par ton API NestJS.
 */

export type Role = "admin" | "etudiant" | "enseignant" | "recruteur";

/**
 * Représente un utilisateur complet retourné par le backend.
 */
export interface User {
  _id?: string; // Mongoose natif
  id?: string;  // utile pour la compatibilité front
  email: string;
  password?: string;
  username: string;
  dateOfBirth: string | Date;
  status?: string;
  otp?: string | null;
  otpExpires?: string | Date | null;
  role: Role;
  tempPassword?: string;
  tempPasswordExpires?: string | Date;
  portfolio?: {
    titre: string;
    lien?: string;
    description?: string;
    profileImage?: string | null;
  coverImage?: string | null;
  }[];
}


/**
 * ==============================
 * 🔐 Types de réponses API
 * ==============================
 */

export interface LoginResponse {
  access_token: string;
  user: User;
}

export interface MessageResponse {
  message: string;
}

export interface VerifyOtpResponse {
  success?: boolean;
  message: string;
}

export interface VerifyTempPasswordResponse {
  success: boolean;
  message: string;
}

export interface UpdatePasswordResponse {
  message: string;
}

export interface CheckStatusResponse {
  status: string;
}

export interface VerifyDiplomaResponse {
  verified: boolean;
  extractedText: string;
}
