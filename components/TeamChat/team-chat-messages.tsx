"use client";

import { useParams } from "next/navigation";
import Messages from "@/components/Message/messages";
import { useAuthStore } from "@/store/authStore";
import NoMessage from "@/app/(nav)/(messages-reviews)/messages/messages-component";
import ChatSkeleton from "@/components/Skeleton/chatSkeleton";
import { useRef, useEffect } from "react";
import { useTeamChat } from "@/contexts/teamChatContext";

const TeamChatMessages = () => {
  const { id } = useParams<{ id: string }>();
  const { groupedMessages, silentLoading } = useTeamChat();
  const user_id = useAuthStore((state) => state.user_id);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [groupedMessages]);

  if (silentLoading) return <ChatSkeleton />;
  if (!id) return <NoMessage />;

  return (
    <div
      ref={chatContainerRef}
      className="py-5 px-6 flex-1 overflow-auto custom-round-scrollbar bg-white dark:bg-black custom-flex-col gap-8"
    >
      {groupedMessages.length > 0 ? (
        groupedMessages.map((group, index) => (
          <Messages
            key={index}
            day={group.day}
            messages={group.messages}
            userId={user_id as string}
          />
        ))
      ) : (
        <div className="flex justify-center items-center my-auto">
          <h2>No messages yet</h2>
        </div>
      )}
    </div>
  );
};

export default TeamChatMessages;
