export { auth as proxy } from "@/auth";

export const config = {
  // Protect everything except the login page, NextAuth API routes, and Next.js internals
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico|login).*)"],
};
