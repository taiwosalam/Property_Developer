"use client";
import { FilterIcon } from "@/public/icons/icons";
import { ButtonHTMLAttributes } from "react";

interface FilterButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  noTitle?: boolean;
}

const FilterButton = ({ onClick, noTitle, ...props }: FilterButtonProps) => {
  return (
    <button
      type="button"
      className="bg-white dark:bg-darkText-primary  rounded-lg p-2 flex items-center gap-2"
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
