// User Types
export interface User {
  id: string;
  email: string;
  name?: string;
  isVerified?: boolean;
}

// Auth Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  confirmPassword: string;
  name?: string;
}

export interface ResetPasswordData {
  token: string;
  password: string;
  confirmPassword: string;
}

// Chat Types
export interface Message {
  id: string;
  content: string;
  isUser: boolean;
  createdAt: string;
  sessionId: string;
}

export interface Session {
  id: string;
  name: string;
  folderId?: string;
  createdAt: string;
  lastMessage?: string;
  messageCount?: number;
}

export interface Folder {
  id: string;
  name: string;
  createdAt: string;
  sessionCount?: number;
}

// PDF Types
export interface PDFDocument {
  id: string;
  name: string;
  size: number;
  uploadedAt: string;
  url: string;
}

export interface PDFQuestion {
  id: string;
  question: string;
  answer: string;
  documentId: string;
  createdAt: string;
}