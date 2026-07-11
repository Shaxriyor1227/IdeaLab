import { createContext, useState, useContext, useEffect, useMemo } from "react";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  signInWithPopup,
  updateProfile,
  sendPasswordResetEmail,
  onAuthStateChanged
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db, googleProvider, githubProvider } from "../../firebase";
import i18n from "../../i18n";
import Loader from "../Loader/Loader";

const AuthContext = createContext();

// Cache for user data to avoid refetching on rerenders
export const userCache = new Map();
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authReady, setAuthReady] = useState(false); // Firebase birinchi tekshiruvi tugadimi

  const [signupForm, setSignupForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [signinForm, setSigninForm] = useState({
    email: "",
    password: "",
  });

  // Track Firebase auth status changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Check cache first
        if (userCache.has(firebaseUser.uid)) {
          setUser(userCache.get(firebaseUser.uid));
          setIsAuth(true);
          setLoading(false);
          setAuthReady(true);
          return;
        }

        setLoading(true);
        
        // Fetch extra fields if they exist in Firestore
        const userDocRef = doc(db, "users", firebaseUser.uid);
        
        let userData = {
          uid: firebaseUser.uid,
          name: firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "User",
          email: firebaseUser.email,
          photoURL: firebaseUser.photoURL,
          role: "user",
        };

        try {
          const userDocSnap = await getDoc(userDocRef);
          
          if (userDocSnap.exists()) {
            const dbData = userDocSnap.data();
            userData = {
              ...userData,
              name: dbData.name || userData.name,
              theme: dbData.theme,
              locale: dbData.locale,
              role: dbData.role || "user",
            };
            // Sync i18n language with user's saved preference
            if (dbData.locale && (dbData.locale === 'en' || dbData.locale === 'uz')) {
              i18n.changeLanguage(dbData.locale);
            }
          } else {
            // Create document if it doesn't exist (e.g. social login first time)
            await setDoc(userDocRef, {
              name: userData.name,
              email: userData.email,
              theme: "purple",
              locale: "en",
              createdAt: new Date().toISOString()
            });
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }

        // Cache the user data
        userCache.set(firebaseUser.uid, userData);
        setUser(userData);
        setIsAuth(true);
        setLoading(false);
        setAuthReady(true);
      } else {
        setUser(null);
        setIsAuth(false);
        userCache.clear();
        setLoading(false);
        setAuthReady(true);
      }
    });

    return () => unsubscribe();
  }, []);

  const signup = async (userData) => {
    const { name, email, password } = userData;
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;

    // Update Firebase Auth display name
    await updateProfile(firebaseUser, { displayName: name });

    // Store in Firestore
    await setDoc(doc(db, "users", firebaseUser.uid), {
      name,
      email,
      theme: "purple",
      locale: "en",
      createdAt: new Date().toISOString()
    });

    return firebaseUser;
  };

  const login = async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  };

  const loginWithGoogle = async () => {
    const userCredential = await signInWithPopup(auth, googleProvider);
    return userCredential.user;
  };

  const loginWithGithub = async () => {
    const userCredential = await signInWithPopup(auth, githubProvider);
    return userCredential.user;
  };

  const logout = async () => {
    await signOut(auth);
  };

  const resetPassword = async (email) => {
    await sendPasswordResetEmail(auth, email);
  };


  const contextValue = useMemo(
    () => ({
      user,
      isAuth,
      isAdmin: user?.role === "admin",
      loading,
      authReady,
      signup,
      login,
      loginWithGoogle,
      loginWithGithub,
      logout,
      resetPassword,
      signupForm,
      setSignupForm,
      signinForm,
      setSigninForm,
      setUser,
    }),
    [user, isAuth, loading, authReady, signupForm, signinForm]
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {/* authReady bo'lguncha hech narsa render qilmaymiz — sahifa momentda chiqadi */}
      {authReady ? children : null}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
