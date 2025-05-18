import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "../styles/editor-layout.css";

const geistSans = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Inter({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GitHub README Generator - Create stunning profile READMEs",
  description: "Create beautiful GitHub profile READMEs with our drag-and-drop builder. Choose from dozens of templates and GitHub widgets to showcase your skills and projects.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.className} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
