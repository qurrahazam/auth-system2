"use client";

import { useState } from "react";
import Sidebar from "@/components/dashboard/SideBar";
import DashBoardHeader from "@/components/dashboard/DashboardHeader";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <main className="min-h-screen flex bg-gradient-to-br from-emerald-50 to-emerald-100 text-gray-800">
      <Sidebar sidebarOpen={sidebarOpen} />

      <section
        className={`flex-1 flex flex-col transition-all duration-300 ${
          sidebarOpen ? "md:ml-64" : ""
        }`}
      >
        <DashBoardHeader onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <div className="flex-1 overflow-y-auto">{children}</div>
      </section>
    </main>
  );
}
