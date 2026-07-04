import { createContext, useState, useContext, useEffect } from "react";
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

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);

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
        // Fetch extra fields if they exist in Firestore
        const userDocRef = doc(db, "users", firebaseUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        
        let userData = {
          uid: firebaseUser.uid,
          name: firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "User",
          email: firebaseUser.email,
          photoURL: firebaseUser.photoURL,
        };

        if (userDocSnap.exists()) {
          const dbData = userDocSnap.data();
          userData = {
            ...userData,
            name: dbData.name || userData.name,
            theme: dbData.theme,
            locale: dbData.locale,
          };
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

        setUser(userData);
        setIsAuth(true);
      } else {
        setUser(null);
        setIsAuth(false);
      }
      setLoading(false);
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

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuth,
        loading,
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
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
