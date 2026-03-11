import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        username: { label: "Username" },
        password: { label: "Password", type: "password" },
      },
      authorize(credentials) {
        if (
          credentials.username === process.env.AUTH_USERNAME &&
          credentials.password === process.env.AUTH_PASSWORD
        ) {
          // Return a minimal user object — only you can ever match
          return { id: "1", name: credentials.username as string };
        }
        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 0, // session cookie — expires when browser closes
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    // Without this, the proxy lets everyone through.
    // Returning false redirects unauthenticated users to pages.signIn (/login).
    authorized({ auth }) {
      return !!auth?.user;
    },
  },
});
