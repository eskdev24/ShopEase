import { supabase } from "@/lib/supabase";

// User type
export interface User {
  id: string;
  email: string;
  name: string;
}

class AuthService {
  // Login method using Supabase
  async login(email: string, password: string): Promise<User> {
    if (!email || !password) {
      throw new Error("Email and password are required");
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new Error(error.message);
    }

    if (!data.user) {
      throw new Error("Login failed");
    }

    // Get user profile from the profiles table
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("name")
      .eq("id", data.user.id)
      .single();

    if (profileError) {
      console.error("Error fetching user profile:", profileError);
    }

    return {
      id: data.user.id,
      email: data.user.email || "",
      name: profileData?.name || email.split("@")[0], // Fallback to email username if no name
    };
  }

  // Signup method using Supabase
  async signup(name: string, email: string, password: string): Promise<User> {
    if (!name || !email || !password) {
      throw new Error("All fields are required");
    }

    if (password.length < 6) {
      throw new Error("Password must be at least 6 characters");
    }

    // Register the user with Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    });

    if (error) {
      throw new Error(error.message);
    }

    if (!data.user) {
      throw new Error("Signup failed");
    }

    // Create a profile record in the profiles table
    const { error: profileError } = await supabase.from("profiles").insert([
      {
        id: data.user.id,
        name,
        email,
      },
    ]);

    if (profileError) {
      console.error("Error creating user profile:", profileError);
    }

    return {
      id: data.user.id,
      email: data.user.email || "",
      name,
    };
  }

  // Logout method using Supabase
  async logout(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error during logout:", error);
    }
  }

  // Get current user using Supabase
  async getCurrentUser(): Promise<User | null> {
    const { data } = await supabase.auth.getUser();

    if (!data.user) {
      return null;
    }

    // Get user profile from the profiles table
    const { data: profileData } = await supabase
      .from("profiles")
      .select("name")
      .eq("id", data.user.id)
      .single();

    return {
      id: data.user.id,
      email: data.user.email || "",
      name: profileData?.name || data.user.email?.split("@")[0] || "",
    };
  }

  // Check if user is authenticated
  async isUserAuthenticated(): Promise<boolean> {
    const { data } = await supabase.auth.getSession();
    return !!data.session;
  }
}

// Export a singleton instance
export const authService = new AuthService();
