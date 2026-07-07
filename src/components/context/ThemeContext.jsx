import { createContext, useContext, useState, useEffect, useMemo } from "react";
import { auth, db } from "../../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

const ThemeContext = createContext();

export const themes = {
  purple: {
    name: "Purple",
    primaryColor: "#7c3aed",
    primaryHover: "#6d28d9",
    primaryGlow: "rgba(124, 58, 237, 0.25)",
    primaryBgLight: "#1e1535",
    primaryBorder: "#3b2f6e",
    primaryTextLight: "#a78bfa",
    gradient: "linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)",
    cardBorder: "#2a2540",
    inputBorder: "#2e2a45"
  },
  blue: {
    name: "Blue",
    primaryColor: "#2563eb",
    primaryHover: "#1d4ed8",
    primaryGlow: "rgba(37, 99, 235, 0.25)",
    primaryBgLight: "#1e293b",
    primaryBorder: "#1e3a8a",
    primaryTextLight: "#60a5fa",
    gradient: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
    cardBorder: "#1e293b",
    inputBorder: "#334155"
  },
  emerald: {
    name: "Emerald",
    primaryColor: "#059669",
    primaryHover: "#047857",
    primaryGlow: "rgba(5, 150, 105, 0.25)",
    primaryBgLight: "#064e3b",
    primaryBorder: "#065f46",
    primaryTextLight: "#34d399",
    gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    cardBorder: "#064e3b",
    inputBorder: "#0f766e"
  },
  amber: {
    name: "Amber",
    primaryColor: "#d97706",
    primaryHover: "#b45309",
    primaryGlow: "rgba(217, 119, 6, 0.25)",
    primaryBgLight: "#451a03",
    primaryBorder: "#78350f",
    primaryTextLight: "#fbbf24",
    gradient: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
    cardBorder: "#451a03",
    inputBorder: "#b45309"
  },
  rose: {
    name: "Rose",
    primaryColor: "#e11d48",
    primaryHover: "#be123c",
    primaryGlow: "rgba(225, 29, 72, 0.25)",
    primaryBgLight: "#4c0519",
    primaryBorder: "#881337",
    primaryTextLight: "#fb7185",
    gradient: "linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)",
    cardBorder: "#4c0519",
    inputBorder: "#9f1239"
  }
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("appTheme") || "purple";
  });
  
  const [mode, setMode] = useState(() => {
    return localStorage.getItem("appThemeMode") || "dark";
  });

  // Apply theme styling dynamically to document root
  useEffect(() => {
    const selectedTheme = themes[theme] || themes.purple;
    const root = document.documentElement;

    root.style.setProperty("--primary-color", selectedTheme.primaryColor);
    root.style.setProperty("--primary-hover", selectedTheme.primaryHover);
    root.style.setProperty("--primary-glow", selectedTheme.primaryGlow);
    root.style.setProperty("--primary-bg-light", selectedTheme.primaryBgLight);
    root.style.setProperty("--primary-border", selectedTheme.primaryBorder);
    root.style.setProperty("--primary-text-light", selectedTheme.primaryTextLight);
    root.style.setProperty("--primary-gradient", selectedTheme.gradient);
    root.style.setProperty("--card-border-themed", selectedTheme.cardBorder);
    root.style.setProperty("--input-border-themed", selectedTheme.inputBorder);

    localStorage.setItem("appTheme", theme);
  }, [theme]);

  // Apply mode (dark/light) to document root
  useEffect(() => {
    const root = document.documentElement;
    if (mode === "light") {
      root.classList.add("light-mode");
    } else {
      root.classList.remove("light-mode");
    }
    localStorage.setItem("appThemeMode", mode);
  }, [mode]);

  // Sync theme/mode with Firestore when authentication changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const userDocRef = doc(db, "users", user.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            const data = userDoc.data();
            if (data.theme) setTheme(data.theme);
            if (data.mode) setMode(data.mode);
          }
        } catch (error) {
          console.error("Error loading settings from Firestore:", error);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const changeTheme = async (newTheme) => {
    if (!themes[newTheme]) return;
    setTheme(newTheme);

    const currentUser = auth.currentUser;
    if (currentUser) {
      try {
        const userDocRef = doc(db, "users", currentUser.uid);
        await updateDoc(userDocRef, { theme: newTheme });
      } catch (error) {
        console.error("Error updating theme in Firestore:", error);
      }
    }
  };

  const toggleMode = async () => {
    const newMode = mode === "dark" ? "light" : "dark";
    setMode(newMode);

    const currentUser = auth.currentUser;
    if (currentUser) {
      try {
        const userDocRef = doc(db, "users", currentUser.uid);
        await updateDoc(userDocRef, { mode: newMode });
      } catch (error) {
        console.error("Error updating mode in Firestore:", error);
      }
    }
  };

  const contextValue = useMemo(
    () => ({ theme, changeTheme, themes, mode, toggleMode }),
    [theme, mode]
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
