import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getAbsoluteUrl(path: string) {
  // Prefer NEXT_PUBLIC_SITE_URL if you set it (e.g., "https://myblog.com")
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.VERCEL_URL ||
    "http://localhost:3000";

  // Ensure correct format (VERCEL_URL is usually just the domain)
  const fullBase =
    baseUrl.startsWith("http") ? baseUrl : `https://${baseUrl}`;

  // Guarantee proper concatenation (avoid double slashes)
  return `${fullBase}${path.startsWith("/") ? path : `/${path}`}`;
}

