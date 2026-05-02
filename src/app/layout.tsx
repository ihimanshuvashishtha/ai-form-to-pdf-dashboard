import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ToastProvider } from "@/context/ToastContext";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Form to PDF Generator Dashboard",
  description: "A premium portfolio project for generating professional client PDFs from AI-improved dynamic submissions.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} antialiased bg-background text-foreground min-h-screen flex flex-col`}>
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
