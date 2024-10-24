import { CalendarIcon } from "@/public/icons/icons";
import { ArrowDownAZ, ArrowUpZA, CalendarDays } from "lucide-react";
import { useState } from "react";

const SortButton = () => {
  const [sort, setSort] = useState("asc");

  const toggleSort = () => {
    setSort((current) => {
      switch (current) {
        case "asc":
          return "desc";
        case "desc":
          return "date";
        default:
          return "asc";
      }
    });
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
      case "date":
        return <CalendarIcon />;
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
