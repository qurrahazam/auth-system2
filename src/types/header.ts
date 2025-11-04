export interface UserType {
  name: string;
  email: string;
}

export interface NavLinksProps {
  pathname: string;
  user?: UserType | null;
}

export interface MobileMenuProps {
  pathname: string;
  user?: UserType | null;
  setMobileMenuOpen: (value: boolean) => void;
}

export interface UserMenuProps {
  user: UserType;
  onLogout: () => void;
}

export interface CategoryDropdownProps {
  categories?: string[];
}

export interface SearchResult {
  _id: string;
  slug: string;
  title: string;
  category: string;
  coverImage?: string;
}
