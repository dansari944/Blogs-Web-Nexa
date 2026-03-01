"use client";

import { useSession } from "next-auth/react";
import { useAuthModal } from "@/app/providers/AuthModalProvider";

export default function useRequireAuth() {
  const { data: session } = useSession();
  const { openLogin } = useAuthModal();

  return (callback: Function) => {
    if (!session) {
      openLogin();
      return;
    }

    callback();
  };
}