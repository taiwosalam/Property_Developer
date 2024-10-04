import { FilterIcon } from "@/public/icons/icons";
import { ButtonHTMLAttributes } from "react";

interface FilterButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

const FilterButton = ({ onClick, ...props }: FilterButtonProps) => {
  return (
    <button
      type="button"
      className="bg-white rounded-lg p-2 flex items-center gap-2"
      onClick={onClick}
      {...props}
    >
      <FilterIcon />
      <span className="text-[#344054] text-base font-medium">Filters</span>
    </button>
  );
};

export default FilterButton;
