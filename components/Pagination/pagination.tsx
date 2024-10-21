"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PaginationProps } from "./types";
import clsx from "clsx";

const Pagination: React.FC<PaginationProps> = ({
  className,
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const buttonClasses =
    "grid place-items-center border border-brand-9 rounded-[4px] w-[25px] h-[28px] md:w-[30px] md:h-[33px]";

  const generatePageButtons = () => {
    const pages = [];

    // Show pages 1-5
    for (let i = 1; i <= Math.min(5, totalPages); i++) {
      pages.push(
        <button
          key={i}
          type="button"
          className={clsx(buttonClasses, {
            "bg-brand-9 text-white font-normal": i === currentPage,
            "bg-white font-light": i !== currentPage,
          })}
          onClick={() => onPageChange(i)}
          aria-label={`Page ${i}`}
          disabled={i === currentPage}
        >
          {i}
        </button>
      );
    }

    // If there are more than 7 pages, show ellipsis and the last two pages
    if (totalPages > 7) {
      pages.push(<span key="ellipsis">...</span>);

      // Show the last two pages
      for (let i = totalPages - 1; i <= totalPages; i++) {
        pages.push(
          <button
            key={i}
            type="button"
            className={clsx(buttonClasses, {
              "bg-brand-9 text-white font-normal": i === currentPage,
              "bg-white font-light": i !== currentPage,
            })}
            onClick={() => onPageChange(i)}
            aria-label={`Page ${i}`}
            disabled={i === currentPage}
          >
            {i}
          </button>
        );
      }
    }

    // If there are 7 or fewer pages, just show all the pages without ellipsis
    if (totalPages <= 7) {
      for (let i = 6; i <= totalPages; i++) {
        pages.push(
          <button
            key={i}
            type="button"
            className={clsx(buttonClasses, {
              "bg-brand-9 text-white font-normal": 6 === currentPage,
              "bg-white font-light": 6 !== currentPage,
            })}
            onClick={() => onPageChange(i)}
            aria-label={`Page ${i}`}
            disabled={i === currentPage}
          >
            {i}
          </button>
        );
      }
    }

    return pages;
  };

  return (
    <div
      className={clsx(
        "w-full flex flex-wrap gap-4 items-center justify-center custom-primary-color mt-8 text-xs font-medium",
        className
      )}
    >
      <p className={clsx("hidden md:block", currentPage === 1 && "opacity-50")}>
        Previous Page
      </p>
      <div className="flex gap-1 items-center">
        <button
          type="button"
          className={clsx(buttonClasses)}
          aria-label="Previous"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          <ChevronLeft opacity={currentPage === 1 ? "0.2" : 1} />
        </button>
        {generatePageButtons()}
        <button
          type="button"
          className={clsx(buttonClasses)}
          aria-label="Next"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <ChevronRight opacity={currentPage === totalPages ? "0.2" : 1} />
        </button>
      </div>
      <p
        className={clsx(
          "hidden md:block",
          currentPage === totalPages && "opacity-50"
        )}
      >
        Next Page
      </p>
    </div>
  );
};

export default Pagination;
