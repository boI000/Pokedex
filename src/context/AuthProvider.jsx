import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  const login = (user) => {
    const { id, name, email, favourites } = user;

    const sessionUser = { id, name, email, favourites };

    setCurrentUser(sessionUser);
    localStorage.setItem("userId", String(user.id));
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("userId");
  };

  const updateCurrentUser = (updates) => {
    setCurrentUser((previousUser) => {
      if (!previousUser) return null;

      return {
        ...previousUser,
        ...updates,
      };
    });
  };

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (!storedUserId) {
      setIsAuthLoading(false);
      return;
    }

    async function restoreUser() {
      const BASE_URL = "http://localhost:3000";

      try {
        const response = await fetch(`${BASE_URL}/users/${storedUserId}`);

        if (response.status === 404) {
          localStorage.removeItem("userId");
          return;
        }

        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }

        const data = await response.json();

        const { id, name, email, favourites } = data;
        const userData = { id, name, email, favourites };
        setCurrentUser(userData);
      } catch (error) {
        console.error(error);
      } finally {
        setIsAuthLoading(false);
      }
    }

    restoreUser();
  }, []);

  const value = {
    currentUser,
    isAuthLoading,
    login,
    logout,
    updateCurrentUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  return useContext(AuthContext);
};

export default AuthProvider;
