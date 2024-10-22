import { ArrowDownAZ, ArrowUpZA } from "lucide-react";
import { useState } from "react";

const SortButton = () => {
  const [sort, setSort] = useState("asc");
  const toggleSort = () => {
    setSort(sort === "asc" ? "desc" : "asc");
  };
  return (
    <button
      type="button"
      className="bg-white dark:bg-darkText-primary rounded-lg p-2 flex items-center gap-2"
      onClick={toggleSort}
    >
      {sort === "asc" ? (
        <ArrowDownAZ size={20} className="text-[#344054]" />
      ) : (
        <ArrowUpZA size={20} className="text-[#344054]" />
      )}
      <span className="text-[#344054] dark:text-darkText-1 text-base font-medium">
        Sort
      </span>
    </button>
  );
};

export default SortButton;
