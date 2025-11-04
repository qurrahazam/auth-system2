import CategoryDropdown from "./CatogoryDropdown";
import type { UserType } from "@/types/header";
import { NavLinkActive } from "./NavlinkActive";


export default function NavLinks({ user }: { user: UserType | null }) {
  return (
    <nav className="flex gap-4 items-center">
      <NavLinkActive
        href="/"
      >
        Home
      </NavLinkActive>
      <CategoryDropdown />
    </nav>
  );
}
