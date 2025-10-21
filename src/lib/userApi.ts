// src/lib/userApi.ts
import axios from "axios";
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

const API_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_BASE_URL || "http://localhost:3000";

const api = axios.create({
  baseURL: `${API_BASE_URL}/user`,
  headers: { "Content-Type": "application/json" },
});

export const userApi = {
  // ---------------------------------------
  // 🔐 AUTHENTICATION
  // ---------------------------------------

  async signup(data: {
    email: string;
    password?: string;
    username: string;
    dateOfBirth?: string;
    role: string;
  }): Promise<MessageResponse> {
    const res = await api.post<MessageResponse>("/signup", data);
    return res.data;
  },

  async login(data: { email: string; password: string }): Promise<LoginResponse> {
    const res = await api.post<LoginResponse>("/login", data);
    return res.data;
  },

  async logout(token: string): Promise<MessageResponse> {
    const res = await api.post<MessageResponse>(
      "/logout",
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
  },

  // ---------------------------------------
  // 👤 USERS MANAGEMENT
  // ---------------------------------------

  async getAll(): Promise<User[]> {
    const res = await api.get<User[]>("/get");
    return res.data;
  },

  async findByEmail(email: string): Promise<User> {
    const res = await api.get<User>(`/find-by-email/${email}`);
    return res.data;
  },

  async findById(id: string): Promise<User> {
    const res = await api.get<User>(`/${id}`);
    return res.data;
  },

  async update(id: string, data: Record<string, any>): Promise<User> {
    const res = await api.patch<User>("/update", { id, ...data });
    return res.data;
  },

  async delete(id: string): Promise<MessageResponse> {
    const res = await api.delete<MessageResponse>(`/${id}`);
    return res.data;
  },

  // ---------------------------------------
  // 📬 OTP MANAGEMENT
  // ---------------------------------------

  async sendOtp(email: string): Promise<MessageResponse> {
    const res = await api.post<MessageResponse>("/send-otp", { email });
    return res.data;
  },

  async verifyOtp(data: {
    identifier: string;
    otp: string;
    sendTemporaryPassword?: boolean;
  }): Promise<VerifyOtpResponse> {
    const res = await api.post<VerifyOtpResponse>("/verify-otp", data);
    return res.data;
  },

  async resendOtp(email: string): Promise<MessageResponse> {
    const res = await api.post<MessageResponse>("/resend-otp", { email });
    return res.data;
  },

  // ---------------------------------------
  // 🔑 PASSWORD MANAGEMENT
  // ---------------------------------------

  async forgetPassword(email: string): Promise<MessageResponse> {
    const res = await api.post<MessageResponse>("/forget-password", { email });
    return res.data;
  },

  async verifyTempPassword(data: {
    email: string;
    tempPassword: string;
  }): Promise<VerifyTempPasswordResponse> {
    const res = await api.post<VerifyTempPasswordResponse>(
      "/verify-temp-password",
      data
    );
    return res.data;
  },

  async updatePassword(data: {
  userId: string;
  newPassword: string;
}): Promise<UpdatePasswordResponse> {
  const token = localStorage.getItem("token"); // ou getItem("token") de ton helper
  const res = await api.patch<UpdatePasswordResponse>(
    "/update-password",
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
},


  // ---------------------------------------
  // 🧩 STATUS & ROLE
  // ---------------------------------------

  async checkStatus(identifier: string): Promise<CheckStatusResponse> {
    const res = await api.post<CheckStatusResponse>("/status", { identifier });
    return res.data;
  },

  async updateRole(id: string, role: string): Promise<User> {
    const res = await api.patch<User>(`/${id}/role`, { role });
    return res.data;
  },

  async updateStatus(id: string, status: string): Promise<User> {
    const res = await api.patch<User>(`/${id}/status`, { status });
    return res.data;
  },

  // ---------------------------------------
  // 🧠 PROFILE MANAGEMENT
  // ---------------------------------------

  async updateProfile(id: string, data: Record<string, any>): Promise<User> {
    const res = await api.patch<User>(`/${id}/profile`, data);
    return res.data;
  },

  async addPortfolio(
    id: string,
    project: { titre: string; lien?: string; description?: string }
  ): Promise<User> {
    const res = await api.patch<User>(`/${id}/add-portfolio`, project);
    return res.data;
  },

  // ---------------------------------------
  // 🎓 DIPLOMA VERIFICATION
  // ---------------------------------------
// ---------------------------------------
// 🖼️ IMAGE UPLOADS
// ---------------------------------------

async uploadProfileImage(id: string, file: File): Promise<User> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await axios.patch<User>(
    `${API_BASE_URL}/user/${id}/upload-profile`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
  return res.data;
},

async uploadCoverImage(id: string, file: File): Promise<User> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await axios.patch<User>(
    `${API_BASE_URL}/user/${id}/upload-cover`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
  return res.data;
},

  async verifyDiploma(data: {
    imageBase64: string;
    lang: string;
  }): Promise<VerifyDiplomaResponse> {
    const res = await api.post<VerifyDiplomaResponse>("/verify-diploma", data);
    return res.data;
  },
};
