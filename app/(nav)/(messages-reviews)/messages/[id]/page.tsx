"use client";

import { useParams, useRouter } from "next/navigation";

// Images
import ChevronLeft from "@/public/icons/chevron-left.svg";

// Imports
import Picture from "@/components/Picture/picture";
import Messages from "@/components/Message/messages";
import { message_card_data, message_data } from "@/components/Message/data";
import { useChatStore } from "@/store/message";
import { empty } from "@/app/config";
import { UsersProps } from "../types";
import useGetConversation from "@/hooks/getConversation";
import { useEffect, useState } from "react";
import { transformMessages } from "../data";
// import { transformMessages } from "../data";

const Chat = () => {
  const router = useRouter();
  const { data, setChatData } = useChatStore();
  const usersData = useChatStore((state) => state?.data?.users);
  const { id } = useParams<{ id: string }>();
  const users = usersData?.users || [];
  const userId = Number(id);
  const store_messages = useChatStore((state) => state?.data?.conversations);
  const [conversations, setConversations] = useState<any[]>([]);
  // Find user whose ID matches the route ID
  const user = users.find((user: UsersProps) => Number(user.id) === Number(userId));
  const messages = useGetConversation(`${id}`);

  
  useEffect(() => {
    if (store_messages) {
      const transformedMessages = transformMessages(store_messages); // Get transformed messages

      setConversations((prevConversations) => {
        // Filter out the transformed messages that already exist in prevConversations
        const newMessages = transformedMessages.filter((newMessage: any) =>
          !prevConversations.some(
            (existingMessage: any) => existingMessage.id === newMessage.id
          )
        );

        return [...prevConversations, ...newMessages]; // Add only the unique messages
      });
    }
  }, [store_messages]);
  
  
  // If user not found, redirect to messages page
  if (!user) {
    router.replace("/messages");
    return null;
  }

  return (
    <>
      <div className="py-4 px-6 bg-neutral-2 dark:bg-black">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push("/messages")}>
            <Picture src={ChevronLeft} alt="back" size={20} />
          </button>
          <button className="flex items-center gap-4 text-left">
            <Picture
              src={user?.imageUrl || empty}
              alt="profile picture"
              containerClassName="custom-secondary-bg rounded-full"
              size={32}
              rounded
              status
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
        {conversations?.length > 0 &&
          conversations.map((m) => (
            <>
              <Messages day={m?.day} messages={m?.details} userId={user?.id} />
            </>
          ))
        }
      </div>
    </>
  );
};

export default Chat;
