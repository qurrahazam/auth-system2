"use client";

import { FileClock, FileText, LayoutGrid, Plus, Settings } from "lucide-react";
import SidebarButton from "./SideBarButton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Logo from "@/components/layouts/Header/Logo";

interface SidebarProps {
  sidebarOpen: boolean;
}

export default function Sidebar({ sidebarOpen }: SidebarProps) {
  const [openBlog, setOpenBlog] = useState(false);
  const pathname = usePathname();

  return (
    <aside
      className={`fixed left-0 top-0 h-full bg-white border-r border-gray-200 shadow-sm z-40 flex-col w-64 transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}
    >
      <div className="mx-10 flex h-16 items-center justify-between border-b">
        <Logo />
      </div>

      <ScrollArea className="flex-1">
        <nav className="flex flex-col gap-1 p-3">
          <Link href="/dashboard">
            <SidebarButton
              icon={<FileClock size={18} />}
              label="Dashboard"
              active={pathname === "/dashboard"}
            />
          </Link>

          <div>
            <SidebarButton
              icon={<FileText size={18} />}
              label="Blog"
              active={pathname.startsWith("/dashboard/blog")}
              onClick={() => setOpenBlog((prev) => !prev)}
            />
            {openBlog && (
              <div className="ml-6 mt-1 flex flex-col gap-1">
                <Link href="/dashboard/blogs">
                  <SidebarButton
                    icon={<LayoutGrid size={16} />}
                    label="All Blogs"
                    active={pathname === "/dashboard/blogs"}
                  />
                </Link>
                <Link href="/dashboard/new-post">
                  <SidebarButton
                    icon={<Plus size={16} />}
                    label="Create New"
                    active={pathname === "/dashboard/new-post"}
                  />
                </Link>
              </div>
            )}
          </div>

          <Link href="/dashboard/settings">
            <SidebarButton
              icon={<Settings size={18} />}
              label="Settings"
              active={pathname === "/dashboard/settings"}
            />
          </Link>
        </nav>
      </ScrollArea>

      <Separator className="my-2" />
    </aside>
  );
}
