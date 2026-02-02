"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Compass,
  Bookmark,
  User,
  Settings,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const navItems = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/explore", icon: Compass, label: "Explore" },
  { href: "/trending", icon: TrendingUp, label: "Trending" },
];

const authNavItems = [
  { href: "/bookmarks", icon: Bookmark, label: "Bookmarks" },
  { href: "/profile", icon: User, label: "Profile" },
  { href: "/settings", icon: Settings, label: "Settings" },
];

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { isAuthenticated, user } = useAuthStore();

  const NavLink = ({
    href,
    icon: Icon,
    label,
  }: {
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    label: string;
  }) => {
    const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));
    const finalHref = href === "/profile" && user?.id ? `/profile/${user.id}` : href;

    return (
      <Link
        href={finalHref}
        onClick={onClose}
        className={cn(
          "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
          "hover:bg-muted",
          isActive
            ? "bg-primary/10 text-primary"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        <Icon className="h-5 w-5 flex-shrink-0" />
        <span>{label}</span>
      </Link>
    );
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-14 sm:top-16 left-0 z-40 h-[calc(100vh-3.5rem)] sm:h-[calc(100vh-4rem)] w-64 bg-background border-r",
          "transition-transform duration-200 ease-in-out",
          "lg:sticky lg:translate-x-0 lg:w-56 xl:w-64",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <nav className="flex flex-col h-full p-4">
          {/* Main navigation */}
          <div className="space-y-1">
            {navItems.map((item) => (
              <NavLink key={item.href} {...item} />
            ))}
          </div>

          {/* Authenticated navigation */}
          {isAuthenticated && (
            <>
              <div className="my-4 border-t" />
              <div className="space-y-1">
                {authNavItems.map((item) => (
                  <NavLink key={item.href} {...item} />
                ))}
              </div>
            </>
          )}

          {/* Footer */}
          <div className="mt-auto pt-4 border-t">
            <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
              <Link href="/about" className="hover:text-foreground">
                About
              </Link>
              <Link href="/help" className="hover:text-foreground">
                Help
              </Link>
              <Link href="/terms" className="hover:text-foreground">
                Terms
              </Link>
              <Link href="/privacy" className="hover:text-foreground">
                Privacy
              </Link>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} Alfafaa
            </p>
          </div>
        </nav>
      </aside>
    </>
  );
}
