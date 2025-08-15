import React from "react";

// Types
import type { StaffProfilePortfolioProps } from "./types";

// Imports
import StaffProfilePortfolioItem from "./staff-profile-portfolio-item";
import Link from "next/link";

const StaffProfilePortfolio: React.FC<StaffProfilePortfolioProps> = ({
  title,
  items = [],
}) => {
  return (
    <div className="custom-flex-col gap-4">
      <div className="py-3 px-4 rounded-lg bg-brand-1">
        <p className="text-text-label text-base font-medium capitalize">
          {title}
        </p>
      </div>
      <div className="flex gap-4 overflow-auto custom-round-scrollbar pb-2">
        {items.length === 0 ? (
          <div className="flex w-full items-center justify-center gap-2">
            <p className="text-text-label text-base font-medium">
              No {title} available
            </p>
          </div>
        ) : (
          items.map((item, index) => (
            <Link href={item?.link || ""} key={index}>
              <StaffProfilePortfolioItem {...item} />
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default StaffProfilePortfolio;
