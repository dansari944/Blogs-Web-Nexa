"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import Logo from "./Logo";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Image from "next/image";
import GoogleLoginButton from "./GoogleLoginButton";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, Close, Call } from "@mui/icons-material";

const navItems = [
  { name: "Who We Are", path: "#who-we-are" },
  { name: "What We Do", path: "#what-we-do" },
  { name: "Case Studies", path: "#case-studies" },
  { name: "Industries", path: "#industries" },
  { name: "Plans", path: "#plans" },
  { name: "Podcast", path: "#podcast" },
  { name: "Resources", path: "/blogs/global-world" },
  { name: "Contact", path: "/contact" },
];

export default function Navbar() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [scrollStage, setScrollStage] = useState(0);
  const navbarHeight = scrollStage === 0 ? 102 : 80;
  const pathname = usePathname();
  const { data: session, status } = useSession();
  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;

      if (y < 20)
        setScrollStage(0); // transparent
      else if (y < 120)
        setScrollStage(1); // grey
      else setScrollStage(2); // white
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--nav-height",
      `${navbarHeight}px`,
    );
  }, [navbarHeight]);

  const getInitials = (name?: string) => {
    if (!name) return "U";

    const parts = name.split(" ");
    return parts.length > 1 ? parts[0][0] + parts[1][0] : parts[0][0];
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      {/* ===== Animated Navbar Background ===== */}
      <div
        className={`absolute inset-0 transition-all duration-500 ease-out ${
          scrolled
            ? "backdrop-blur-xl bg-white/10 shadow-sm border-b border-white/20"
            : "bg-transparent"
        }`}
        style={{
          height: scrollStage === 0 ? "90px" : "80px",
          backgroundColor:
            scrollStage === 0
              ? "rgba(255,255,255,0)"
              : scrollStage === 1
                ? "rgba(156,163,175,0.85)" // gray-400
                : "rgba(156,163,175,0.85)",
          backdropFilter: scrollStage === 0 ? "blur(0px)" : "blur(22px)",
          WebkitBackdropFilter: scrollStage === 0 ? "blur(0px)" : "blur(22px)",
        }}
      />

      {/* ===== Navbar Content ===== */}
      <div className="relative">
        <div className="max-w-7xl mx-auto px-8 lg:px-12">
          <div
            className="grid grid-cols-3 items-center transition-all duration-500 ease-out"
            style={{
              height: scrollStage === 0 ? "102px" : "80px",
            }}
          >
            {/* LEFT — Phone */}
            <div className="hidden md:flex justify-start">
              <motion.a
                href="tel:7666484941"
                whileHover={{ scale: 1.05 }}
                className={`flex items-center gap-2 bg-indigo-600 text-white rounded-full font-semibold shadow-md transition-all duration-500 ${
                  scrollStage === 0
                    ? "px-4 py-2 text-sm"
                    : "px-3 py-1 text-xs scale-95"
                }`}
              >
                <Call
                  style={{
                    fontSize: scrollStage === 0 ? 40 : 28,
                  }}
                />
                1-800-GROWTH
              </motion.a>
            </div>

            {/* CENTER — Logo */}
            <div className="flex justify-center">
              <Link href="/">
                <Logo light size={scrollStage === 0 ? "large" : "small"} />
              </Link>
            </div>

            {/* RIGHT — Toggle */}
            <div className="flex justify-end items-center gap-4">
              {/* AUTH SECTION */}
              {status === "loading" ? null : !session ? (
                <>
                  {/* Google Login Icon */}
                  <button
                    onClick={() => status !== "loading" && signIn("google")}
                    disabled={status === "loading"}
                    className={`
    group relative flex items-center justify-center
    w-11 h-11 rounded-full border
    transition-all duration-300
    ${
      status === "loading"
        ? "border-gray-200 bg-gray-100 cursor-not-allowed opacity-60"
        : "border-gray-300 hover:border-indigo-500 hover:bg-gray-50"
    }
  `}
                  >
                    {/* Google Icon */}
                    <img
                      src="https://www.svgrepo.com/show/475656/google-color.svg"
                      alt="Google Login"
                      className={`w-5 h-5 ${
                        status === "loading" ? "animate-pulse" : ""
                      }`}
                    />

                    {/* Tooltip */}
                    {status !== "loading" && (
                      <span
                        className="
        absolute -bottom-10 whitespace-nowrap
        bg-white text-black text-xs px-3 py-1 rounded-md
        opacity-0 group-hover:opacity-100
        transition
      "
                      >
                        Login with Google
                      </span>
                    )}
                  </button>
                  <Link
                    href={status === "loading" ? "#" : "/login"}
                    className={`
    px-5 py-3 rounded-full
    text-sm font-semibold shadow-sm
    transition-all duration-300
    flex items-center justify-center
    ${
      status === "loading"
        ? "bg-gray-400 text-white cursor-not-allowed pointer-events-none animate-pulse"
        : "bg-indigo-600 text-white hover:bg-indigo-700"
    }
  `}
                  >
                    {status === "loading" ? "Loading..." : "Login"}
                  </Link>
                </>
              ) : (
                <div className="relative group flex items-center">
                  {/* Avatar */}
                  {session.user?.image ? (
                    <Image
                      src={session.user.image}
                      alt="user"
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold">
                      {getInitials(session.user?.name)}
                    </div>
                  )}

                  {/* Dropdown */}
                  <div
                    className="
          absolute right-0 top-12 w-56
          bg-white rounded-xl shadow-lg border
          opacity-0 invisible
          group-hover:opacity-100 group-hover:visible
          transition-all duration-200
        "
                  >
                    <div className="p-4 border-b">
                      <p className="text-sm font-semibold text-gray-900">
                        {session.user?.name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {session.user?.email}
                      </p>
                    </div>

                    <button
                      onClick={() => router.push("/account")}
                      className="text-black w-full text-left px-4 py-3 text-sm hover:bg-gray-100 transition"
                      >
                      Account Settings
                    </button>
                    <button
                      onClick={() => signOut()}
                      className="text-black w-full text-left px-4 py-3 text-sm hover:bg-gray-100"
                      // className="text-black w-full text-left px-4 py-3 text-sm hover:bg-gray-100 transition"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}

              {/* MENU BUTTON */}
              <button
                onClick={() => setIsOpen((prev) => !prev)}
                className={`flex items-center justify-center rounded-lg transition-all duration-500
${scrollStage === 0 ? "h-14 w-14" : "h-10 w-10"}
text-gray-800 hover:text-indigo-600`}
              >
                {isOpen ? (
                  <Close style={{ fontSize: scrollStage === 0 ? 50 : 40 }} />
                ) : (
                  <Menu style={{ fontSize: scrollStage === 0 ? 50 : 40 }} />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* ===== EXPAND MENU ===== */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{
                opacity: 1,
                y: 0,
                backdropFilter: "blur(18px)",
              }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="uppercase shadow-lg border-t border-gray-200"
            >
              <div className="max-w-5xl mx-auto py-10 px-6">
                <div className="grid md:grid-cols-3 gap-8 text-center">
                  {navItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.path}
                      onClick={() => setIsOpen(false)}
                      className={`text-xl font-semibold tracking-wide transition-all duration-300 ${
                        pathname === item.path
                          ? "text-indigo-600"
                          : "text-gray-700 hover:text-indigo-600"
                      }`}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
