"use client";

import { useParams, useRouter } from "next/navigation";
import React, {
  useEffect,
  useState,
  useRef,
  useMemo,
  useCallback,
} from "react";
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
import { useChatMessages, useEchoMessages } from "../hooks";
import { useMessageStore } from "@/store/messagesStore";

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
  // Local conversations state, always reset on id change.
  // Track which chat id last loaded
  const lastLoadedId = useRef<string | null>(null);
  // User lookup and info - UserId is the participant ID (user u're chatting...)
  const userId = useMemo(() => {
    const parsed = Number(id);
    return isNaN(parsed) ? null : parsed;
  }, [id]);

  const { messages, setMessages, groupedMessages, isLoading, setIsLoading } =
    useChatMessages(id, isGroupChat);
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
  // const token = localStorage.getItem("user_id");

  const endpoint = useMemo(
    () =>
      isGroupChat ? `/group-chats/${id}` : `/messages/conversations/${id}`,
    [isGroupChat, id]
  );

  const handleNewMessage = useCallback(
    (message: NormalizedMessage) => {
      setMessages((prev) => [...prev, message]);
    },
    [setMessages]
  );

  // Handle read status updates
  const handleMessagesRead = useCallback(
    (messageIds: number[]) => {
      setMessages((prev) =>
        prev.map((msg) =>
          messageIds.includes(msg.id)
            ? { ...msg, seen: true, is_read: true }
            : msg
        )
      );
    },
    [setMessages]
  );

  const { data: apiData, loading, error, refetch } = useFetch<any>(endpoint);
  useEchoMessages(id, handleNewMessage, handleMessagesRead, isGroupChat);

  // const { setPageUsersMsg } = useMessages();
  const setPageUsersMsg = useMessageStore((state) => state.setPageUsersMsg);

  useEffect(() => {
    if (!apiData) {
      console.log("there is no api data", { apiData });
      // refetch({ silent: true });
      return;
    }

    try {
      let normalizedMessages: NormalizedMessage[] = [];
      if (isGroupChat && isGroupChatResponse(apiData.data)) {
        // Ensure this is for the current chat
        if (String(apiData.data.group_chat?.id) === String(id)) {
          normalizedMessages = transformMessagesFromAPI(apiData.data, true);
        }
      } else if (!isGroupChat && isDirectChatResponse(apiData)) {
        normalizedMessages = transformMessagesFromAPI(apiData, false);
      }

      setMessages(normalizedMessages);
      setIsLoading(false);
    } catch (err) {
      console.error("Error processing API data:", err);
      setIsLoading(false);
    }
  }, [apiData, isGroupChat, id, setMessages, setIsLoading, endpoint]);

  // Early returns with proper guards
  if (userId === null) {
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
        {groupedMessages.length > 0
          ? groupedMessages.map((group, index) => (
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
