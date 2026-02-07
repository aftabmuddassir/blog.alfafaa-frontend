"use client";

import { usePathname } from "next/navigation";
import { MainLayout } from "@/components/layout";
import { useStaffPicks, usePopularTags } from "@/hooks";

export default function MainAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isEditorPage =
    pathname === "/write" || pathname.startsWith("/edit/");

  // Skip sidebar data fetching on editor pages for performance
  const { data: staffPicks, isLoading: isStaffPicksLoading } = useStaffPicks();
  const { data: popularTags, isLoading: isTagsLoading } = usePopularTags(8);

  const rightSidebarContent = isEditorPage
    ? undefined
    : {
        staffPicks: staffPicks?.slice(0, 3).map((article) => ({
          id: article.id,
          title: article.title,
          author: {
            name:
              article.author.first_name && article.author.last_name
                ? `${article.author.first_name} ${article.author.last_name}`
                : article.author.username,
            avatar: article.author.profile_image_url,
          },
          slug: article.slug,
        })),
        topics: popularTags?.map((tag) => ({
          id: tag.id,
          name: tag.name,
          slug: tag.slug,
        })),
      };

  return (
    <MainLayout
      showRightSidebar={!isEditorPage}
      rightSidebarContent={rightSidebarContent}
      isRightSidebarLoading={isEditorPage ? false : isStaffPicksLoading || isTagsLoading}
    >
      {children}
    </MainLayout>
  );
}
