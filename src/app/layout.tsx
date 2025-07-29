import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Louis' Steak House Feedback",
  description: "Share your dining experience at Louis' Steak House. Submit feedback, rate your visit, and help us serve you better.",
  keywords: "Louis Steak House, restaurant feedback, dining experience, customer reviews",
  authors: [{ name: "Louis' Steak House" }],
  robots: "index, follow",
  
  // Open Graph meta tags
  openGraph: {
    title: "Louis' Steak House Feedback",
    description: "Share your dining experience at Louis' Steak House. Submit feedback, rate your visit, and help us serve you better.",
    type: "website",
    locale: "en_US",
    siteName: "Louis' Steak House",
  },
  
  // Twitter Card meta tags
  twitter: {
    card: "summary_large_image",
    title: "Louis' Steak House Feedback",
    description: "Share your dining experience at Louis' Steak House. Submit feedback, rate your visit, and help us serve you better.",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
