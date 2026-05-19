import type { Metadata } from "next";
import "./globals.css";
import { initSchema } from "@/lib/db";

// Initialise DB schema once at cold-start (server-side, no HTTP round-trip).
// The try/catch ensures a DB hiccup at startup doesn't crash the entire render.
async function ensureSchema() {
  try {
    await initSchema();
  } catch (err) {
    console.error("[layout] DB schema init failed — is PostgreSQL running?", err);
  }
}

// Top-level await in an async layout is fine in Next.js App Router.
const schemaReady = ensureSchema();

export const metadata: Metadata = {
  title: "Drilex — Full Stack Developer",
  description:
    "Portfolio of Drilex (Filip Šimkovič) — Full Stack Developer specialising in Next.js, React, Node.js and more.",
  openGraph: {
    title: "Drilex — Full Stack Developer",
    description: "Portfolio of Drilex — building things for the web.",
    type: "website",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Await the schema init before rendering any page that might hit the DB.
  await schemaReady;

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
