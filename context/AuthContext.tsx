import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../firebaseConfig'; // Your Firebase services
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  signOut, 
  createUserWithEmailAndPassword, // Added for signup
  User 
} from 'firebase/auth';
import { doc, setDoc, getDoc, onSnapshot } from 'firebase/firestore'; // Added onSnapshot for real-time updates

// 1. UserProfile INTERFACE IS NOW DEFINED HERE
export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: 'student' | 'technical' | 'admin';
  createdAt: any; // Firestore Timestamp
  isActive: boolean;
  // Optional fields from your definition
  department?: string;
  location?: string;
  phoneNumber?: string;
}

// 2. createUserProfile FUNCTION IS NOW DEFINED HERE
export const createUserProfile = async (
  uid: string, 
  email: string, 
  displayName: string,
  role: 'student' | 'technical' | 'admin' = 'student' // Default role is 'student'
) => {
  try {
    const userProfileRef = doc(db, 'Users', uid);
    const existingProfile = await getDoc(userProfileRef);
    if (!existingProfile.exists()) {
      await setDoc(userProfileRef, {
        uid,
        email,
        displayName,
        role,
        createdAt: new Date(), // Use JS Date, Firestore converts it
        isActive: true,
      });
    }
  } catch (error) {
    console.error('Error creating user profile:', error);
  }
};

// 3. AuthContextType IS EXPANDED
interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null; // To hold Firestore profile data
  loading: boolean; // To handle the initial loading state
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (email: string, password: string, displayName: string) => Promise<void>; // Signup function
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null); // New state for profile
  const [loading, setLoading] = useState(true); // New state for loading

  // 4. useEffect IS ENHANCED TO FETCH THE PROFILE
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // User is logged in, listen for profile changes
        const userProfileRef = doc(db, 'Users', currentUser.uid);
        const unsubscribeProfile = onSnapshot(userProfileRef, (docSnap) => {
          if (docSnap.exists()) {
            setUserProfile(docSnap.data() as UserProfile);
          } else {
            setUserProfile(null);
          }
          setLoading(false);
        });
        return () => unsubscribeProfile(); // Cleanup profile listener
      } else {
        // User is logged out
        setUserProfile(null);
        setLoading(false);
      }
    });
    return () => unsubscribeAuth(); // Cleanup auth listener
  }, []);

  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert('An unexpected error occurred.');
      }
    }
  };
  
  // 5. SIGNUP FUNCTION IS ADDED
  const signup = async (email: string, password: string, displayName: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // After creating the auth user, create their profile document
      await createUserProfile(userCredential.user.uid, userCredential.user.email!, displayName);
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert('An unexpected error occurred during signup.');
      }
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  const value = {
    user,
    userProfile,
    loading,
    login,
    logout,
    signup
  };

  // Render children only after the initial loading is complete
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
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