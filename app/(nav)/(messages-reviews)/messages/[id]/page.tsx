"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { useChatStore } from "@/store/message";
import {
  DirectChatAPIResponse,
  GroupChatAPIResponse,
  groupMessagesByDay,
  isDirectChatResponse,
  isGroupChatResponse,
  transformMessagesFromAPI,
} from "../data";
import Picture from "@/components/Picture/picture";
import Messages from "@/components/Message/messages";
import { empty } from "@/app/config";
import { UsersProps } from "../types";
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

  const [isLoading, setIsLoading] = useState(true);
  // Local conversations state, always reset on id change.
  const [groupedConversations, setGroupedConversations] = useState<any[]>([]);
  // Track which chat id last loaded
  const lastLoadedId = useRef<string | null>(null);

  // User lookup and info
  const userId = Number(id);
  const user: UsersProps | undefined =
    messageUserData || users.find((u: UsersProps) => Number(u.id) === userId);

  // Remote profile fetch
  const { profile: userProfileData, loading: loadingUser } = useUserProfile(id);

  // Compose role/badge logic
  // const role = getCleanRoleName(userProfileData);
  // const isAcct = role === "director" || role === "manager" || role === "staff";
  // const showActBadge = isAcct && userProfileData?.tier_id === 2;
  // const badgeColor =
  //   tierColorMap[userProfileData?.tier_id as keyof typeof tierColorMap] ||
  //   "gray";

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

  useRefetchOnEvent("refetchMessages", () => refetch({ silent: true }));

  // Poll for new messages every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      window.dispatchEvent(new Event("refetchMessages"));
    }, 10000);
    return () => clearInterval(interval);
  }, []);

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
      setChatData("conversations", normalizedMessages);
      setGroupedConversations(groupMessagesByDay(normalizedMessages));
      setIsLoading(false);
    } else if (!isGroupChat && isDirectChatResponse(apiData)) {
      // No reliable id to check for direct, but should be fine
      const normalizedMessages = transformMessagesFromAPI(apiData, false);
      setChatData("conversations", normalizedMessages);
      setGroupedConversations(groupMessagesByDay(normalizedMessages));
      if (apiData.messages.length > 0) {
        setChatData("receiver", apiData.messages[0].receiver);
      }
      setIsLoading(false);
    }
  }, [apiData, setChatData, isGroupChat, id]);

  // UI Guards
  if (!user) {
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
                        ? user.last_seen
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
