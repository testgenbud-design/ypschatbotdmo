import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Yashoda Assistant — Admissions at YTC Satara (prototype)",
  description:
    "Prototype admissions assistant for Yashoda Technical Campus, Satara. Answers parents and students in English, Hindi and Marathi, only from the college's own information — with the admission office kept in the loop. Not an official college page.",
  icons: { icon: "/assets/ytc-logo.png", apple: "/assets/ytc-logo.png" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0f4c81",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;500;600;700;800&family=Noto+Sans+Devanagari:wght@400;600;700;800&display=swap"
          rel="stylesheet"
        />
        <link rel="stylesheet" href="/assets/site.css" />
      </head>
      <body>{children}</body>
    </html>
  );
}
