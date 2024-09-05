import clsx from "clsx";
import { Search } from "lucide-react";
import { SearchInputProps } from "./types";
// import { useRef } from "react";

const SearchInput: React.FC<SearchInputProps> = ({
  textInputClassName,
  className,
  placeholder,
  searchIconColor,
}) => {
  //   const dropdownRef = useRef<HTMLDivElement>(null);
  return (
    <div
      className={clsx(
        "relative flex items-center border py-3 pl-10 pr-3 rounded-[8px] border-none",
        className
      )}
    >
      {/* Search icon positioned absolutely */}
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
        <Search color={searchIconColor || "#fff"} strokeWidth={1} size={20} />
      </div>
      <input
        type="text"
        className={clsx(
          "flex-1 bg-transparent outline-none",
          textInputClassName
        )}
        placeholder={placeholder || "Search"}
      />
    </div>
  );
};

export default SearchInput;
