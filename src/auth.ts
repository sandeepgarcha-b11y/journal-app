import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],
  callbacks: {
    signIn({ profile }) {
      // Only allow the single owner account
      return profile?.email === process.env.ALLOWED_EMAIL;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
});
