import React, { useState, useEffect, useCallback, useRef } from "react";
import { TaskCard } from "@/components/dashboard/kanban/TaskCard";
import { TaskCardSkeleton } from "./card-loader";
import { empty } from "@/app/config";

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
  onTaskClick?: (task: PendingComplaint) => void;
}

const PendingComplaintsScroll: React.FC<PendingComplaintsScrollProps> = ({
  complaints,
  pagination,
  onLoadMore,
  loading,
  onTaskClick,
}) => {
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [allComplaints, setAllComplaints] = useState<PendingComplaint[]>([]);
  const [error, setError] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [retryAttempts, setRetryAttempts] = useState(0);
  const maxRetryAttempts = 3;

  // Update complaints when new data comes in
  useEffect(() => {
    console.log("Pending complaints data received:", {
      complaintsLength: complaints?.length,
      currentPage: pagination.current_page,
      totalPages: pagination.total_pages,
    });

    if (complaints) {
      // Remove the length check - even empty arrays should update state
      if (pagination.current_page === 1) {
        // First page or reset - replace all complaints
        setAllComplaints(complaints);
        setError(null); // Clear any previous errors
        setRetryAttempts(0); // Reset retry attempts
      } else {
        // Subsequent pages - append new complaints, avoiding duplicates
        setAllComplaints((prev) => {
          const existingIds = new Set(prev.map((c) => c.id));
          const newComplaints = complaints.filter(
            (c) => !existingIds.has(c.id)
          );
          console.log("Appending new complaints:", newComplaints.length);
          return [...prev, ...newComplaints];
        });
      }
    }
  }, [complaints, pagination.current_page]);

  const pendingComplaints = allComplaints.filter(
    (task) => task.content.status === "pending"
  );

  // Eager loading: if we have no pending complaints but there are more pages, automatically load next page
  useEffect(() => {
    const shouldAutoLoad =
      !loading &&
      !isLoadingMore &&
      hasNextPage &&
      pendingComplaints.length === 0 &&
      allComplaints.length >= 0 && // We have received data (even if empty)
      pagination.current_page < 10; // Prevent infinite loading, adjust based on your needs

    if (shouldAutoLoad) {
      console.log(
        "Auto-loading next page due to no pending complaints on current page:",
        pagination.current_page
      );
      setIsLoadingMore(true);
      onLoadMore(pagination.current_page + 1)
        .then(() => {
          console.log("Auto-load successful");
        })
        .catch((error) => {
          console.error("Auto-load failed:", error);
          setError("Failed to load pending complaints automatically.");
        })
        .finally(() => {
          setIsLoadingMore(false);
        });
    }
  }, [
    pendingComplaints.length,
    allComplaints.length,
    loading,
    isLoadingMore,
    hasNextPage,
    pagination.current_page,
    onLoadMore,
  ]);

  // Update hasNextPage based on pagination
  useEffect(() => {
    setHasNextPage(pagination.current_page < pagination.total_pages);
  }, [pagination]);

  const handleScroll = useCallback(async () => {
    if (!scrollContainerRef.current || isLoadingMore || !hasNextPage || error) {
      return;
    }

    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;

    // Check if scrolled to near the end (within 100px)
    if (scrollLeft + clientWidth >= scrollWidth - 100) {
      setIsLoadingMore(true);
      setError(null);

      try {
        await onLoadMore(pagination.current_page + 1);
        setRetryAttempts(0); // Reset retry attempts on success
      } catch (error) {
        console.error("Error loading more complaints:", error);
        setError("Failed to load more complaints. Please try again.");

        // Implement exponential backoff retry
        if (retryAttempts < maxRetryAttempts) {
          const delay = Math.pow(2, retryAttempts) * 1000; // 1s, 2s, 4s
          setTimeout(() => {
            setRetryAttempts((prev) => prev + 1);
            setError(null);
          }, delay);
        }
      } finally {
        setIsLoadingMore(false);
      }
    }
  }, [
    isLoadingMore,
    hasNextPage,
    onLoadMore,
    pagination.current_page,
    error,
    retryAttempts,
  ]);

  // Add scroll listener
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll);
      return () => scrollContainer.removeEventListener("scroll", handleScroll);
    }
  }, [handleScroll]);

  // Manual retry function
  const handleRetry = useCallback(async () => {
    if (isLoadingMore) return;

    setIsLoadingMore(true);
    setError(null);

    try {
      await onLoadMore(pagination.current_page + 1);
      setRetryAttempts(0);
    } catch (error) {
      console.error("Retry failed:", error);
      setError("Failed to load more complaints. Please try again.");
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoadingMore, onLoadMore, pagination.current_page]);

  if (allComplaints.length === 0 && !loading) {
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
            avatarSrc: complaint?.avatarSrc ?? empty,
          }}
          onClick={() => onTaskClick?.(complaint)}
        />
      ))}

      {/* Loading indicators */}
      {isLoadingMore ||
        (loading && !error && (
          <div className="min-w-[352.66px] flex-shrink-0">
            <TaskCardSkeleton />
          </div>
        ))}

      {/* Error state with retry button */}
      {error && (
        <div className="min-w-[200px] flex-shrink-0 flex flex-col items-center justify-center p-4 border border-red-200 rounded-lg bg-red-50 dark:bg-red-900/20 dark:border-red-800">
          <p className="text-red-600 dark:text-red-400 text-xs text-center mb-2">
            {error}
          </p>
          {retryAttempts < maxRetryAttempts && (
            <button
              onClick={handleRetry}
              className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
              disabled={isLoadingMore}
            >
              {isLoadingMore ? "Retrying..." : "Retry"}
            </button>
          )}
        </div>
      )}

      {/* End indicator for when all data is loaded
      {!hasNextPage && allComplaints.length > 0 && !isLoadingMore && (
        <div className="min-w-[120px] flex-shrink-0 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 mx-auto mb-2 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
              <svg
                className="w-4 h-4 text-gray-500 dark:text-gray-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <p className="text-text-secondary dark:text-darkText-2 text-xs">
              All loaded
            </p>
          </div>
        </div>
      )} */}
    </div>
  );
};

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

export default PendingComplaintsScroll;
