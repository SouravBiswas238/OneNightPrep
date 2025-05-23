import axios from "axios";

// Create axios instance with default config
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

// Set the token if available in localStorage
const token = localStorage.getItem("token");
if (token) {
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

// Response interceptor for handling errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle session expiration or invalid token
    if (error.response?.status === 401) {
      // Only redirect to login if not already there
      if (!window.location.pathname.includes("/login")) {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

// API functions for specific endpoints
export const authAPI = {
  login: (email: string, password: string) =>
    api.post("/login", { email, password }),

  register: (userData: { email: string; password: string; name?: string }) =>
    api.post("/signup", userData),

  forgotPassword: (email: string) => api.post("/forgot-password", { email }),

  verifyOTP: (email: string, otp: string) =>
    api.post("/verify-otp-password-recovery", { email, otp }),

  resetPassword: (token: string, password: string) =>
    api.post("/reset-password", { token, password }),

  sendVerificationEmail: () => api.post("/send-verification-otp"),

  verifyEmail: (otp: string) => api.post("/verify-user", { otp }),

  googleLogin: () => api.get("/google/login"),
};

export const chatAPI = {
  createSession: (name: string, folderId?: string) =>
    api.post("/session/sessions", { name, folder_id: folderId }),

  getSession: (sessionId: string) => api.get(`/session/sessions/${sessionId}`),

  getSessions: () => api.get("/session/sessions"),

  updateSession: (
    sessionId: string,
    data: { name?: string; folderId?: string }
  ) => api.put(`/session/sessions/${sessionId}`, data),

  deleteSession: (sessionId: string) =>
    api.delete(`/session/sessions/${sessionId}`),

  getMessages: (sessionId: string) =>
    api.get(`/session/sessions/${sessionId}/messages`),

  sendMessage: (sessionId: string, content: string) =>
    api.post(`/session/sessions/${sessionId}/messages`, { content }),
};

export const folderAPI = {
  createFolder: (name: string) => api.post("/folders", { name }),

  getFolders: () => api.get("/folders"),

  updateFolder: (folderId: string, name: string) =>
    api.put(`/folders/${folderId}`, { name }),

  deleteFolder: (folderId: string) => api.delete(`/folders/${folderId}`),
};

export const pdfAPI = {
  uploadPDF: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return api.post("/pdf/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  getPDFs: () => api.get("/pdf/list"),

  deletePDF: (fileId: string) => api.delete(`/pdf/${fileId}`),

  askQuestion: (fileId: string, question: string) =>
    api.post(`/pdf/${fileId}/ask`, { question }),
};
