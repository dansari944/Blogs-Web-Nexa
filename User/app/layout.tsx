import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import ToastProvider from "./providers/ToastProvider";
import Footer from "@/components/Footer";
import { AuthModalProvider } from "./app/providers/AuthModalProvider";
import Providers from "./providers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "ChatterBuzz",
  description: "Modern Digital Marketing Agency",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  const isDark = session?.user?.preferences?.darkMode;

  return (
    <html
      lang="en"
      className={isDark ? "dark" : ""}
      suppressHydrationWarning
    >
      <body
        // className={`${poppins.variable} antialiased duration-300`}
        className={`${poppins.variable} antialiased bg-white dark:bg-[#0B0B0B] transition-colors duration-300`}
        style={{ fontFamily: "var(--font-poppins)" }}
      >
        <AuthModalProvider>
          <Providers>
            <Navbar />

            <main
              className="transition-all duration-500"
              style={{ paddingTop: "var(--nav-height,102px)" }}
            >
              {children}
            </main>

            <Footer />
            <ToastProvider />
          </Providers>
        </AuthModalProvider>
      </body>
    </html>
  );
}