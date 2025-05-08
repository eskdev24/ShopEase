import React, { useState, useEffect } from "react";
import { Search, ShoppingCart, User, LogOut } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ProductGrid from "./ProductGrid";
import FilterSidebar from "./FilterSidebar";
import { authService, User as UserType } from "@/services/auth";
import { useCart } from "@/contexts/CartContext";
import Login from "./Login";
import Signup from "./Signup";

interface HomeProps {
  initialCartCount?: number;
}

const Home = ({ initialCartCount = 0 }: HomeProps) => {
  // Auth state
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);

  // Cart state from context
  const { cartCount } = useCart();

  const [searchQuery, setSearchQuery] = useState("");
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeFilters, setActiveFilters] = useState<{
    categories: string[];
    priceRange: [number, number];
    sortBy: string;
  }>({
    categories: [],
    priceRange: [0, 1000],
    sortBy: "featured",
  });

  // Check authentication status on component mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await authService.getCurrentUser();
        setCurrentUser(user);
      } catch (error) {
        console.error("Error checking authentication:", error);
      }
    };

    // Initial auth check
    checkAuth();

    // Subscribe to auth state changes
    const { data: authListener } = authService.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_IN" && session?.user) {
          authService.getCurrentUser().then(setCurrentUser);
        } else if (event === "SIGNED_OUT") {
          setCurrentUser(null);
        }
      },
    );

    // Cleanup subscription
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  // Function to handle search input and generate suggestions
  const handleSearchInput = (query: string) => {
    setSearchQuery(query);
    if (query.length > 1) {
      // Generate suggestions based on input
      // In a production app, this would call an API endpoint
      const suggestions = [
        `${query} shirts`,
        `${query} pants`,
        `${query} accessories`,
        `${query} shoes`,
      ];
      setSearchSuggestions(suggestions);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleFilterChange = (newFilters: typeof activeFilters) => {
    setActiveFilters(newFilters);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuggestions(false);
    // In a production app, this would trigger a search API call
    console.log("Searching for:", searchQuery);
    // TODO: Implement actual search functionality
  };

  const selectSuggestion = (suggestion: string) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
    // In a production app, this would trigger a search API call
    console.log("Selected suggestion:", suggestion);
    // TODO: Implement actual search functionality
  };

  const handleLogin = () => {
    setShowLoginModal(true);
    setShowSignupModal(false);
  };

  const handleSignup = () => {
    setShowSignupModal(true);
    setShowLoginModal(false);
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      // The auth state listener will handle setting currentUser to null
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const handleLoginSuccess = async () => {
    setShowLoginModal(false);
    try {
      const user = await authService.getCurrentUser();
      setCurrentUser(user);
    } catch (error) {
      console.error("Error getting current user after login:", error);
    }
  };

  const handleSignupSuccess = async () => {
    setShowSignupModal(false);
    try {
      const user = await authService.getCurrentUser();
      setCurrentUser(user);
    } catch (error) {
      console.error("Error getting current user after signup:", error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-primary mr-8">ShopEase</h1>
            <div className="relative hidden md:block w-96">
              <form onSubmit={handleSearchSubmit} className="relative">
                <Input
                  type="text"
                  placeholder="Search products..."
                  className="pl-10 pr-4 py-2 w-full"
                  value={searchQuery}
                  onChange={(e) => handleSearchInput(e.target.value)}
                  onBlur={() =>
                    setTimeout(() => setShowSuggestions(false), 200)
                  }
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              </form>
              {showSuggestions && searchSuggestions.length > 0 && (
                <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
                  <ul>
                    {searchSuggestions.map((suggestion, index) => (
                      <li
                        key={index}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => selectSuggestion(suggestion)}
                      >
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              className="relative"
              onClick={() => (window.location.href = "/cart")}
            >
              <ShoppingCart className="h-6 w-6" />
              {cartCount > 0 && (
                <Badge className="absolute -top-2 -right-2 bg-primary text-white">
                  {cartCount}
                </Badge>
              )}
            </Button>
            <div className="hidden md:block">
              {currentUser ? (
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-2 px-3 py-1 bg-gray-100 rounded-full">
                    <User className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      {currentUser.name}
                    </span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-1" />
                    Logout
                  </Button>
                </div>
              ) : (
                <>
                  <Button
                    variant="outline"
                    className="mr-2"
                    onClick={handleLogin}
                  >
                    Sign In
                  </Button>
                  <Button onClick={handleSignup}>Sign Up</Button>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="md:hidden container mx-auto px-4 pb-4">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Input
              type="text"
              placeholder="Search products..."
              className="pl-10 pr-4 py-2 w-full"
              value={searchQuery}
              onChange={(e) => handleSearchInput(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          </form>
        </div>
      </header>

      {/* Login/Signup Modals */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-2 absolute right-0 top-0">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => setShowLoginModal(false)}
              >
                ✕
              </Button>
            </div>
            <Login
              onSuccess={handleLoginSuccess}
              onCancel={() => setShowLoginModal(false)}
            />
            <div className="pb-6 text-center">
              <Button
                variant="link"
                onClick={() => {
                  setShowLoginModal(false);
                  setShowSignupModal(true);
                }}
              >
                Don't have an account? Sign up
              </Button>
            </div>
          </div>
        </div>
      )}

      {showSignupModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-2 absolute right-0 top-0">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => setShowSignupModal(false)}
              >
                ✕
              </Button>
            </div>
            <Signup
              onSuccess={handleSignupSuccess}
              onCancel={() => setShowSignupModal(false)}
            />
            <div className="pb-6 text-center">
              <Button
                variant="link"
                onClick={() => {
                  setShowSignupModal(false);
                  setShowLoginModal(true);
                }}
              >
                Already have an account? Sign in
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <aside className="w-full md:w-64 shrink-0">
            <FilterSidebar onFilterChange={handleFilterChange} />
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-xl font-semibold">Products</h2>
              <div className="text-sm text-gray-500">
                Showing 24 of 256 products
              </div>
            </div>
            <ProductGrid filters={activeFilters} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 border-t border-gray-200 mt-12">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold mb-4">Shop</h3>
              <ul className="space-y-2 text-sm">
                <li>New Arrivals</li>
                <li>Best Sellers</li>
                <li>Sale Items</li>
                <li>Collections</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Help</h3>
              <ul className="space-y-2 text-sm">
                <li>FAQ</li>
                <li>Shipping & Returns</li>
                <li>Contact Us</li>
                <li>Track Order</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">About</h3>
              <ul className="space-y-2 text-sm">
                <li>Our Story</li>
                <li>Sustainability</li>
                <li>Careers</li>
                <li>Press</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Connect</h3>
              <p className="text-sm mb-4">
                Subscribe to our newsletter for updates and promotions.
              </p>
              <div className="flex">
                <Input
                  type="email"
                  placeholder="Your email"
                  className="rounded-r-none"
                />
                <Button className="rounded-l-none">Subscribe</Button>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-gray-200 text-sm text-center text-gray-500">
            © 2023 ShopEase. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
