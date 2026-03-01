export interface AuthFormData {
  email: string;
  password: string;
  name?: string;
}

export interface AuthResponse {
  success: boolean;
  data?: any;
  token?: string;
  error?: string;
} 