"use client";
import { ArrowDownAZ, ArrowUpZA } from "lucide-react";
import { useState, useCallback } from "react";
import { debounce } from "@/utils/debounce";

const SortButton: React.FC<{
  onSort?: (order: "asc" | "desc") => void;
}> = ({ onSort }) => {
  const [sort, setSort] = useState<"asc" | "desc">("asc");

  const debouncedSort = useCallback(
    debounce((order: "asc" | "desc") => {
      onSort?.(order);
    }, 500),
    [onSort]
  );

  const toggleSort = () => {
    const newSort = sort === "asc" ? "desc" : "asc";
    setSort(newSort);
    debouncedSort(newSort);
  };

  const getIcon = () => {
    switch (sort) {
      case "asc":
        return (
          <ArrowDownAZ
            size={20}
            className="text-[#344054] dark:text-darkText-1"
          />
        );
      case "desc":
        return (
          <ArrowUpZA
            size={20}
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
      className="bg-white dark:bg-darkText-primary rounded-lg p-2 flex items-center gap-2"
      onClick={toggleSort}
    >
      {getIcon()}
      <span className="text-[#344054] dark:text-darkText-1 text-base font-medium">
        Sort
      </span>
    </button>
  );
};

export default SortButton;
