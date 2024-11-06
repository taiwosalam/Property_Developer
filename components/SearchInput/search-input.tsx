import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import { SearchInputProps } from "./types";

const SearchInput: React.FC<SearchInputProps> = ({
  textInputClassName,
  className,
  placeholder = "Search",
}) => {
  return (
    <div
      className={cn(
        "relative flex items-center border py-3 pl-10 pr-3 rounded-[8px] border-none bg-[#F1F2F4] dark:bg-darkText-primary dark:border dark:border-darkText-1",
        className
      )}
    >
      {/* Search icon positioned absolutely */}
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
        <Search color="currentColor" strokeWidth={"1"} size={20} />
      </div>
      <input
        type="text"
        className={cn(
          "flex-1 bg-transparent outline-none text-xs md:text-sm font-normal search-input-placeholder-color w-[270px]",
          textInputClassName
        )}
        placeholder={placeholder}
      />
    </div>
  );
};

export default SearchInput;
