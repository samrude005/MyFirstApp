import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from 'firebase/auth';

// The UserProfile interface we need
export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: 'student' | 'technical' | 'admin';
  createdAt: any;
  isActive: boolean;
}

// The shape of our context
interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  // --- DEMO FUNCTIONS
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data for demo
const MOCK_USER: Partial<User> = {
  uid: 'demo-user-123',
  email: 'demo@example.com',
  displayName: 'Demo User',
  emailVerified: true,
} as User;

const MOCK_PROFILE: UserProfile = {
  uid: 'demo-user-123',
  email: 'demo@example.com',
  displayName: 'Demo User',
  role: 'student',
  createdAt: new Date().toISOString(),
  isActive: true,
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate initial auth check with delay
    const checkAuth = async () => {
      try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // For demo: automatically sign in after delay
        // Remove these lines if you want users to start logged out
        // setUser(MOCK_USER as User);
        // setUserProfile(MOCK_PROFILE);
      } catch (error) {
        console.error('Demo auth check error:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    setLoading(true);
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock authentication - accepts any credentials
      const mockUser = {
        ...MOCK_USER,
        email: email,
      } as User;
      
      const mockProfile = {
        ...MOCK_PROFILE,
        email: email,
        displayName: email.split('@')[0],
      };
      
      setUser(mockUser);
      setUserProfile(mockProfile);
    } catch (error) {
      console.error('Demo sign in error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async (): Promise<void> => {
    setLoading(true);
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setUser(null);
      setUserProfile(null);
    } catch (error) {
      console.error('Demo sign out error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    userProfile,
    loading,
    login,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
