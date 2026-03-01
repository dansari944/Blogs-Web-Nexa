"use client";

import {
  createContext,
  useContext,
  useState,
} from "react";
import LoginModal from "@/components/LoginModal";

const AuthModalContext = createContext<any>(null);

export function AuthModalProvider({ children }: any) {
  const [open, setOpen] = useState(false);

  const openLogin = () => setOpen(true);
  const closeLogin = () => setOpen(false);

  return (
    <AuthModalContext.Provider
      value={{ openLogin, closeLogin }}
    >
      {children}

      {/* GLOBAL LOGIN MODAL */}
      {open && <LoginModal onClose={closeLogin} />}
    </AuthModalContext.Provider>
  );
}

export const useAuthModal = () =>
  useContext(AuthModalContext);