"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

// Images
import ChevronLeft from "@/public/icons/chevron-left.svg";

// Imports
import Review from "@/components/Review/review";
import Picture from "@/components/Picture/picture";
import { message_card_data } from "@/components/Message/data";
import useFetch from "@/hooks/useFetch";
import { usePersonalInfoStore } from "@/store/personal-info-store";
import useRefetchOnEvent from "@/hooks/useRefetchOnEvent";
import { ReviewResponseApi } from "./types";
import { ISingleReview, transformSingleReview } from "../data";

const ReviewChat = () => {
  const router = useRouter();
  const { id } = useParams();
  const clony = message_card_data.find((item) => item.id === id);
  const [review, setReview] = useState<ISingleReview | null>(null);

  const { data, refetch } = useFetch<ReviewResponseApi>(
    `/property/review/${id}`
  );
  useRefetchOnEvent("refetchReview", () => refetch({ silent: true }));

  useEffect(() => {
    if (data) {
      const transData = transformSingleReview(data);
      setReview(transData);
    }
  }, [data]);

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
        <Review {...review?.main} main />
        {/* {message_card_data.map((item, index) => {
          return <Review {...item} key={index}/>;
        })} */}

      </div>
    </>
  );
};

export default ReviewChat;
