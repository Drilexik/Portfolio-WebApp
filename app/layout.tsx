import type { Metadata } from "next";
import "./globals.css";
import { initSchema } from "@/lib/db";

async function ensureSchema() {
  if (process.env.BUILDING === "true") return;
  try {
    await initSchema();
  } catch (err) {
    console.error("[layout] DB schema init failed:", err);
  }
}

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
