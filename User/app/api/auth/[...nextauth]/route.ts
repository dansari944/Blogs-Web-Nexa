import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    // ================= GOOGLE LOGIN =================
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    // ================= CREDENTIAL LOGIN =================
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        try {
          const res = await fetch(
            "http://localhost:7000/api/auth/login",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(credentials),
            }
          );

          const data = await res.json();

          // ❌ login failed
          if (!res.ok || !data.success) {
            throw new Error(data.message || "Login failed");
          }

          // ✅ MUST return user object
          return {
            _id: data.user._id,
            name: data.user.name,
            email: data.user.email,
            backendToken: data.token,
          };
        } catch (error) {
          console.error("Authorize Error:", error);
          return null;
        }
      },
    }),
  ],

  // ================= CALLBACKS =================
  callbacks: {
    /**
     * Runs on login
     */
    async signIn({ user, account }) {
      try {
        // ✅ GOOGLE LOGIN → create/find user in backend
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

          if (!res.ok) throw new Error("Google backend login failed");

          // attach backend data
          user._id = data._id;
          user.backendToken = data.token;
        }

        return true;
      } catch (err) {
        console.error("signIn error:", err);
        return false;
      }
    },

    /**
     * Store values inside JWT
     */
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id;
        token.backendToken = user.backendToken;
        token.email = user.email;
        token.name = user.name;
      }

      return token;
    },

    /**
     * Expose data to frontend session
     */
    async session({ session, token }) {
      if (session.user) {
        session.user._id = token._id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
      }

      session.backendToken = token.backendToken;

      return session;
    },
  },

  // ================= SESSION =================
  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/login", // optional custom login page
  },

  secret: process.env.NEXTAUTH_SECRET,
  trustHost: true,
});

export { handler as GET, handler as POST };