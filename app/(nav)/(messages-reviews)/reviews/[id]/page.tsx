"use client";

import React from "react";
import { useRouter } from "next/navigation";

// Images
import ChevronLeft from "@/public/icons/chevron-left.svg";

// Imports
import Review from "@/components/Review/review";
import Picture from "@/components/Picture/picture";

const ReviewChat = () => {
  const router = useRouter();

  return (
    <>
      <div className="py-4 px-6 bg-neutral-2">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push("/reviews")}>
            <Picture src={ChevronLeft} alt="back" size={20} />
          </button>
          <p className="text-text-primary text-base font-medium capitalize">
            review details
          </p>
        </div>
      </div>
      <div className="py-5 px-6 flex-1 overflow-auto custom-round-scrollbar bg-white custom-flex-col">
        <Review />
        <Review />
        <Review />
        <Review />
        <Review />
      </div>
    </>
  );
};

export default ReviewChat;
