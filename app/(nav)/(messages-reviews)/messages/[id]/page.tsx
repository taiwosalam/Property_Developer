"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useChatStore } from "@/store/message";
import { groupMessagesByDay } from "../data"; // The new grouping helper
import Picture from "@/components/Picture/picture";
import Messages from "@/components/Message/messages";
import { empty } from "@/app/config";
import { UsersProps } from "../types";
import useGetConversation from "@/hooks/getConversation";
import ChatSkeleton from "@/components/Skeleton/chatSkeleton";
import { useAuthStore } from "@/store/authStore";
import { getLocalStorage } from "@/utils/local-storage";

const Chat = () => {
  const router = useRouter();
  const { data, setChatData } = useChatStore();
  const usersData = useChatStore((state) => state?.data?.users);
  const { id } = useParams<{ id: string }>();
  const user_id = useAuthStore((state) => state.user_id);
  const users = usersData?.users || [];
  const userId = Number(id);
  const [isLoading, setIsLoading] = useState(true);
  const store_messages = useChatStore((state) => state?.data?.conversations);
  const [conversations, setConversations] = useState<any[]>([]);
  const users_Id = getLocalStorage("user_id")
  
  // Clear local conversation & store state when conversation id changes.
  useEffect(() => {
    setConversations([]);
    setChatData("conversations", []);
  }, [id, setChatData]);

  // Initiate fetching messages (this hook handles SSE, etc.)
  useGetConversation(`${id}`);

  // When store_messages updates, group messages by day and update local state.
  useEffect(() => {
    if (store_messages) {
      const groupedMessages = groupMessagesByDay(store_messages);
      setConversations(groupedMessages);
    }
  }, [store_messages]);

  useEffect(() => {
    if (usersData) {
      setIsLoading(false);
    }
  }, [usersData]);

  if (isLoading) {
    return <ChatSkeleton />;
  }

  // console.log("users", users)

  // // If user not found, redirect to messages page.
  const user = users.find((user: UsersProps) => Number(user.id) === userId);
  if (!user) {
    router.replace("/messages");
    return null;
  }

  // /management/staff-branch/1/branch-staff/7
  return (
    <>
      <div className="py-4 px-6 bg-neutral-2 dark:bg-black">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push("/messages")}>
            <Picture src="/icons/chevron-left.svg" alt="back" size={20} />
          </button>
          <button className="flex items-center gap-4 text-left">
            <Picture
              src={user?.imageUrl || empty}
              alt="profile picture"
              containerClassName="custom-secondary-bg rounded-full"
              size={32}
              rounded
              status={false}
            />
            <div className="custom-flex-col">
              <p className="text-text-primary dark:text-white text-base font-medium capitalize">
                {user?.name} 
              </p>
              <p className="text-text-disabled dark:text-darkText-2 text-[10px] font-normal">
                Tap here for contact info
              </p>
            </div>
          </button>
        </div>
      </div>
      <div className="py-5 px-6 flex-1 overflow-auto custom-round-scrollbar bg-white dark:bg-black custom-flex-col gap-8">
        {conversations.length > 0 &&
          conversations.map((group, index) => (
            <Messages
              key={index}
              day={group.day}
              messages={group.messages}
              userId={user_id as string}
            />
          ))}
      </div>
    </>
  );
};

export default Chat;