"use client";

import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  FileClock,
  FileText,
  BarChart2,
  LayoutGrid,
  Plus,
} from "lucide-react";
import SidebarButton from "./SideBarButton";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
}

export default function Sidebar({
  activeTab,
  setActiveTab,
}: SidebarProps) {
  return (
    <aside className="hidden md:flex w-64 flex-col border-r bg-white/90 backdrop-blur-md shadow-sm">
      <div className="flex flex-col flex-1 p-6">
        <ScrollArea className="flex-1">
          <nav className="space-y-2">
            <SidebarButton
              icon={<FileText size={18} />}
              label="Drafts"
              active={activeTab === "draft"}
              onClick={() => setActiveTab("draft")}
            />
            <SidebarButton
              icon={<FileClock size={18} />}
              label="Published"
              active={activeTab === "published"}
              onClick={() => setActiveTab("published")}
            />
            <SidebarButton
              icon={<BarChart2 size={18} />}
              label="Analysis"
              active={activeTab === "analysis"}
              onClick={() => setActiveTab("analysis")}
            />
            <SidebarButton
              icon={<LayoutGrid size={18} />}
              label="All Articles"
              active={activeTab === "all"}
              onClick={() => setActiveTab("all")}
            />
            <Link href="/dashboard/new-post">
              <Button className="mt-4 w-full bg-gradient-to-r from-emerald-500 to-green-600 text-white hover:from-emerald-600 hover:to-green-700">
                <Plus size={16} className="mr-2" /> New Post
              </Button>
            </Link>
          </nav>
        </ScrollArea>

        <Separator className="my-4" />
      </div>
    </aside>
  );
}
