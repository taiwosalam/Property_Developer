"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

// Images
import ChevronLeft from "@/public/icons/chevron-left.svg";

// Imports
import Picture from "@/components/Picture/picture";
import Messages from "@/components/Message/messages";
import { formatDate, team_chat_data, transformMessageData } from "../data";
import { ModalContent, ModalTrigger } from "@/components/Modal/modal";
import { Modal } from "@/components/Modal/modal";
import { TeamChatGroupDetailsModal } from "../GroupDetailsModal";
import { useTeamChatStore } from "@/store/teamChatStore";
import { NewMemberComp } from "../NewMemberModal";
import { Chevron } from "@/public/icons/icons";
import DeleteModal from "../DeleteModal";
import useFetch from "@/hooks/useFetch";
import Image from "next/image";
import avatarIcon from "@/public/empty/avatar-2.svg";
import { TeamChatHeaderSkeleton } from "@/components/Skeleton/member-card-skeleton";
import { GroupChatResponse, MessageChat, MessageChats } from "../types";
import { GroupChatDetailsResponse } from "./types";
import useRefetchOnEvent from "@/hooks/useRefetchOnEvent";
import ChatSkeleton from "@/components/Skeleton/chatSkeleton";
import { groupMessagesByDay } from "@/app/(nav)/(messages-reviews)/messages/data";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import advancedFormat from "dayjs/plugin/advancedFormat";
import { useAuthStore } from "@/store/authStore";
import NoMessage from "@/app/(nav)/(messages-reviews)/messages/messages-component";
import { IChatDetailsPage, transformTeamDetails } from "./data";
import Pusher from "pusher-js";
dayjs.extend(relativeTime);
dayjs.extend(advancedFormat);

const Chat = () => {
  const router = useRouter();
  const { id } = useParams();
  const [pageData, setPageData] = useState<null | IChatDetailsPage>(null);

  const [chatMessages, setChatMessages] = useState<MessageChat[] | null>(null);
  const [conversations, setConversations] = useState<any[]>([]);
  const user_id = useAuthStore((state) => state.user_id);

  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    // Initialize Pusher
    const pusher = new Pusher(`${process.env.NEXT_PUBLIC_PUSHER_APP_KEY}`, {
      // Replace with your Pusher App Key
      cluster: `${process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER}`, // Replace with your Pusher App Cluster
    });

    // Subscribe to the channel
    const channel = pusher.subscribe(`presence-group-chat.${id.toString()}`);

    // Bind to the 'new-message' event
    channel.bind("new-message", (data: any) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    // Unsubscribe when the component unmounts
    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [id.toString()]); // Re-run the effect when the groupId changes

  // ... (rest of your component)

  const {
    data: apiData,
    loading,
    silentLoading,
    refetch,
  } = useFetch<GroupChatDetailsResponse>(`group-chats/${id}`);

  useEffect(() => {
    if (apiData) {
      const transDetailsData = transformTeamDetails(apiData);
      setPageData(transDetailsData);
    }
  }, [apiData]);

  const groupDetails = apiData?.group_chat;

  useEffect(() => {
    if (apiData) {
      setChatMessages(apiData?.group_chat?.chats);
    }
  }, [apiData]);

  useRefetchOnEvent("refetchTeam", () => {
    refetch({ silent: true });
  });

  useEffect(() => {
  if (!id) return;

  const interval = setInterval(() => {
    refetch({ silent: true });
  }, 3000);

  const handleRefetch = () => {
    refetch({ silent: true });
  };
  window.addEventListener("refetchTeam", handleRefetch);

  return () => {
    clearInterval(interval);
    window.removeEventListener("refetchTeam", handleRefetch);
  };
}, [id, refetch]);

  useEffect(() => {
    const groupedMessagesArray = chatMessages
      ? Object.entries(
          chatMessages.reduce((acc: { [key: string]: any[] }, message) => {
            const formattedDate = formatDate(message.created_at);
            //const dateKey = dayjs(message.created_at).format("YYYY-MM-DD"); // Group by date
            if (!acc[formattedDate]) acc[formattedDate] = [];
            acc[formattedDate].push(message);
            return acc;
          }, {})
        )
          .map(([date, messages]) => ({
            day: date,
            messages,
          }))
          .reverse()
      : [];
    setConversations(groupedMessagesArray);
  }, [chatMessages]);

  if (loading) {
    return <ChatSkeleton />;
  }

  return (
    <>
      <div className="py-4 px-6 bg-neutral-2 dark:bg-darkText-primary">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/community/team-chat")}
            className="text-dark dark:text-white"
          >
            <Chevron size={20} />
          </button>
          {loading ? (
            <TeamChatHeaderSkeleton />
          ) : (
            <button className="flex items-center gap-4 text-left">
              <Modal>
                <ModalTrigger asChild>
                  <div className="flex gap-2 items-center">
                    {groupDetails?.picture ? (
                      <Picture
                        src={groupDetails?.picture}
                        alt="profile picture"
                        size={32}
                        rounded
                        status
                      />
                    ) : (
                      <Picture src={avatarIcon} size={32} rounded status />
                    )}
                    <p className="text-text-primary dark:text-white text-base font-medium capitalize">
                      {groupDetails?.name ?? ""}
                    </p>
                  </div>
                </ModalTrigger>
                <ModalContent>
                  {pageData?.about && (
                    <TeamChatGroupDetailsModal
                      about={pageData.about}
                      group_members={pageData?.group_members}
                    />
                  )}
                </ModalContent>
              </Modal>
            </button>
          )}
          <NewMemberComp />
        </div>
      </div>
      <div className="py-5 px-6 flex-1 overflow-auto custom-round-scrollbar bg-white dark:bg-black custom-flex-col gap-8">
        {conversations.length > 0 ? (
          conversations.map((group, index) => {
            return (
              <Messages
                key={index}
                day={group.day}
                messages={transformMessageData(group.messages)}
                userId={user_id as string}
              />
            );
          })
        ) : (
          <div className="flex justify-center items-center my-auto mx-auto">
            <h2>No messages yet</h2>
          </div>
        )}
      </div>
    </>
  );
};

export default Chat;
