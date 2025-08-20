"use client";

import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState, useRef } from "react";
import { useChatStore } from "@/store/message";
import {
  ChatAPIResponse,
  DirectChatAPIResponse,
  GroupChatAPIResponse,
  groupMessagesByDay,
  isDirectChatResponse,
  isGroupChatResponse,
  mapConversationsArray,
  NormalizedMessage,
  transformMessageFromAPI,
  transformMessagesFromAPI,
} from "../data";
import Picture from "@/components/Picture/picture";
import Messages from "@/components/Message/messages";
import { empty } from "@/app/config";
import { ConversationsUpdatedReturn, ReadEvent, UsersProps } from "../types";
import ChatSkeleton from "@/components/Skeleton/chatSkeleton";
import { useAuthStore } from "@/store/authStore";
import { useGlobalStore } from "@/store/general-store";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import { motion, AnimatePresence } from "framer-motion";
import MessageUserProfileModal from "@/components/Message/message-user-profile";
import { capitalizeWords } from "@/hooks/capitalize-words";
import { UserDetailsResponse } from "@/components/Message/types";
import { getCleanRoleName } from "@/components/Message/data";
import useFetch from "@/hooks/useFetch";
import BadgeIcon, { tierColorMap } from "@/components/BadgeIcon/badge-icon";
import useRefetchOnEvent from "@/hooks/useRefetchOnEvent";
import { ChevronLeftIcon } from "lucide-react";
import { useEcho } from "@/lib/echo";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useMessages } from "@/contexts/messageContext";

const useUserProfile = (id: string | number) => {
  const { data, loading } = useFetch<UserDetailsResponse>(
    `/all-users?identifier=${id}`
  );
  return { profile: data?.data, loading };
};

const useShowContactInfo = (user: any) => {
  const [showContactInfo, setShowContactInfo] = useState(false);
  const showStatus = user?.last_seen?.toLowerCase() !== "offline";
  useEffect(() => {
    if (!showStatus) return;
    const interval = setInterval(
      () => setShowContactInfo((prev) => !prev),
      30000
    );
    return () => clearInterval(interval);
  }, [showStatus]);
  return showContactInfo;
};

