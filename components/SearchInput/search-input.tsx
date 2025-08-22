import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import { SearchInputProps } from "./types";
import { debounce } from "@/utils/debounce";

const SearchInput: React.FC<SearchInputProps> = ({
  textInputClassName,
  className,
  placeholder = "Search",
  onChange,
  onSearch,
  // searchQuery,
}) => {
  // Create a debounced search function
  const debouncedSearch = debounce((value: string) => {
    onSearch?.(value);
  }, 500);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // If there's an onChange handler, call it immediately
    if (onChange) {
      onChange(event);
    }

    // If there's an onSearch handler, use the debounced version
    if (onSearch) {
      debouncedSearch(event.target.value);
    }
  };

  return (
    <div
      className={cn(
        "relative flex items-center py-3 pl-10 pr-3 rounded-[8px] bg-[#F1F2F4] dark:bg-darkText-primary dark:border dark:border-darkText-1",
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
        onChange={handleChange}
        // defaultValue={searchQuery}
      />
    </div>
  );
};

export default SearchInput;
