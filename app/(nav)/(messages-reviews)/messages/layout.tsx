"use client";

import React from "react";
import { useParams } from "next/navigation";

// Types
import type { MessagesLayoutProps } from "./types";

// Images
import ClipBlue from "@/public/icons/clip-blue.svg";
import MicrophoneBlue from "@/public/icons/microphone-blue.svg";

// Imports
import Input from "@/components/Form/Input/input";
import Picture from "@/components/Picture/picture";
import useWindowWidth from "@/hooks/useWindowWidth";
import Button from "@/components/Form/Button/button";
import MessageCard from "@/components/Message/message-card";
import { message_card_data } from "@/components/Message/data";
import FilterButton from "@/components/FilterButton/filter-button";

const MessagesLayout: React.FC<MessagesLayoutProps> = ({ children }) => {
  const { id } = useParams();

  const { isCustom } = useWindowWidth(900);

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
                    style={{
                      padding: "10px 16px",
                      backgroundColor: "transparent",
                    }}
                  />
                </div>
              </div>
              <Button
                href="/reviews"
                variant="sky_blue"
                size="xs_medium"
                className="py-2 px-7 dark:bg-darkBrand-primary"
              >
                see reviews
              </Button>
            </div>
            <div className="custom-flex-col relative z-[1] pb-4">
              {message_card_data.map((message, idx) => (
                <MessageCard
                  key={idx}
                  {...message}
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
              <div className="py-4 px-6 flex items-center gap-4">
                <button>
                  <Picture src={ClipBlue} alt="attachment" size={24} />
                </button>
                <Input
                  id="chat"
                  placeholder="Type your message here"
                  className="flex-1 text-sm"
                />
                <button>
                  <Picture src={MicrophoneBlue} alt="voice note" size={24} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default MessagesLayout;