const Chat = () => {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const { data, setChatData } = useChatStore();
  const isGroupChat = useGlobalStore((s) => s.isGroupChat);
  const user_id = useAuthStore((state) => state.user_id);
  const users = data?.users?.users || [];
  const messageUserData = useGlobalStore((s) => s.messageUserData);
  const [normalizedMessagesState, setNormalizedMessagesState] = useState<
    NormalizedMessage[]
  >([]);

  const [isLoading, setIsLoading] = useState(true);
  // Local conversations state, always reset on id change.
  const [groupedConversations, setGroupedConversations] = useState<any[]>([]);
  // Track which chat id last loaded
  const lastLoadedId = useRef<string | null>(null);

  // User lookup and info - UserId is the participant ID (user u're chatting...)
  const userId = Number(id);
  const user: UsersProps | undefined =
    messageUserData || users.find((u: UsersProps) => Number(u.id) === userId);

  // Remote profile fetch
  const { profile: userProfileData, loading: loadingUser } = useUserProfile(id);

  // Compose role/badge logic
  const role = getCleanRoleName(userProfileData);
  const specialRoles = [
    "director",
    "account",
    "staff",
    "manager",
    "super-admin",
  ];
  const badgeColor = (() => {
    if (isGroupChat) return undefined;
    if (specialRoles.includes(role)) {
      return userProfileData?.tier_id === 2 ? "gray" : undefined;
    }
    return userProfileData?.tier_id
      ? tierColorMap[userProfileData.tier_id as keyof typeof tierColorMap]
      : undefined;
  })();

  // Contact status cycling
  const showContactInfo = useShowContactInfo(user);

  // Endpoint logic
  const endpoint = isGroupChat
    ? `/group-chats/${id}`
    : `/messages/conversations/${id}`;

  // Message API fetch
  const {
    data: apiData,
    loading,
    error,
    refetch,
  } = useFetch<GroupChatAPIResponse | DirectChatAPIResponse>(endpoint);

  const { setPageUsersMsg } = useMessages();

  // useRefetchOnEvent("refetchMessages", () => refetch({ silent: true }));

  // Poll for new messages every 10 seconds
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     window.dispatchEvent(new Event("refetchMessages"));
  //   }, 10000);
  //   return () => clearInterval(interval);
  // }, []);

  // Clear all messages on id change (store and local)
  useEffect(() => {
    setChatData("conversations", []);
    setGroupedConversations([]);
    lastLoadedId.current = id;
    setIsLoading(true);
  }, [id, setChatData]);

  // When store data updates, update groupedConversations (but only for current id)
  useEffect(() => {
    // Only group if this is the chat id we want
    if (data?.conversations && lastLoadedId.current === id) {
      setGroupedConversations(groupMessagesByDay(data.conversations));
    }
  }, [data?.conversations, id]);

  // On API fetch, set store and groupedConversations but only for current id
  useEffect(() => {
    if (!apiData) return;
    if (isGroupChat && isGroupChatResponse(apiData)) {
      if (String(apiData.group_chat?.id) !== String(id)) return; // don't update for a race
      const normalizedMessages = transformMessagesFromAPI(apiData, true);
      setNormalizedMessagesState(normalizedMessages);
      setChatData("conversations", normalizedMessages);
      setGroupedConversations(groupMessagesByDay(normalizedMessages));
      setIsLoading(false);
    } else if (!isGroupChat && isDirectChatResponse(apiData)) {
      // No reliable id to check for direct, but should be fine
      const normalizedMessages = transformMessagesFromAPI(apiData, false);
      setChatData("conversations", normalizedMessages);
      setNormalizedMessagesState(normalizedMessages);
      setGroupedConversations(groupMessagesByDay(normalizedMessages));
      if (apiData.messages.length > 0) {
        setChatData("receiver", apiData.messages[0].receiver);
      }
      setIsLoading(false);
    }
  }, [apiData, setChatData, isGroupChat, id]);

  const { echo, isConnected, error: Echoerror } = useEcho();

  React.useEffect(() => {
    if (!echo || !isConnected || !id) return;
    const token = window.localStorage.getItem("user_id");
    const channel = echo.private(`user.${token}`);
    console.log("channel connected to", { channel });
    channel.listen(".message.received", (data: any) => {
      console.log("New message:", data);
      const event = new CustomEvent("refetch-users-msg", {
        detail: data,
      });
      window.dispatchEvent(event);
      console.log(data.sender_id, data.sender_id === Number(id), { id });
      if (data.sender_id !== Number(id)) {
        console.log("Not the sanr");
        return;
      }
      const cleanedMessage = transformMessageFromAPI(
        data as unknown as ChatAPIResponse,
        false
      );
      // setChatData("conversations", [...data, cleanedMessage]);
      setGroupedConversations(
        groupMessagesByDay([...normalizedMessagesState, cleanedMessage])
      );
      setNormalizedMessagesState((prev) => [...prev, cleanedMessage]);
    });

    channel.listen(".messages.read", (data: ReadEvent) => {
      console.log("Message read:", data);
      const ids = data.message_ids;
      console.log("do you get this", ids);

      // Fix: Update messages within existing day groups instead of flattening
      setGroupedConversations((prev) =>
        prev.map((dayGroup) => ({
          ...dayGroup,
          messages: dayGroup.messages.map((msg: { id: number }) =>
            data.message_ids.includes(msg.id)
              ? { ...msg, seen: true, is_read: true }
              : msg
          ),
        }))
      );

      // This part is fine - it updates the flat array
      setNormalizedMessagesState((prev) =>
        prev.map((msg) =>
          data.message_ids.includes(msg.id)
            ? { ...msg, seen: true, is_read: true }
            : msg
        )
      );
    });

    channel.listen(".message.sent", (data: any) => {
      const event = new CustomEvent("refetch-users-msg", {
        detail: data,
      });
      window.dispatchEvent(event);
      const cleanedMessage = transformMessageFromAPI(
        data as unknown as ChatAPIResponse,
        false
      );
      // setChatData("conversations", [...data, cleanedMessage]);
      setGroupedConversations(
        groupMessagesByDay([...normalizedMessagesState, cleanedMessage])
      );
      setNormalizedMessagesState((prev) => [...prev, cleanedMessage]);
    });
    // channel.listen(".message.read", (data: ReadEvent) => {});

    channel.listen(
      ".conversation.created",
      (data: ConversationsUpdatedReturn) => {
        setPageUsersMsg((prev) => {
          const updates = mapConversationsArray(data.conversation_data);
          const updatesById = new Map(updates.map((u) => [u.id, u]));
          return prev.map((conv) =>
            updatesById.has(conv.id) ? updatesById.get(conv.id)! : conv
          );
        });
      }
    );

    return () => {
      channel.stopListening(".message.received");
      channel.stopListening(".message.sent");
      channel.stopListening(".messages.read");
      channel.stopListening(".conversations.created");
      echo.leave(`user.${token}`);
    };
  }, [
    echo,
    isConnected,
    id,
    groupedConversations,
    setChatData,
    normalizedMessagesState,
    setPageUsersMsg,
  ]);

  // UI Guards
  if (!userId) {
    router.replace("/messages");
    return null;
  }
  if (loading || isLoading) {
    return <ChatSkeleton />;
  }

  // Render
  return (
    <>
      {/* Header */}
      <div className="py-4 px-6 bg-neutral-2 dark:bg-black">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/messages")}
            className="text-black dark:text-white"
          >
            <ChevronLeftIcon size={20} />
          </button>
          <Modal>
            <ModalTrigger>
              <div className="flex items-center gap-4 text-left">
                <Picture
                  src={user?.imageUrl || empty}
                  alt="profile picture"
                  containerClassName="custom-secondary-bg rounded-full"
                  size={35}
                  rounded
                  status={user?.last_seen?.toLowerCase() === "online"}
                />
                <div className="custom-flex-col">
                  <div className="flex items-center">
                    <p className="text-text-primary dark:text-white text-base font-medium capitalize">
                      {capitalizeWords(user?.name ?? "")}
                    </p>
                    {!isGroupChat && badgeColor && (
                      <BadgeIcon color={badgeColor} />
                    )}
                  </div>
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={showContactInfo ? "contact" : "status"}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.3 }}
                      className="text-text-disabled dark:text-darkText-2 text-[10px] font-normal"
                    >
                      {showContactInfo
                        ? user?.last_seen
                        : "Tap here for contact info"}
                    </motion.p>
                  </AnimatePresence>
                </div>
              </div>
            </ModalTrigger>
            <ModalContent>
              <MessageUserProfileModal id={Number(id)} />
            </ModalContent>
          </Modal>
        </div>
      </div>

      {/* Messages */}
      <div className="py-5 px-6 flex-1 overflow-auto custom-round-scrollbar bg-white dark:bg-black custom-flex-col gap-8">
        {error && <div className="text-red-500 text-center p-2">{error}</div>}
        {groupedConversations.length > 0
          ? groupedConversations.map((group, index) => (
              <Messages
                key={index}
                day={group.day}
                messages={group.messages}
                userId={user_id as string}
                chat_type={isGroupChat ? "group" : "private"}
              />
            ))
          : !loading &&
            !isLoading && (
              <div className="text-center text-gray-400 py-10">
                No messages yet.
              </div>
            )}
      </div>
    </>
  );
};

export default Chat;
