import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User as FirebaseUser,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as fbSignOut,
  onAuthStateChanged,
  signInAnonymously,
  updateProfile,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { UserProfile } from '../types';
import { seedInitialDataIfEmpty } from '../services/db';

const ADMIN_EMAIL = 'prosanta97348963@gmail.com';

interface AuthContextType {
  currentUser: FirebaseUser | null;
  userProfile: UserProfile | null;
  isAdmin: boolean;
  activeRole: 'admin' | 'salesman';
  setActiveRole: (role: 'admin' | 'salesman') => void;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInAsDemoSalesman: (name: string) => Promise<void>;
  logout: () => Promise<void>;
  updateSalesmanName: (name: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeRole, setActiveRole] = useState<'admin' | 'salesman'>('salesman');

  useEffect(() => {
    // Seed sample products & customers if empty on boot
    seedInitialDataIfEmpty();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const userSnap = await getDoc(userDocRef);
          const isBootstrapAdmin = user.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();

          if (userSnap.exists()) {
            const data = userSnap.data() as UserProfile;
            const finalRole = isBootstrapAdmin ? 'admin' : (data.role || 'salesman');
            setUserProfile({
              uid: user.uid,
              name: data.name || user.displayName || 'Salesman',
              email: user.email || data.email || 'user@distributor.com',
              role: finalRole,
              status: data.status || 'active',
              createdAt: data.createdAt,
            });
            setActiveRole(finalRole);
          } else {
            // New user profile
            const newProfile: UserProfile = {
              uid: user.uid,
              name: user.displayName || (user.isAnonymous ? 'Rahul (Salesman)' : 'Salesman'),
              email: user.email || 'salesman@distributor.com',
              role: isBootstrapAdmin ? 'admin' : 'salesman',
              status: 'active',
              createdAt: new Date().toISOString(),
            };
            await setDoc(userDocRef, newProfile);
            setUserProfile(newProfile);
            setActiveRole(newProfile.role);
          }
        } catch (err) {
          console.error('Error fetching user profile:', err);
          // Fallback user profile in case of rule restrictions
          const isBootstrapAdmin = user.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();
          const fallbackProfile: UserProfile = {
            uid: user.uid,
            name: user.displayName || 'Rahul (Salesman)',
            email: user.email || 'salesman@distributor.com',
            role: isBootstrapAdmin ? 'admin' : 'salesman',
            status: 'active',
          };
          setUserProfile(fallbackProfile);
          setActiveRole(fallbackProfile.role);
        }
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err) {
      console.error('Google Sign In error:', err);
      throw err;
    }
  };

  const signInAsDemoSalesman = async (name: string) => {
    try {
      const cred = await signInAnonymously(auth);
      await updateProfile(cred.user, { displayName: name });
      const newProfile: UserProfile = {
        uid: cred.user.uid,
        name,
        email: `${name.toLowerCase().replace(/\s+/g, '')}@distributor.com`,
        role: 'salesman',
        status: 'active',
        createdAt: new Date().toISOString(),
      };
      await setDoc(doc(db, 'users', cred.user.uid), newProfile);
      setUserProfile(newProfile);
      setActiveRole('salesman');
    } catch (err) {
      console.error('Demo login error:', err);
      throw err;
    }
  };

  const updateSalesmanName = async (name: string) => {
    if (!currentUser) return;
    try {
      await updateProfile(currentUser, { displayName: name });
      if (userProfile) {
        const updated = { ...userProfile, name };
        setUserProfile(updated);
        await setDoc(doc(db, 'users', currentUser.uid), updated, { merge: true });
      }
    } catch (err) {
      console.error('Update name error:', err);
    }
  };

  const logout = async () => {
    await fbSignOut(auth);
    setUserProfile(null);
    setCurrentUser(null);
  };

  const isAdmin = userProfile?.role === 'admin' || currentUser?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userProfile,
        isAdmin,
        activeRole,
        setActiveRole,
        loading,
        signInWithGoogle,
        signInAsDemoSalesman,
        logout,
        updateSalesmanName,
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
