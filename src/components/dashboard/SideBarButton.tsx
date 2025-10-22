"use client";

import { Button } from "@/components/ui/button";

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
    <Button
      variant={active ? "secondary" : "ghost"}
      onClick={onClick}
      className={`w-full justify-start gap-3 ${
        active
          ? "bg-emerald-100 text-emerald-700"
          : "text-gray-600 hover:text-emerald-700"
      }`}
    >
      {icon}
      {label}
    </Button>
  );
}
