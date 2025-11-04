import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/" className="flex items-center select-none">
      <h1 className="font-extrabold text-2xl sm:text-3xl tracking-tight">
        <span className="bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent">
          Insightly
        </span>
      </h1>
    </Link>
  );
}
