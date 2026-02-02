"use client";

import { useState } from "react";
import { Navbar } from "./navbar";
import { Sidebar } from "./sidebar";
import { RightSidebar } from "./right-sidebar";

interface MainLayoutProps {
  children: React.ReactNode;
  showRightSidebar?: boolean;
  rightSidebarContent?: {
    staffPicks?: Array<{
      id: string;
      title: string;
      author: { name: string; avatar?: string };
      slug: string;
    }>;
    topics?: Array<{ id: string; name: string; slug: string }>;
    suggestedUsers?: Array<{
      id: string;
      name: string;
      username: string;
      avatar?: string;
      bio?: string;
    }>;
  };
  isRightSidebarLoading?: boolean;
}

export function MainLayout({
  children,
  showRightSidebar = true,
  rightSidebarContent,
  isRightSidebarLoading = false,
}: MainLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar onMenuToggle={toggleSidebar} isSidebarOpen={isSidebarOpen} />

      <div className="flex-1 flex">
        {/* Left Sidebar */}
        <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {children}
          </div>
        </main>

        {/* Right Sidebar - Desktop only */}
        {showRightSidebar && (
          <RightSidebar
            staffPicks={rightSidebarContent?.staffPicks}
            topics={rightSidebarContent?.topics}
            suggestedUsers={rightSidebarContent?.suggestedUsers}
            isLoading={isRightSidebarLoading}
          />
        )}
      </div>
    </div>
  );
}
