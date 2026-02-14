"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Search,
  PenSquare,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NotificationBell } from "@/components/notifications";
import { useAuthStore } from "@/stores";

interface NavbarProps {
  onMenuToggle?: () => void;
  isSidebarOpen?: boolean;
}

export function Navbar({ onMenuToggle, isSidebarOpen }: NavbarProps) {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  const userInitials = user
    ? `${user.first_name?.[0] || ""}${user.last_name?.[0] || user.username?.[0] || "U"}`
    : "U";

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 sm:h-16 items-center justify-between gap-4">
          {/* Left section: Menu + Logo */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden h-9 w-9"
              onClick={onMenuToggle}
            >
              {isSidebarOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
              <span className="sr-only">Toggle menu</span>
            </Button>

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-base sm:text-lg">
                  A
                </span>
              </div>
              <span className="font-semibold text-lg sm:text-xl tracking-tight hidden sm:inline">
                Alfafaa
              </span>
            </Link>
          </div>

          {/* Center: Search bar */}
          <div className="flex-1 max-w-md mx-4 hidden md:block">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 h-10 rounded-full bg-muted/50 border-transparent focus:border-primary focus:bg-background"
                />
              </div>
            </form>
          </div>

          {/* Right section: Actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Mobile search button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden h-9 w-9"
              onClick={() => setIsSearchExpanded(!isSearchExpanded)}
            >
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Button>

            {isAuthenticated ? (
              <>
                {/* Write button */}
                <Link href="/write">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-2 h-9 px-3 hidden sm:flex"
                  >
                    <PenSquare className="h-4 w-4" />
                    <span>Write</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="sm:hidden h-9 w-9"
                  >
                    <PenSquare className="h-5 w-5" />
                    <span className="sr-only">Write</span>
                  </Button>
                </Link>

                {/* Notifications */}
                <NotificationBell />

                {/* User menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 rounded-full"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={user?.profile_image_url}
                          alt={user?.username}
                        />
                        <AvatarFallback className="text-xs">
                          {userInitials}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-2 py-1.5">
                      <p className="text-sm font-medium">
                        {user?.first_name} {user?.last_name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        @{user?.username}
                      </p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href={`/profile/${user?.id}`}>Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/write">Write a story</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/settings">Settings</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="text-destructive focus:text-destructive"
                    >
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button variant="ghost" size="sm" className="h-9">
                    Sign in
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button size="sm" className="h-9">
                    Get started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile search bar - expandable */}
        {isSearchExpanded && (
          <div className="md:hidden pb-3">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 h-10 rounded-full bg-muted/50"
                  autoFocus
                />
              </div>
            </form>
          </div>
        )}
      </div>
    </header>
  );
}
