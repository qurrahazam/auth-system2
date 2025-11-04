"use client";

import { cn } from "@/lib/utils";

interface SidebarButtonProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

export default function SidebarButton({
  icon,
  label,
  active,
  onClick,
}: SidebarButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all text-left",
        active
          ? "bg-emerald-50 text-emerald-700 shadow-sm"
          : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
      )}
    >
      <span
        className={cn(
          "flex items-center justify-center",
          active ? "text-emerald-600" : "text-gray-500"
        )}
      >
        {icon}
      </span>
      <span className="truncate">{label}</span>
    </button>
  );
}
