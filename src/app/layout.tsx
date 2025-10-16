import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";
import Header from "@/components/layouts/Header";
import Footer from "@/components/layouts/Footer";
import { AuthProvider } from "@/context/AuthContext";
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
  title: "Insightly",
  description: "A blog website",
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
        <AuthProvider>
        <Header />
       
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000, 
            style: {
              background: "#333",
              color: "#fff",
            },
            success: {
              iconTheme: {
                primary: "limegreen",
                secondary: "#fff",
              },
            },
            error: {
              iconTheme: {
                primary: "red",
                secondary: "#fff",
              },
            },
          }}
        />
        <Footer/>
        </AuthProvider>
      </body>
    </html>
  );
}
