"use client";
import { useState } from "react";
import ChatList from "./chat-list";
import IndividualChat from "./individual-chat";
import LogoPlaceholder from "@/public/empty/logo-placeholder.svg";
import Image from "next/image";

const StaffChat = () => {
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const closeChat = () => setActiveChatId(null);
  return (
    <div
      className="rounded-lg lg:flex items-stretch"
      style={{
        boxShadow:
          "0px 1px 2px 0px rgba(21, 30, 43, 0.08), 0px 2px 4px 0px rgba(13, 23, 33, 0.08)",
      }}
    >
      <div
        className={`${
          activeChatId ? "hidden" : "block"
        } lg:block lg:w-[43%] lg:pr-2 bg-white dark:bg-darkText-primary rounded-lg lg:rounded-r-none max-h-[600px] overflow-auto custom-round-scrollbar`}
      >
        <ChatList
          activeChatId={activeChatId}
          setActiveChatId={setActiveChatId}
        />
      </div>

      <div
        className={`${
          activeChatId ? "block" : "hidden"
        } lg:block lg:flex-1 rounded-lg lg:rounded-l-none max-h-[600px] overflow-auto custom-round-scrollbar`}
      >
        {activeChatId ? (
          <IndividualChat closeChat={closeChat} />
        ) : (
          <div className="h-full custom-flex-col gap-4 items-center justify-center">
            <div className="flex justify-center">
              <Image src={LogoPlaceholder} alt="logo" width={200} />
            </div>
            <p className="text-center text-text-quaternary dark:text-darkText-1 text-sm font-normal">
              Select a chat to view conversation
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffChat;
