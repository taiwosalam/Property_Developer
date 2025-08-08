"use client";

import React, { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import useFetch from "@/hooks/useFetch";
import useRefetchOnEvent from "@/hooks/useRefetchOnEvent";
import { Modal, ModalContent, ModalTrigger, useModal } from "@/components/Modal/modal";
import Picture from "@/components/Picture/picture";
import Messages from "@/components/Message/messages";
import { TeamChatGroupDetailsModal } from "../GroupDetailsModal";
import { NewMemberComp } from "../NewMemberModal";
import { ChevronLeftIcon } from "lucide-react";
import ChatSkeleton from "@/components/Skeleton/chatSkeleton";
import avatarIcon from "@/public/empty/avatar-2.svg";
import { IChatDetailsPage, transformTeamDetails } from "./data";
import {
  transformMessagesFromAPI,
  groupMessagesByDay,
} from "@/app/(nav)/(messages-reviews)/messages/data";
import Pusher from "pusher-js";
import { GroupChatDetailsResponse } from "./types";
import { empty } from "@/app/config";
import { MessageChat } from "../types";
import { useTeamChat } from "@/contexts/teamChatContext";
import AddMembers from "../AddMembers";
import MemberComponent from "../Member";
import LandlordTenantModalPreset from "@/components/Management/landlord-tenant-modal-preset";

const Chat = () => {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const user_id = useAuthStore((state) => state.user_id);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const rhizome = useRef<string | null>(null);
  const [pageData, setPageData] = useState<null | IChatDetailsPage>(null);
  const [groupedConversations, setGroupedConversations] = useState<any[]>([]);
  const { detailsStep, setDetailsStep } = useTeamChat();


  // Reset detailsStep when modal closes
  useEffect(() => {
    if (!isOpen) {
      setDetailsStep("detail");
    }
  }, [isOpen, setDetailsStep]);

  const {
    data: apiData,
    loading,
    error,
    refetch,
  } = useFetch<GroupChatDetailsResponse>(`/group-chats/${id}`);

  // Pusher setup for real-time messages
  useEffect(() => {
    const pusher = new Pusher(`${process.env.NEXT_PUBLIC_PUSHER_APP_KEY}`, {
      cluster: `${process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER}`,
    });
    const channel = pusher.subscribe(`presence-group-chat.${id}`);
    // channel.bind("new-message", (data: MessageChat) => {
    //   setGroupedConversations((prev) => {
    //     const normalizedMessage = transformMessagesFromAPI(
    //       {
    //         group_chat: { messages: [data] },
    //         unread_count: 0,
    //         pusher: null,
    //       },
    //       true
    //     )[0];
    //     const newConversations = groupMessagesByDay([
    //       ...prev.flatMap((g) => g.messages),
    //       normalizedMessage,
    //     ]);
    //     return newConversations;
    //   });
    // });
    return () => {
      channel.unbind_all();
      channel.unsubscribe();
      pusher.disconnect();
    };
  }, [id]);

  // Fetch and transform group chat details
  useEffect(() => {
    if (apiData && apiData.group_chat) {
      console.log("apiData", apiData);
      const transDetailsData = transformTeamDetails(apiData);
      setPageData(transDetailsData);
      const normalizedMessages = transformMessagesFromAPI(apiData, true);
      setGroupedConversations(groupMessagesByDay(normalizedMessages));
      rhizome.current = id;
    }
  }, [apiData, id]);

  // Poll for new messages every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      refetch({ silent: true });
    }, 10000);
    return () => clearInterval(interval);
  }, [refetch]);

  // Refetch on custom event
  useRefetchOnEvent("refetch_team_message", () => {
    refetch({ silent: true });
  });

  // UI Guards
  if (loading) {
    return <ChatSkeleton />;
  }

  const groupDetails = pageData?.about ?? {
    id: 0,
    group_name: "",
    description: "",
    created_at: "",
    total_members: 0,
    total_active: 0,
    picture: null,
  };

  return (
    <>
      {/* Header */}
      <div className="py-4 px-6 bg-neutral-2 dark:bg-darkText-primary">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/community/team-chat")}
            className="text-black dark:text-white"
          >
            <ChevronLeftIcon size={20} />
          </button>
          <Modal state={{ isOpen, setIsOpen }}>
            <ModalTrigger asChild>
              <div className="flex items-center gap-4 text-left cursor-pointer">
                <Picture
                  src={groupDetails.picture || empty}
                  alt="group picture"
                  containerClassName="custom-secondary-bg rounded-full"
                  size={35}
                  rounded
                />
                <div className="custom-flex-col">
                  <p className="text-text-primary dark:text-white text-base font-medium capitalize">
                    {groupDetails.group_name ?? ""}
                  </p>
                </div>
              </div>
            </ModalTrigger>
            <ModalContent>
              <LandlordTenantModalPreset
                noPaddingTop
                heading={
                  detailsStep === "detail" ? "Group Details" : "Add New Member"
                }
                style={{
                  height: "70vh",
                  position: "relative",
                  width: detailsStep !== "detail" ? "35%" : undefined
                }}
                back={
                  detailsStep !== "detail"
                    ? { handleBack: () => setDetailsStep("detail") }
                    : undefined
                }
              >
                {detailsStep === "detail" ? (
                  <TeamChatGroupDetailsModal
                    about={groupDetails}
                    group_members={pageData?.group_members ?? []}
                  />
                ) : (
                  <MemberComponent />
                )}
              </LandlordTenantModalPreset>
            </ModalContent>
          </Modal>
          <NewMemberComp />
        </div>
      </div>

      {/* Messages */}
      <div className="py-5 px-6 flex-1 overflow-auto custom-round-scrollbar bg-white dark:bg-black custom-flex-col gap-8">
        {groupedConversations.length > 0 ? (
          groupedConversations.map((group, index) => (
            <Messages
              key={index}
              day={group.day}
              messages={group.messages}
              userId={user_id as string}
              chat_type="group"
            />
          ))
        ) : (
          <div className="text-center text-gray-400 py-10">
            No messages yet.
          </div>
        )}
      </div>
    </>
  );
};

export default Chat;
