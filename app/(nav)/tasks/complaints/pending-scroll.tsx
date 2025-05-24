import React, { useState, useEffect, useCallback, useRef } from "react";
import { TaskCard } from "@/components/dashboard/kanban/TaskCard"; // Adjust import path as needed
import { TaskCardSkeleton } from "./card-loader"; // Adjust import path as needed

interface PendingComplaint {
  id: number | string;
  columnId: string;
  content: {
    messageCount: number;
    linkCount: number;
    userAvatars: string[];
    date: string;
    status?: string;
    progress?: number;
  };
  name: string;
  title: string;
  message: string;
  avatarSrc: string;
  tier: number;
}

interface PaginationData {
  total_pages: number;
  current_page: number;
  per_page: number;
  total: number;
}

interface PendingComplaintsScrollProps {
  complaints: PendingComplaint[];
  pagination: PaginationData;
  onLoadMore: (page: number) => Promise<void>;
  loading: boolean;
}

const PendingComplaintsScroll: React.FC<PendingComplaintsScrollProps> = ({
  complaints,
  pagination,
  onLoadMore,
  loading,
}) => {
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [allComplaints, setAllComplaints] = useState<PendingComplaint[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [hasNextPage, setHasNextPage] = useState(false);

  // Filter for pending complaints only
  const pendingComplaints = allComplaints.filter(
    (complaint) => complaint.content.status === "pending"
  );

  // Update complaints when new data comes in
  useEffect(() => {
    if (complaints && complaints.length > 0) {
      if (pagination.current_page === 1) {
        // First page or reset - replace all complaints
        setAllComplaints(complaints);
      } else {
        // Subsequent pages - append new complaints, avoiding duplicates
        setAllComplaints((prev) => {
          const existingIds = new Set(prev.map((c) => c.id));
          const newComplaints = complaints.filter(
            (c) => !existingIds.has(c.id)
          );
          return [...prev, ...newComplaints];
        });
      }
    }
  }, [complaints, pagination.current_page]);

  // Update hasNextPage based on pagination
  useEffect(() => {
    setHasNextPage(pagination.current_page < pagination.total_pages);
  }, [pagination]);

  const handleScroll = useCallback(async () => {
    if (!scrollContainerRef.current || isLoadingMore || !hasNextPage) return;

    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;

    // Check if scrolled to near the end (within 100px)
    if (scrollLeft + clientWidth >= scrollWidth - 100) {
      setIsLoadingMore(true);

      try {
        await onLoadMore(pagination.current_page + 1);
      } catch (error) {
        console.error("Error loading more complaints:", error);
      } finally {
        setIsLoadingMore(false);
      }
    }
  }, [isLoadingMore, hasNextPage, onLoadMore, pagination.current_page]);

  // Add scroll listener
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll);
      return () => scrollContainer.removeEventListener("scroll", handleScroll);
    }
  }, [handleScroll]);

  if (pendingComplaints.length === 0 && !loading) {
    return (
      <div className="w-full flex justify-center items-center py-8">
        <p className="text-text-secondary dark:text-darkText-2 text-sm">
          No pending complaints available at the moment
        </p>
      </div>
    );
  }

  return (
    <div
      ref={scrollContainerRef}
      className="bg-white dark:bg-[#3C3D37] p-6 border-2 border-dashed rounded-lg border-gray-300 gap-4 flex items-center overflow-x-scroll no-scrollbar"
      style={{ scrollBehavior: "smooth" }}
    >
      {/* Render existing pending complaints */}
      {pendingComplaints.map((complaint, index) => (
        <TaskCard
          styles="min-w-[352.66px] flex-shrink-0"
          statusChanger={false}
          noDrag
          isNew
          key={complaint.id || index}
          task={{
            id: complaint.id,
            columnId: complaint.columnId,
            content: {
              messageCount: complaint.content?.messageCount,
              linkCount: complaint.content?.linkCount,
              userAvatars: complaint.content.userAvatars,
              date: complaint?.content?.date,
              status: complaint?.content?.status,
              progress: complaint?.content?.progress,
            },
            name: complaint?.name,
            title: complaint?.title,
            message: complaint?.message,
            tier: complaint?.tier,
            avatarSrc: complaint?.avatarSrc ?? "/empty/avatar.png",
          }}
        />
      ))}

      {/* Loading indicators */}
      {isLoadingMore && (
        <>
          <TaskCardSkeleton />
        </>
      )}

      {/* End indicator 
      {!hasNextPage && pendingComplaints.length > 0 && (
        <div className="min-w-[120px] flex-shrink-0 flex items-center justify-center">
          <p className="text-text-secondary dark:text-darkText-2 text-xs text-center">
            All pending complaints loaded
          </p>
        </div>
      )}*/}
    </div>
  );
};

export default PendingComplaintsScroll;

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  color?: "blue" | "gray" | "green" | "red";
  className?: string;
}

export function LoadingSpinner({
  size = "md",
  color = "blue",
  className = "",
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4 border-2",
    md: "w-6 h-6 border-3",
    lg: "w-8 h-8 border-4",
  };

  const colorClasses = {
    blue: "border-gray-200 border-t-blue-500",
    gray: "border-gray-200 border-t-gray-500",
    green: "border-gray-200 border-t-green-500",
    red: "border-gray-200 border-t-red-500",
  };

  return (
    <div
      className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full animate-spin ${className}`}
    />
  );
}
