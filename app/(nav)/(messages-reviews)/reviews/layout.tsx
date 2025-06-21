"use client";

import React, {
  useEffect,
  useState,
  KeyboardEvent,
  ChangeEvent,
  useRef,
} from "react";
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
import {
  IReviewCard,
  replyComment,
  ReviewResponse,
  transformReviewCard,
} from "./data";
import { usePersonalInfoStore } from "@/store/personal-info-store";
import {
  NegativeIcon,
  NeutralIcon,
  PositiveIcon,
} from "@/components/Message/review-icons";
import NoReviews from "../messages/no-reviews";
import MessageCardSkeleton from "@/components/Skeleton/message-card-skeleton";
import useRefetchOnEvent from "@/hooks/useRefetchOnEvent";
import { handleAxiosError } from "@/services/api";
import { Loader2 } from "lucide-react";

const ReviewsLayout: React.FC<ReviewsLayoutProps> = ({ children }) => {
  const { id } = useParams();
  const [reviews, setReviews] = useState<IReviewCard | null>(null);

  const { isCustom } = useWindowWidth(900);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const { company_id } = usePersonalInfoStore();
  const [inputComment, setInputComment] = useState("");

  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const [isSending, setIsSending] = useState(false);

  const {
    data: reviewData,
    loading,
    error,
    silentLoading,
    refetch,
  } = useFetch<ReviewResponse>(
    company_id ? `/reviews/company/${company_id}` : null
  );
  useRefetchOnEvent("companyReviews", () => refetch({ silent: true }));
  useEffect(() => {
    if (reviewData) {
      const transData = transformReviewCard(reviewData);
      setReviews(transData);
    }
  }, [reviewData]);

  const sendComment = async () => {
    if (!id || !inputComment.length) return;

    try {
      setIsSending(true);
      const res = await replyComment(id as string, inputComment);
      if (res) {
        setInputComment("");
      }
    } catch (error) {
      console.log(error);
      handleAxiosError(error);
    } finally {
      setIsSending(false);
    }
  };

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [reviews]);

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
              {reviews && reviews?.reviews.length > 0 ? (
                reviews?.reviews
                  .slice(0, 6)
                  .map((review, idx) => (
                    <ReviewCard
                      key={idx}
                      {...review}
                      highlight={review.id.toString() === (id as string)}
                    />
                  ))
              ) : (
                // <NoReviews />
                <></>
              )}
            </div>
          </div>
        </div>
      )}
      {(!isCustom || id) && (
        <div className="flex-1">
          <div className="custom-flex-col h-full">
            <div className="flex-1 overflow-y-auto pb-6">
              {children}
              <div ref={messagesEndRef}/>
            </div>
            {id && (
              <div className="py-4 px-6 flex gap-3">
                <input
                  onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
                    if (
                      e.key === "Enter" &&
                      !e.shiftKey &&
                      inputComment.trim() &&
                      !isSending
                    ) {
                      e.preventDefault();
                      sendComment().then(() => {
                        setTimeout(scrollToBottom, 100);
                      });
                    }
                  }}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setInputComment(e.target.value)
                  }
                  value={inputComment}
                  id="chat"
                  placeholder="Type your message here"
                  className="flex-1 text-sm p-3 md:text-sm font-normal rounded-[4px] w-full custom-primary-outline border border-solid border-[#C1C2C366] bg-neutral-2 dark:bg-darkText-primary hover:border-[#00000099] dark:hover:border-darkText-2 transition-colors duration-300 ease-in-out"
                />
                <button
                  disabled={inputComment.length === 0 || isSending}
                  className="bg-brand-9 h-full aspect-square flex justify-center items-center rounded-md"
                  onClick={sendComment}
                >
                  {isSending ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <Picture src={PlaneBlue} alt="send" size={24} />
                  )}
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
