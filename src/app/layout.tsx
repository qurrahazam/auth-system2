import type { Metadata } from "next";
import { GeistSans } from 'geist/font/sans';
import { Toaster } from "react-hot-toast";
import Footer from "@/components/layouts/Footer";
import { AuthProvider } from "@/context/AuthContext";
import "./globals.css";

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
        className={`${GeistSans.className} antialiased`}
      >
        <AuthProvider>
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
