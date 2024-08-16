import { createContext, useEffect, useState, ReactNode } from "react";
import axios from "axios";
import { User } from "../types";

interface LoginInputs {
  username: string;
  password: string;
}

export interface AuthContextType {
  currentUser: User | null;
  login: (inputs: LoginInputs) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

interface AuthContextProviderProps {
  children: ReactNode;
}

export const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
  const [currentUser, setCurrentUser] = useState<User | null>(
    JSON.parse(localStorage.getItem("user") as string) || null
  );

  const login = async (inputs: LoginInputs) => {
    const res = await axios.post<User>("http://localhost:4000/api/auth/login", inputs, {
      withCredentials: true,
    });

    setCurrentUser(res.data);
  };

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(currentUser));
  }, [currentUser]);

  return <AuthContext.Provider value={{ currentUser, login }}>{children}</AuthContext.Provider>;
};
