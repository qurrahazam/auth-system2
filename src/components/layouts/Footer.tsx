import Link from "next/link";
import { Github, Twitter, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full border-t border-emerald-100 bg-white/60 backdrop-blur-md">
      <div className="mx-auto ml-3 mr-3 px-6 py-8 flex flex-col sm:flex-row items-center justify-between text-sm text-gray-600">

        <p className="text-center sm:text-left">
          © {new Date().getFullYear()} <span className="font-semibold text-emerald-600">Insightly</span>. All rights reserved.
        </p>

        <div className="flex gap-4 mt-4 sm:mt-0">
          <Link href="/privacy" className="hover:text-emerald-600 transition">
            Privacy
          </Link>
          <Link href="/terms" className="hover:text-emerald-600 transition">
            Terms
          </Link>
          <Link href="/contact" className="hover:text-emerald-600 transition">
            Contact
          </Link>
        </div>


        <div className="flex gap-3 mt-4 sm:mt-0">
          <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-emerald-600 transition">
            <Github className="h-5 w-5" />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-emerald-600 transition">
            <Twitter className="h-5 w-5" />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-emerald-600 transition">
            <Linkedin className="h-5 w-5" />
          </a>
        </div>
      </div>
    </footer>
  );
}
