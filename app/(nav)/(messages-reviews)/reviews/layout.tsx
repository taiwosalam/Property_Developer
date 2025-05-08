"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";

// Types
import type { ReviewsLayoutProps } from "./types";

// Images
import PlaneBlue from "@/public/icons/plane-blue.svg";

// Imports
import Input from "@/components/Form/Input/input";
import Picture from "@/components/Picture/picture";
import useWindowWidth from "@/hooks/useWindowWidth";
import Button from "@/components/Form/Button/button";
import ReviewCard from "@/components/Review/review-card";
import { message_card_data } from "@/components/Message/data";
import FilterButton from "@/components/FilterButton/filter-button";
import MessagesFilterMenu from "@/components/Message/messages-filter-menu";
import useFetch from "@/hooks/useFetch";
import ServerError from "@/components/Error/ServerError";
import { IReviewCard, ReviewResponse, transformReviewCard } from "./data";
import { usePersonalInfoStore } from "@/store/personal-info-store";
import {
  NegativeIcon,
  NeutralIcon,
  PositiveIcon,
} from "@/components/Message/review-icons";

const ReviewsLayout: React.FC<ReviewsLayoutProps> = ({ children }) => {
  const { id } = useParams();
  const [reviews, setReviews] = useState<IReviewCard | null>(null);

  const { isCustom } = useWindowWidth(900);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const { company_id } = usePersonalInfoStore();

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const {
    data: reviewData,
    loading,
    error,
  } = useFetch<ReviewResponse>(
    company_id ? `/reviews/company/${company_id}` : null
  );

  useEffect(() => {
    if (reviewData) {
      const transData = transformReviewCard(reviewData);
      setReviews(transData);
    }
  }, [reviewData]);

  if (error) {
    <ServerError error={error} />;
  }

  return (
    <>
      {isCustom && id ? null : (
        <div className="flex flex-1 p-4 pr-0">
          <div className="custom-flex-col pr-2 w-full overflow-y-auto custom-round-scrollbar">
            <div className="flex gap-4 sticky top-0 z-[2] bg-white dark:bg-black pb-2">
              <div className="relative w-full">
                <div className="flex flex-col-reverse md:flex-row gap-4 md:justify-between md:items-center w-full">
                  <div className="flex gap-2 items-center">
                    <div className="p-2 flex items-center gap-2 cursor-pointer">
                      <PositiveIcon size={28} />
                      <p className="text-lg text-[#01BA4C]">10</p>
                    </div>
                    <div className="p-2 flex gap-2 items-center rounded-md border cursor-pointer">
                      <NeutralIcon size={29} />
                      <p className="text-lg text-[#FFBB53]">10</p>
                    </div>
                    <div className="p-2 flex gap-2 items-center cursor-pointer">
                      <NegativeIcon size={28} />
                      <p className="text-lg text-[#E9212E]">10</p>
                    </div>
                  </div>
                  <Input
                    id="search"
                    className="w-full"
                    placeholder="Search for reviews"
                    leftIcon={"/icons/search-icon.svg"}
                    inputClassName="pr-[52px] border-transparent"
                  />
                </div>
                <div className="absolute top-2/4 right-0 -translate-y-2/4">
                  <FilterButton
                    noTitle
                    className="bg-transparent py-[10px] px-4"
                    onClick={(e) => setAnchorEl(e.currentTarget)}
                  />
                  <MessagesFilterMenu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                    filterOptions={[
                      { label: "Positive Review", bgColor: "#01BA4C" },
                      { label: "Neutral Review", bgColor: "#FFBB53" },
                      { label: "Negative Review", bgColor: "#E9212E" },
                      { label: "New Review", bgColor: "#60A5FA" },
                      { label: "Un-replied Review", bgColor: "#005623" },
                    ]}
                  />
                </div>
              </div>
              {/* <Button
                href="/messages"
                variant="sky_blue"
                size="xs_medium"
                className="py-2 px-7"
              >
                see messages
              </Button> */}
            </div>
            <div className="custom-flex-col relative z-[1] pb-4">
              {reviews &&
                reviews?.reviews.length > 0 &&
                reviews?.reviews.map((review, idx) => (
                  <ReviewCard
                    key={idx}
                    {...review}
                    highlight={review.id.toString() === (id as string)}
                  />
                ))}
            </div>
          </div>
        </div>
      )}
      {(!isCustom || id) && (
        <div className="flex-1">
          <div className="custom-flex-col h-full">
            {children}
            {id && (
              <div className="py-4 px-6 flex gap-3">
                <Input
                  id="chat"
                  placeholder="Type your message here"
                  className="flex-1 text-sm"
                />
                <button className="bg-brand-9 h-full aspect-square flex justify-center items-center rounded-md">
                  <Picture src={PlaneBlue} alt="send" size={24} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ReviewsLayout;
