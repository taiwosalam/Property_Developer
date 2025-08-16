"use client";
import useWindowWidth from "@/hooks/useWindowWidth";
import { ArrowDownAZ, ArrowUpZA } from "lucide-react";
import { useState } from "react";

const SortButton: React.FC<{
  onSort?: (order: "asc" | "desc") => void;
}> = ({ onSort }) => {
  const [sort, setSort] = useState<"asc" | "desc">("asc");
  const { isMobile } = useWindowWidth();

  const toggleSort = () => {
    const newSort = sort === "asc" ? "desc" : "asc";
    setSort(newSort);
    onSort?.(newSort);
  };

  const getIcon = () => {
    switch (sort) {
      case "asc":
        return (
          <ArrowDownAZ
            size={isMobile ? 16 : 20}
            className="text-[#344054] dark:text-darkText-1"
          />
        );
      case "desc":
        return (
          <ArrowUpZA
            size={isMobile ? 16 : 20}
            className="text-[#344054] dark:text-darkText-1"
          />
        );
      default:
        return null;
    }
  };

  return (
    <button
      type="button"
      className="sort-button bg-white dark:bg-darkText-primary rounded-lg p-2 flex items-center gap-2"
      onClick={toggleSort}
    >
      {getIcon()}
<<<<<<< HEAD
      <span className="text-[#344054] dark:text-darkText-1 md:block hidden text-base font-medium">
=======
      <span className="text-[#344054] dark:text-darkText-1 text-base font-medium hidden sm:block">
>>>>>>> 8e2e7277ac6ef17c3e53708862967ee916496b9d
        Sort
      </span>
    </button>
  );
};

export default SortButton;
