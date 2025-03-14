"use client";

import React, { useState } from "react";
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

const ReviewsLayout: React.FC<ReviewsLayoutProps> = ({ children }) => {
  const { id } = useParams();

  const { isCustom } = useWindowWidth(900);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      {isCustom && id ? null : (
        <div className="flex flex-1 p-4 pr-0">
          <div className="custom-flex-col pr-2 w-full overflow-y-auto custom-round-scrollbar">
            <div className="flex gap-4 sticky top-0 z-[2] bg-white dark:bg-black pb-2">
              <div className="flex-1 relative">
                <Input
                  id="search"
                  className="w-full"
                  placeholder="Search for messages"
                  leftIcon={"/icons/search-icon.svg"}
                  inputClassName="pr-[52px] border-transparent"
                />
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
              {message_card_data.map((message, idx) => (
                <ReviewCard
                  key={idx}
                  {...{ ...message, replies: message.messages || 0 }}
                  highlight={message.id === id}
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
