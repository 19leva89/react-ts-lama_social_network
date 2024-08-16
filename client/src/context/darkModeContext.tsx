import { createContext, useEffect, useState, ReactNode } from "react";

export interface DarkModeContextType {
  darkMode: boolean;
  toggle: () => void;
}

export const DarkModeContext = createContext<DarkModeContextType | null>(null);

interface DarkModeContextProviderProps {
  children: ReactNode;
}

export const DarkModeContextProvider = ({ children }: DarkModeContextProviderProps) => {
  const [darkMode, setDarkMode] = useState<boolean>(
    JSON.parse(localStorage.getItem("darkMode") as string) || false
  );

  const toggle = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  return (
    <DarkModeContext.Provider value={{ darkMode, toggle }}>{children}</DarkModeContext.Provider>
  );
};
