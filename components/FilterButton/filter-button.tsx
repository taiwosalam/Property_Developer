"use client";
import { FilterIcon } from "@/public/icons/icons";
import { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface FilterButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  noTitle?: boolean;
}

const FilterButton = ({
  onClick,
  noTitle,
  className,
  ...props
}: FilterButtonProps) => {
  return (
    <button
      type="button"
      className={cn(
        "filter-button bg-white dark:bg-darkText-primary  rounded-lg p-2 flex items-center gap-2",
        className
      )}
      onClick={onClick}
      {...props}
    >
      <FilterIcon />
      <span
        className="text-text-secondary dark:text-darkText-1 text-base font-medium"
        hidden={noTitle}
      >
        Filters
      </span>
    </button>
  );
};

export default FilterButton;
