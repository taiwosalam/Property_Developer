"use client";

import React, {
  useEffect,
  useState,
  useRef,
  useMemo,
  useCallback,
} from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import useFetch from "@/hooks/useFetch";
import useRefetchOnEvent from "@/hooks/useRefetchOnEvent";
import {
  Modal,
  ModalContent,
  ModalTrigger,
  useModal,
} from "@/components/Modal/modal";
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
  NormalizedMessage,
} from "@/app/(nav)/(messages-reviews)/messages/data";
import Pusher from "pusher-js";
import { GroupChatDetailsResponse } from "./types";
import { empty } from "@/app/config";
import { MessageChat } from "../types";
import { useTeamChat } from "@/contexts/teamChatContext";
import AddMembers from "../AddMembers";
import MemberComponent from "../Member";
import LandlordTenantModalPreset from "@/components/Management/landlord-tenant-modal-preset";
import {
  useChatMessagesQuery,
  useEchoMessages,
} from "@/app/(nav)/(messages-reviews)/messages/hooks";
import { saveTeamData, useTeamDetailsStore } from "@/store/teamdetailsstore";

const Chat = () => {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const user_id = useAuthStore((state) => state.user_id);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const rhizome = useRef<string | null>(null);
  const [groupedConversations, setGroupedConversations] = useState<any[]>([]);
  const { detailsStep, setDetailsStep } = useTeamChat();
  const [localMessages, setLocalMessages] = useState<NormalizedMessage[]>([]);
  const teamDetails = useTeamDetailsStore((s) => s.teamDetails);

  // Reset detailsStep when modal closes
  useEffect(() => {
    if (!isOpen) {
      setDetailsStep("detail");
    }
  }, [isOpen, setDetailsStep]);
  const pageData = teamDetails;
  // const {
  //   data: apiData,
  //   loading,
  //   error,
  //   refetch,
  // } = useFetch<GroupChatDetailsResponse>(`/group-chats/${id}`);

  const {
    messages: { api, normalizedMessages: apiData },
    isPending,
    isLoading: loading,
    error,
    refetch,
  } = useChatMessagesQuery(id, true);

  useEffect(() => {
    if (api) {
      saveTeamData(api);
    }
  }, [api]);

  const groupedMessages = useMemo(
    () => groupMessagesByDay(localMessages),
    [localMessages]
  );

  // Echo handlers
  const handleNewMessage = useCallback((message: NormalizedMessage) => {
    setLocalMessages((prev) => [...prev, message]);
  }, []);

  const handleMessagesRead = useCallback((messageIds: number[]) => {
    setLocalMessages((prev) =>
      prev.map((msg) =>
        messageIds.includes(msg.id)
          ? { ...msg, seen: true, is_read: true }
          : msg
      )
    );
  }, []);
  // bad code pl
  useEchoMessages(id, handleNewMessage, handleMessagesRead, true, true);

  // Fetch and transform group chat details
  useEffect(() => {
    console.log("logging api data from the efefct", { apiData });
    if (apiData) {
      setLocalMessages(apiData);
      const normalizedMessages = apiData;
      setGroupedConversations(groupMessagesByDay(normalizedMessages));
      rhizome.current = id;
    }
  }, [apiData, id]);

  useEffect(() => {
    refetch();
  }, [id]);

  if (groupedMessages.length < 1 && loading) {
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
                  width: detailsStep !== "detail" ? "35%" : undefined,
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
        {groupedMessages.length > 0 ? (
          groupedMessages.map((group, index) => (
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
