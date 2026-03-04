import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        try {
          const res = await fetch("http://localhost:7000/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(credentials),
          });

          if (!res.ok) return null;

          const data = await res.json();
          if (!data.success) return null;

          return {
            _id: data.user._id,
            name: data.user.name,
            email: data.user.email,
            preferences: data.user.preferences,
            backendToken: data.token,
          };
        } catch (err) {
          console.error("Authorize error:", err);
          return null;
        }
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        const res = await fetch(
          "http://localhost:7000/api/auth/google-login",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: user.name,
              email: user.email,
              image: user.image,
            }),
          }
        );

        const data = await res.json();
        if (!res.ok || !data.success) return false;

        user._id = data.user._id;
        user.preferences = data.user.preferences;
        user.backendToken = data.token;
      }

      return true;
    },

    async jwt({ token, user, trigger, session }) {
      if (user) {
        token._id = user._id;
        token.name = user.name;
        token.email = user.email;
        token.preferences = user.preferences;
        token.backendToken = user.backendToken;
      }

      if (trigger === "update" && session?.user) {
        token.preferences = session.user.preferences;
      }

      return token;
    },

    async session({ session, token }) {
      session.user = {
        _id: token._id as string,
        name: token.name as string,
        email: token.email as string,
        preferences: token.preferences,
      };

      session.backendToken = token.backendToken as string;

      return session;
    },
  },

  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/login",
  },

  secret: process.env.NEXTAUTH_SECRET,
};