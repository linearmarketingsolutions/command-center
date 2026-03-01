"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { MainNav } from "@/components/main-nav";
import { BusinessProvider } from "@/components/business-context";
import { DataProvider } from "@/components/data-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <title>Command Center | JARVIS</title>
        <meta name="description" content="Your personal command center for managing tasks, systems, and life" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased dark bg-jarvis-bg-base text-jarvis-text-primary`}
      >
        <BusinessProvider>
          <DataProvider>
            {/* Background Grid Pattern */}
            <div className="fixed inset-0 jarvis-grid-bg pointer-events-none z-0" />
            
            {/* Subtle Gradient Overlay */}
            <div className="fixed inset-0 bg-gradient-to-br from-jarvis-bg-base via-jarvis-bg-elevated/50 to-jarvis-bg-base pointer-events-none z-0" />
            
            {/* Scan Line Effect */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-jarvis-primary/20 to-transparent animate-scan" />
            </div>
            
            {/* Main Navigation - LEFT Side */}
            <MainNav />
            
            {/* Main Content - Adjusted for LEFT sidebar */}
            <div className="relative z-10 min-h-screen pt-16 lg:pl-64">
              {children}
            </div>
          </DataProvider>
        </BusinessProvider>
      </body>
    </html>
  );
}
