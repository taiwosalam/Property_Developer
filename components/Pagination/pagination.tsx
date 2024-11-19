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
    const maxVisibleButtons = 5;
    const halfVisible = Math.floor(maxVisibleButtons / 2);

    let startPage = Math.max(1, currentPage - halfVisible);
    let endPage = Math.min(totalPages, currentPage + halfVisible);

    // Adjust start and end if they exceed the total pages
    if (endPage - startPage < maxVisibleButtons - 1) {
      if (startPage === 1) {
        endPage = Math.min(totalPages, startPage + maxVisibleButtons - 1);
      } else if (endPage === totalPages) {
        startPage = Math.max(1, endPage - maxVisibleButtons + 1);
      }
    }

    // Add first page and ellipsis if needed
    if (startPage > 1) {
      pages.push(
        <button
          key={1}
          type="button"
          className={clsx(buttonClasses, {
            "bg-brand-9 text-white font-normal": 1 === currentPage,
            "bg-white font-light": 1 !== currentPage,
          })}
          onClick={() => onPageChange(1)}
          aria-label={`Page 1`}
          disabled={1 === currentPage}
        >
          1
        </button>
      );
      if (startPage > 2) {
        pages.push(<span key="start-ellipsis">...</span>);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
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

    // Add last page and ellipsis if needed
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(<span key="end-ellipsis">...</span>);
      }
      pages.push(
        <button
          key={totalPages}
          type="button"
          className={clsx(buttonClasses, {
            "bg-brand-9 text-white font-normal": totalPages === currentPage,
            "bg-white font-light": totalPages !== currentPage,
          })}
          onClick={() => onPageChange(totalPages)}
          aria-label={`Page ${totalPages}`}
          disabled={totalPages === currentPage}
        >
          {totalPages}
        </button>
      );
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
      <button
        className={clsx("hidden md:block", currentPage === 1 && "opacity-50")}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Previous Page
      </button>
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
      <button
        className={clsx(
          "hidden md:block",
          currentPage === totalPages && "opacity-50"
        )}
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Next Page
      </button>
    </div>
  );
};

export default Pagination;
