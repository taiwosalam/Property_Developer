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
  const [filter, setFilter] = useState<
    "positive" | "neutral" | "negative" | "new" | "unreplied" | "all"
  >("all");

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState("");

  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

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


  const filteredReviews =
    reviews?.reviews.filter((review) => {
      // Apply text search first
      const matchesSearch = review.review
        .toLowerCase()
        .includes(searchInput.toLowerCase());

      if (!matchesSearch) return false;

      // If no filters selected, show all search-matching reviews
      if (selectedFilters.length === 0) return true;

      // Apply selected filters
      return selectedFilters.some((filterType) => {
        if (filterType === "Positive Review") return review.down_vote > 0;
        if (filterType === "Neutral Review")
          return review.up_vote === 0 && review.down_vote === 0;
        if (filterType === "Negative Review") return review.up_vote > 0;
        if (filterType === "New Review") {
          const sevenDaysAgo = new Date();
          sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
          const reviewDate = new Date(review.created_at);
          return reviewDate >= sevenDaysAgo;
        }
        if (filterType === "Un-replied Review") {
          return review.comment_count === 0 || review?.comments?.length === 0;
        }
        return false;
      });
    }) || [];

  const handleFilterApply = (filters: string[]) => {
    setSelectedFilters(filters);
    setSelectedLabel(filters.length > 0 ? filters.join(", ") : null);
    handleMenuClose();
  };

  // CORRECTED: Fixed toggle logic with proper state synchronization
  const toggleFilter = (filterType: string) => {
    setSelectedFilters((prev) => {
      const isCurrentlySelected = prev.includes(filterType);

      if (isCurrentlySelected) {
        // Remove the filter if it's already selected
        const newFilters = prev.filter((f) => f !== filterType);
        setSelectedLabel(newFilters.length > 0 ? newFilters.join(", ") : null);
        return newFilters;
      } else {
        // Add the filter, but remove other sentiment filters first (only allow one sentiment filter at a time)
        const newFilters = [
          ...prev.filter(
            (f) =>
              ![
                "Positive Review",
                "Neutral Review",
                "Negative Review",
              ].includes(f)
          ),
          filterType,
        ];
        setSelectedLabel(newFilters.length > 0 ? newFilters.join(", ") : null);
        return newFilters;
      }
    });
  };

  // CORRECTED: Fixed click handlers with proper state sync
  const handleFilterClick = (
    filterType: string,
    visualState: "positive" | "neutral" | "negative"
  ) => {
    const isCurrentlyActive = selectedFilters.includes(filterType);

    if (isCurrentlyActive) {
      // If currently active, deactivate it
      setFilter("all");
      toggleFilter(filterType);
    } else {
      // If not active, activate it
      setFilter(visualState);
      toggleFilter(filterType);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [reviews]);

  if (error) {
    return <ServerError error={error} />;
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
                    <div
                      className={`flex items-center flex-col ${
                        selectedFilters.includes("Positive Review")
                          ? "border rounded-md"
                          : ""
                      }`}
                    >
                      <div
                        className={`p-2 flex items-center gap-2 cursor-pointer ${
                          selectedFilters.includes("Positive Review") ? "" : ""
                        }`}
                        onClick={() =>
                          handleFilterClick("Positive Review", "positive")
                        }
                      >
                        <PositiveIcon size={28} />
                        <p className="text-lg text-[#01BA4C]">
                          {reviews?.total_dislike}
                        </p>
                      </div>
                      <p className="text-xs text-[#01BA4C]">Positive</p>
                    </div>

                    <div
                      className={`flex items-center flex-col ${
                        selectedFilters.includes("Neutral Review")
                          ? "border rounded-md"
                          : ""
                      }`}
                    >
                      <div
                        className={`p-2 flex gap-2 items-center rounded-md cursor-pointer ${
                          selectedFilters.includes("Neutral Review") ? "" : ""
                        }`}
                        onClick={() =>
                          handleFilterClick("Neutral Review", "neutral")
                        }
                      >
                        <NeutralIcon size={29} />
                        <p className="text-lg text-[#FFBB53]">
                          {(reviews?.neutral_count ?? 0) < 0
                            ? 0
                            : reviews?.neutral_count ?? null}
                        </p>
                      </div>
                      <p className="text-xs text-[#FFBB53]">Neutral</p>
                    </div>

                    <div
                      className={`flex items-center flex-col ${
                        selectedFilters.includes("Negative Review")
                          ? "border rounded-md"
                          : ""
                      }`}
                    >
                      <div
                        className={`p-2 flex gap-2 items-center cursor-pointer ${
                          selectedFilters.includes("Negative Review") ? "" : ""
                        }`}
                        onClick={() =>
                          handleFilterClick("Negative Review", "negative")
                        }
                      >
                        <NegativeIcon size={28} />
                        <p className="text-lg text-[#E9212E]">
                          {reviews?.total_like}
                        </p>
                      </div>
                      <p className="text-xs text-[#E9212E]">Negative</p>
                    </div>
                  </div>
                  <Input
                    id="search"
                    value={searchInput}
                    onChange={(value: string) => setSearchInput(value)}
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
                    onFilterApply={handleFilterApply}
                    setSelectedLabel={setSelectedLabel}
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
            </div>
            <div className="custom-flex-col relative z-[1] pb-4">
              {loading ? (
                <div className="flex justify-center items-center mt-52">
                  <Loader2 className="animate-spin" size={32} />
                </div>
              ) : filteredReviews?.length > 0 ? (
                filteredReviews?.map((review, idx) => (
                  <ReviewCard
                    key={review.id} // Better to use unique id instead of index
                    {...review}
                    highlight={review.id.toString() === (id as string)}
                  />
                ))
              ) : (
                <div className="text-slate-500 flex justify-center items-center mt-52">
                  {reviews?.reviews?.length === 0
                    ? "No reviews available."
                    : "No reviews match the selected filter."}
                </div>
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
              <div ref={messagesEndRef} />
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
