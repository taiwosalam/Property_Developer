"use client";

import React from "react";
import { useParams } from "next/navigation";

// Types
import type { ReviewsLayoutProps } from "./types";

// Images
import PlaneBlue from "@/public/icons/plane-blue.svg";

// Imports
import Input from "@/components/Form/Input/input";
import Picture from "@/components/Picture/picture";
import Button from "@/components/Form/Button/button";
import ReviewCard from "@/components/Review/review-card";
import { message_card_data } from "@/components/Message/data";

const ReviewsLayout: React.FC<ReviewsLayoutProps> = ({ children }) => {
  const { id } = useParams();

  return (
    <>
      <div className="flex flex-1 p-4 pr-0">
        <div className="custom-flex-col pr-2 w-full overflow-y-auto custom-round-scrollbar">
          <div className="flex gap-4 sticky top-0 z-[2] bg-white pb-2">
            <Input
              id="search"
              placeholder="Search for messages"
              className="flex-1"
            />
            <Button variant="sky_blue" size="xs_medium" className="py-2 px-7">
              see messages
            </Button>
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
    </>
  );
};

export default ReviewsLayout;
