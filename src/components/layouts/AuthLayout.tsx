"Use Client";

import React, { ReactNode } from "react";


interface AuthLayoutProps {
  title?: string;
  subtitle?: string;
  children: ReactNode;
}

export default function AuthLayout({children, title, subtitle }: AuthLayoutProps) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8"> 
            <h1 className="text-3xl font-bold text-center text-emerald-600 mb-2">
          {title || "Welcome"}
        </h1>
        <p className="text-center text-gray-600 mb-4">{subtitle || "Please enter your details below."}</p>
       {children}
        </div>
        </div>
    );
    }