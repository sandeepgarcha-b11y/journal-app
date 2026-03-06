import type { Metadata } from "next";
import { Nav } from "@/components/layout/Nav";
import "./globals.css";

export const metadata: Metadata = {
  title: "Journal",
  description: "Your personal daily journal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-cream-50 text-stone-800 antialiased">
        <Nav />
        <main className="mx-auto max-w-3xl px-4 py-10">{children}</main>
      </body>
    </html>
  );
}
