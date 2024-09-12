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
import Button from "@/components/Form/Button/button";
import MessageCard from "@/components/Message/message-card";
import { message_card_data } from "@/components/Message/data";

const MessagesLayout: React.FC<MessagesLayoutProps> = ({ children }) => {
  const { id } = useParams();

  return (
    <div
      className="w-full rounded-lg bg-white"
      style={{
        boxShadow:
          "0px 1px 2px 0px rgba(21, 30, 43, 0.08), 0px 2px 4px 0px rgba(13, 23, 33, 0.08)",
      }}
    >
      <div className="flex h-[70vh]">
        <div className="flex flex-1 p-4 pr-0">
          <div className="custom-flex-col pr-2 w-full overflow-y-auto custom-round-scrollbar">
            <div className="flex gap-4 sticky top-0 z-[2] bg-white pb-2">
              <Input
                id="search"
                placeholder="Search for messages"
                className="flex-1"
              />
              <Button variant="sky_blue" size="xs_medium" className="py-2 px-7">
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
        <div className="flex-1">
          <div className="custom-flex-col h-full">
            {children}
            <div className="py-4 px-6 flex items-center gap-4">
              <button>
                <Picture src={ClipBlue} alt="attachment" size={24} />
              </button>
              <Input
                id="chat"
                placeholder="Type your message here"
                className="flex-1"
              />
              <button>
                <Picture src={MicrophoneBlue} alt="voice note" size={24} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagesLayout;
