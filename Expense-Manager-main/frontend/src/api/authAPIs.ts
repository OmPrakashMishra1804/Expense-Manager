import { AuthFormData, AuthResponse } from "../types/auth";

export async function REGISTER_USER(formData: AuthFormData): Promise<AuthResponse> {
  try {
    const res = await fetch(
      `${process.env.REACT_APP_BACKEND_BASE_URL}/auth/register`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      }
    );
    const data = await res.json();
    if (res.ok) {
      return data;
    }
    throw new Error(data.error || 'Registration failed');
  } catch (err) {
    console.error("Failed to register user:", err);
    throw err;
  }
}

export async function LOGIN_USER(formData: Omit<AuthFormData, 'name'>): Promise<AuthResponse> {
  try {
    const res = await fetch(
      `${process.env.REACT_APP_BACKEND_BASE_URL}/auth/login`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      }
    );
    const data = await res.json();
    if (res.ok) {
      return data;
    }
    throw new Error(data.error || 'Login failed');
  } catch (err) {
    console.error("Failed to login user:", err);
    throw err;
  }
}








