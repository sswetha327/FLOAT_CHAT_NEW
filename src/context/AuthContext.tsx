import React, { createContext, useContext, useEffect, useState } from 'react';
import { User as FirebaseUser, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, googleProvider, db } from '../lib/firebase';
import { UserProfile } from '../types';

interface AuthContextType {
  user: UserProfile | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  authError: string | null;
  authErrorCode: string | null;
  signInWithGoogle: () => Promise<void>;
  signInAsGuest: (customName?: string) => void;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authErrorCode, setAuthErrorCode] = useState<string | null>(null);

  // Sync user profile with Firestore
  const syncUserWithFirestore = async (fbUser: FirebaseUser): Promise<UserProfile> => {
    const userRef = doc(db, 'users', fbUser.uid);
    const nowIso = new Date().toISOString();

    try {
      const docSnap = await getDoc(userRef);

      if (!docSnap.exists()) {
        // First login: Create user account in Firestore
        const newUserProfile: UserProfile = {
          id: fbUser.uid,
          name: fbUser.displayName || fbUser.email?.split('@')[0] || 'Ocean Researcher',
          email: fbUser.email || '',
          avatar: fbUser.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          role: 'Lead Hydrographer',
          organization: 'INCOIS / NASA Ocean Dynamics',
          bookmarks: ['bay-of-bengal', 'chennai', 'arabian-sea'],
          savedReports: [],
          theme: 'dark'
        };

        await setDoc(userRef, {
          uid: fbUser.uid,
          name: newUserProfile.name,
          email: newUserProfile.email,
          photoURL: newUserProfile.avatar,
          role: newUserProfile.role,
          organization: newUserProfile.organization,
          createdAt: nowIso,
          lastLogin: nowIso,
          bookmarks: newUserProfile.bookmarks,
          savedReports: newUserProfile.savedReports
        });

        return newUserProfile;
      } else {
        // Existing user: update last login timestamp
        const existingData = docSnap.data();
        await updateDoc(userRef, { lastLogin: nowIso });

        return {
          id: fbUser.uid,
          name: existingData.name || fbUser.displayName || 'Ocean Researcher',
          email: existingData.email || fbUser.email || '',
          avatar: existingData.photoURL || fbUser.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          role: existingData.role || 'Lead Hydrographer',
          organization: existingData.organization || 'INCOIS / NASA Ocean Dynamics',
          bookmarks: existingData.bookmarks || ['bay-of-bengal'],
          savedReports: existingData.savedReports || [],
          theme: 'dark'
        };
      }
    } catch (err) {
      console.warn('Firestore sync warning (falling back to auth session state):', err);
      // Fallback in case firestore permissions or network fails
      return {
        id: fbUser.uid,
        name: fbUser.displayName || fbUser.email?.split('@')[0] || 'Ocean Researcher',
        email: fbUser.email || '',
        avatar: fbUser.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        role: 'Lead Hydrographer',
        organization: 'INCOIS / NASA Ocean Dynamics',
        bookmarks: ['bay-of-bengal'],
        savedReports: [],
        theme: 'dark'
      };
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setLoading(true);
      if (fbUser) {
        setFirebaseUser(fbUser);
        const profile = await syncUserWithFirestore(fbUser);
        setUser(profile);
      } else {
        setFirebaseUser(null);
        // Check for saved guest session in localStorage
        const savedGuest = localStorage.getItem('floatchat_guest_user');
        if (savedGuest) {
          try {
            setUser(JSON.parse(savedGuest));
          } catch {
            setUser(null);
          }
        } else {
          setUser(null);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInAsGuest = (customName?: string) => {
    setAuthError(null);
    setAuthErrorCode(null);
    setLoading(true);
    const guestUser: UserProfile = {
      id: 'guest_' + Math.random().toString(36).substring(2, 9),
      name: customName || 'Dr. Alex Vance (Guest Researcher)',
      email: 'guest.researcher@ocean.dynamics',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      role: 'Lead Hydrographer',
      organization: 'INCOIS / NASA Ocean Dynamics',
      bookmarks: ['bay-of-bengal', 'chennai', 'arabian-sea'],
      savedReports: [],
      theme: 'dark'
    };
    try {
      localStorage.setItem('floatchat_guest_user', JSON.stringify(guestUser));
    } catch (e) {
      console.warn('Unable to persist guest user to localStorage', e);
    }
    setUser(guestUser);
    setLoading(false);
  };

  const signInWithGoogle = async () => {
    setAuthError(null);
    setAuthErrorCode(null);
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user) {
        localStorage.removeItem('floatchat_guest_user');
        setFirebaseUser(result.user);
        const profile = await syncUserWithFirestore(result.user);
        setUser(profile);
      }
    } catch (err: any) {
      console.error('Google Sign-In Error:', err);
      if (
        err.code === 'auth/unauthorized-domain' ||
        (err.message && err.message.includes('unauthorized-domain'))
      ) {
        const currentHostname = typeof window !== 'undefined' ? window.location.hostname : 'current domain';
        setAuthErrorCode('auth/unauthorized-domain');
        setAuthError(
          `Firebase Domain Security: "${currentHostname}" is not authorized for Google OAuth in your Firebase project. To fix this, add "${currentHostname}" in Firebase Console -> Auth -> Settings -> Authorized Domains. Or click "Continue as Guest Researcher" below for full immediate access!`
        );
      } else if (err.code === 'auth/popup-closed-by-user') {
        setAuthErrorCode('auth/popup-closed-by-user');
        setAuthError('Sign-in popup was closed before completing.');
      } else if (err.code === 'auth/popup-blocked') {
        setAuthErrorCode('auth/popup-blocked');
        setAuthError('Popup blocked by browser. Please allow popups or use Guest Mode.');
      } else {
        setAuthErrorCode(err.code || 'auth/unknown');
        setAuthError(err.message || 'Authentication failed. Please try again or use Guest Mode.');
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setAuthError(null);
    setAuthErrorCode(null);
    try {
      localStorage.removeItem('floatchat_guest_user');
      await signOut(auth);
      setFirebaseUser(null);
      setUser(null);
    } catch (err: any) {
      console.error('Logout Error:', err);
      // Even if Firebase signOut throws error, reset local guest state
      localStorage.removeItem('floatchat_guest_user');
      setFirebaseUser(null);
      setUser(null);
    }
  };

  const clearError = () => {
    setAuthError(null);
    setAuthErrorCode(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        loading,
        authError,
        authErrorCode,
        signInWithGoogle,
        signInAsGuest,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
