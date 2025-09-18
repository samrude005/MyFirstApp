import React, { createContext, useContext, useState, useEffect } from 'react';

// Define the shape of the context data
interface AuthContextType {
  user: any; // In a real app, you'd have a User type
  login: () => void;
  logout: () => void;
}

// Create the context with a default value of null
const AuthContext = createContext<AuthContextType | null>(null);

// This is the provider component that will wrap our app
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);

  // In a real app, you would check for a stored token here
  // useEffect(() => {
  //   // check AsyncStorage for a token and validate it
  // }, []);

  const login = () => {
    // In a real app, you'd perform an API call and get a user object/token
    console.log("Logging in...");
    setUser({ name: 'Test User' }); // Mock user object
  };

  const logout = () => {
    console.log("Logging out...");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to easily access the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}