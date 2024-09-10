import clsx from "clsx";
import Image from "next/image";
import SearchIcon from "@/public/icons/search-icon.svg";
import { SearchInputProps } from "./types";
// import { useRef } from "react";

const SearchInput: React.FC<SearchInputProps> = ({
  inputTextStyles,
  className,
}) => {
  //   const dropdownRef = useRef<HTMLDivElement>(null);
  return (
    <div
      className={clsx(
        "flex items-center border border-solid py-3 pl-10 pr-3 rounded-[4px]",
        className
      )}
    >
      {/* Search icon positioned absolutely */}
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
        <Image
          src={SearchIcon}
          alt="Search Icon"
          height={18}
          width={18}
          className="w-[18px] h-[18px]"
        />
      </div>

      <input
        type="text"
        className={clsx("flex-1 bg-transparent outline-none", inputTextStyles)}
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setIsOpen(true); // Open dropdown when typing
        }}
        onClick={(e) => {
          setIsOpen(true); // Open dropdown when clicking input
          e.stopPropagation(); // Prevent dropdown from toggling
        }}
        autoFocus={isOpen} // Autofocus when opened
      />
    </div>
  );
};

export default SearchInput;
