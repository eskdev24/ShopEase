// Mock user type
export interface User {
  id: string;
  email: string;
  name: string;
}

// Mock authentication service
class AuthService {
  private currentUser: User | null = null;
  private isAuthenticated: boolean = false;

  // Mock login method
  async login(email: string, password: string): Promise<User> {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Mock validation
    if (!email || !password) {
      throw new Error("Email and password are required");
    }

    if (password.length < 6) {
      throw new Error("Invalid credentials");
    }

    // Mock successful login
    const user: User = {
      id: "1",
      email,
      name: email.split("@")[0],
    };

    this.currentUser = user;
    this.isAuthenticated = true;

    // Store in localStorage to persist across page refreshes
    localStorage.setItem("user", JSON.stringify(user));

    return user;
  }

  // Mock signup method
  async signup(name: string, email: string, password: string): Promise<User> {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Mock validation
    if (!name || !email || !password) {
      throw new Error("All fields are required");
    }

    if (password.length < 6) {
      throw new Error("Password must be at least 6 characters");
    }

    // Mock successful registration
    const user: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name,
    };

    this.currentUser = user;
    this.isAuthenticated = true;

    // Store in localStorage to persist across page refreshes
    localStorage.setItem("user", JSON.stringify(user));

    return user;
  }

  // Logout method
  logout(): void {
    this.currentUser = null;
    this.isAuthenticated = false;
    localStorage.removeItem("user");
  }

  // Get current user
  getCurrentUser(): User | null {
    if (this.currentUser) {
      return this.currentUser;
    }

    // Check localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        this.currentUser = JSON.parse(storedUser);
        this.isAuthenticated = true;
        return this.currentUser;
      } catch (error) {
        localStorage.removeItem("user");
      }
    }

    return null;
  }

  // Check if user is authenticated
  isUserAuthenticated(): boolean {
    return this.isAuthenticated || !!this.getCurrentUser();
  }
}

// Export a singleton instance
export const authService = new AuthService();
