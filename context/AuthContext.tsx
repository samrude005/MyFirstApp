import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../firebaseConfig'; // Import our initialized services
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, User } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
// FIX #1: Add explicit types for email and password here
interface AuthContextType {
  user: User | null; // Use the real Firebase User type
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  // You can add a signup function here too
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // FIX #2: Add explicit types for email and password here
  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      // FIX #3: Use a type guard to safely handle the 'unknown' error type
      if (error instanceof Error) {
        // Now TypeScript knows 'error' has a .message property
        alert(error.message);
      } else {
        alert('An unexpected error occurred. Please try again.');
      }
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// ### Summary of Changes Made:

// 1.  **In `AuthContextType`:** The `login` function signature was changed from `(email, password)` to `(email: string, password: string)`.
// 2.  **In the `login` function implementation:** The parameters were also changed from `async (email, password)` to `async (email: string, password: string)`.
// 3.  **In the `catch` block of the `login` function:** The simple `alert(error.message)` was wrapped in an `if (error instanceof Error)` block to satisfy TypeScript's type safety for the `unknown` error type.


// utils/userProfile.ts

export const createUserProfile = async (
  uid: string, 
  email: string, 
  displayName: string,
  role: 'student' | 'technical' | 'admin' = 'student'
) => {
  try {
    const userProfileRef = doc(db, 'userProfiles', uid);
    
    // Check if profile already exists
    const existingProfile = await getDoc(userProfileRef);
    if (!existingProfile.exists()) {
      await setDoc(userProfileRef, {
        uid,
        email,
        displayName,
        role,
        createdAt: new Date(),
        isActive: true,
      });
    }
  } catch (error) {
    console.error('Error creating user profile:', error);
  }
};


export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: 'student' | 'technical' | 'admin';
  department?: string;
  location?: string;
  phoneNumber?: string;
  createdAt: any; // Firestore Timestamp type
  isActive: boolean;
}
