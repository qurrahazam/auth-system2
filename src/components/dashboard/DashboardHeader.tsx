"use client";

import SearchBar from "@/components/layouts/Header/Searchbar";
import UserMenu from "@/components/layouts/Header/UserMenu";
import { useAuth } from "@/context/AuthContext";
import type { UserType } from "@/types/header";

interface DashboardHeaderProps {
  onToggleSidebar?: () => void;
}

export default function DashBoardHeader({ onToggleSidebar }: DashboardHeaderProps) {
  const { user } = useAuth();
  return (
    <header className="sticky top-0 z-50 flex items-center h-16 px-4 bg-white shadow-sm">
      
      <div className="flex items-center flex-shrink-0">
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors md:hidden"
          >
          </button>
        )}
      </div>

      <div className="flex-1 px-4">
        <SearchBar />
      </div>

      <div className="flex items-center gap-3 flex-shrink-0">
        {user && <UserMenu user={user as UserType}/>}
      </div>
    </header>
  );
}
