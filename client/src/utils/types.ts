export interface UserDocument {
  fileName: string;
  filePath: string;
  fileType: string; // pdf, docx, jpg, png
  uploadedBy: string; // userId
  uploadedAt: string; // ISO date string
}

export interface User {
  _id?: string;
  email: string;
  name: string;
  password?: string; // optional because we never fetch it
  role: "admin" | "hr" | "employee" | "candidate";
  emailVerified: boolean;
  verificationToken?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: string;
  refreshToken?: string;
  lastLogin?: string;
  lastLoginIP?: string;
  documents?: UserDocument[];
  createdAt?: string;
  updatedAt?: string;
}


// Define Auth state
export interface AuthState {
  userData: User;
}
export interface Job {
  _id?: string;
  title: string;
  description?: string;
  department?: string;
  location?: string;
  postedBy?: string; // userId
  isActive?: boolean;
  salary?: number;
  tags?: string[];
  experienceRequired?: string;
  jobType?: "full-time" | "part-time" | "internship";
  createdAt?: string;
  updatedAt?: string;
}
export interface userData {
  email?: string;
  password?: string;
  role?: string;
  name?: string;
}
