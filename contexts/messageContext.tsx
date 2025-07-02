"use client";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import useFetch from "@/hooks/useFetch";
import { useChatStore } from "@/store/message";
import { getLocalStorage } from "@/utils/local-storage";
import { objectToFormData } from "@/utils/checkFormDataForImageOrAvatar";
import { toast } from "sonner";
import {
  SendMessage,
  SendGroupMessage,
  transformCompanyUsersData,
  transformUsersMessages,
  blobToBase64,
} from "@/app/(nav)/(messages-reviews)/messages/data";
import { useGlobalStore } from "@/store/general-store";
import {
  CompanyUsersAPIResponse,
  ConversationsAPIResponse,
  PageMessages,
} from "@/app/(nav)/(messages-reviews)/messages/types";
import useRefetchOnEvent from "@/hooks/useRefetchOnEvent";

type MessagesContextType = {
  usersData: any;
  messages: PageMessages[];
  filteredMessages: PageMessages[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedFilters: string[];
  setSelectedFilters: (f: string[]) => void;
  selectedBranches: string[];
  setSelectedBranches: (b: string[]) => void;
  message: string;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  reqLoading: boolean;
  setReqLoading: (b: boolean) => void;
  audioUrl: string;
  setAudioUrl: (a: string) => void;
  usersMsgLoading: boolean;
  handleSendMsg: (id: string) => Promise<void>;
  handleSendAudio: (
    id: string,
    blob: Blob | null,
    stopRecording?: VoidFunction
  ) => Promise<void>;
  handleSendImage: (id: string, file: File) => Promise<void>;
  handleSendDocument: (id: string, file: File) => Promise<void>;
  applyFilters: (
    messages: PageMessages[],
    query: string,
    filters: string[],
    branches: string[]
  ) => void;
  refetchUsersMsg: () => void;
};

const MessagesContext = createContext<MessagesContextType | undefined>(
  undefined
);

export const useMessages = () => {
  const ctx = useContext(MessagesContext);
  if (!ctx) throw new Error("useMessages must be used within MessagesProvider");
  return ctx;
};

export const MessagesProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { setChatData } = useChatStore();
  const isGroupChat = useGlobalStore((s) => s.isGroupChat);

  const loggedInUserId = getLocalStorage("user_id");

  const [message, setMessage] = useState("");
  const [reqLoading, setReqLoading] = useState(false);
  const [pageUsersMsg, setPageUsersMsg] = useState<PageMessages[]>([]);
  const [filteredMessages, setFilteredMessages] = useState<PageMessages[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [selectedBranches, setSelectedBranches] = useState<string[]>([]);
  const [audioUrl, setAudioUrl] = useState<string>("");

  // Fetch users and messages
  const { data: usersData } =
    useFetch<CompanyUsersAPIResponse>("/company/users");

  const {
    data: usersMessages,
    loading: usersMsgLoading,
    refetch: refetchUsersMsg,
  } = useFetch<ConversationsAPIResponse>("/messages");
  useRefetchOnEvent("refetch-users-msg", () => {
    refetchUsersMsg({ silent: true });
  });

  // Update messages and apply filters
  useEffect(() => {
    if (usersMessages) {
      const transformed = transformUsersMessages(usersMessages).filter(
        (msg) => msg.id !== loggedInUserId
      );
      setPageUsersMsg(transformed);
      setChatData("users_messages", transformed);
      applyFilters(transformed, searchQuery, selectedFilters, selectedBranches);
    }
    // eslint-disable-next-line
  }, [usersMessages, loggedInUserId, setChatData]);

  useEffect(() => {
    if (usersData) {
      setChatData("users", transformCompanyUsersData(usersData));
    }
  }, [usersData, setChatData]);

  const applyFilters = useCallback(
    (
      messages: PageMessages[],
      query: string,
      filters: string[],
      branches: string[]
    ) => {
      let filtered = [...messages];
      if (query) {
        const lowerQuery = query.toLowerCase();
        filtered = filtered.filter(
          (msg) =>
            (msg.fullname?.toLowerCase() ?? "").includes(lowerQuery) ||
            (msg.desc?.toLowerCase() ?? "").includes(lowerQuery)
        );
      }
      if (filters.length > 0) {
        filtered = filtered.filter((msg) => {
          if (filters.includes("Unread") && msg.unread_count === 0)
            return false;
          return true;
        });
      }
      if (branches.length > 0 && usersData) {
        const userIdsInBranches = usersData.data.users
          .filter((user: any) => branches.includes(user.branch_id))
          .map((user: any) => user.id);
        filtered = filtered.filter((msg) => userIdsInBranches.includes(msg.id));
      }
      setFilteredMessages(filtered);
    },
    [usersData]
  );

  // Update filtered messages when filters/search change
  useEffect(() => {
    applyFilters(pageUsersMsg, searchQuery, selectedFilters, selectedBranches);
  }, [
    pageUsersMsg,
    searchQuery,
    selectedFilters,
    selectedBranches,
    applyFilters,
  ]);

  // Send message handler
  const handleSendMsg = async (id: string) => {
    const payload = {
      content: message,
      content_type: "text",
      receiver_type: isGroupChat ? "group" : "user",
    };
    try {
      setReqLoading(true);
      const sendFn = isGroupChat ? SendGroupMessage : SendMessage;
      const res = await sendFn(objectToFormData(payload), `${id}`);
      if (res) {
        setMessage("");
        window.dispatchEvent(new Event("refetch-users-msg"));
        window.dispatchEvent(new Event("refetchMessages"));
      }
    } catch (err) {
      toast.error("Failed to send msg");
    } finally {
      setReqLoading(false);
    }
  };

  // Send audio handler
  const handleSendAudio = async (
    id: string,
    recordedBlob: Blob | null,
    stopRecording?: VoidFunction
  ) => {
    if (!recordedBlob) return;
    const audioFile = new File([recordedBlob], "voice-note.wav", {
      type: recordedBlob.type,
    });
  
    // const base64Audio = await blobToBase64(recordedBlob);
  
    const payload = {
      [isGroupChat ? "file" : "content_file"]: isGroupChat
        ? audioFile
        : audioFile,
      content_type: "audio",
      receiver_type: isGroupChat ? "group" : "user",
    };

    console.log("typeof audioFile", typeof audioFile)
    try {
      setReqLoading(true);
      const sendFn = isGroupChat ? SendGroupMessage : SendMessage;
      const res = await sendFn(objectToFormData(payload), `${id}`);
      if (res) {
        setAudioUrl("");
        if (stopRecording) stopRecording(); // safe call
        setMessage("");
        window.dispatchEvent(new Event("refetch-users-msg"));
        window.dispatchEvent(new Event("refetchMessages"));
      }
    } catch (err) {
      toast.error("Failed to send audio message");
    } finally {
      setReqLoading(false);
    }
  };

  // Send image handler
  const handleSendImage = async (id: string, file: File) => {
    if (!file) return;
    try {
      setReqLoading(true);
      const base64Img = await blobToBase64(file);
      const payload = {
        [isGroupChat ? "file" : "content_file"]: isGroupChat ? file : file,
        content_type: "file",
        receiver_type: isGroupChat ? "group" : "user",
      };
      const sendFn = isGroupChat ? SendGroupMessage : SendMessage;
      const res = await sendFn(objectToFormData(payload), `${id}`);
      if (res) {
        window.dispatchEvent(new Event("refetch-users-msg"));
        window.dispatchEvent(new Event("refetchMessages"));
      }
    } catch (err) {
      toast.error("Failed to send image");
    } finally {
      setReqLoading(false);
    }
  };

  // Send document handler
  const handleSendDocument = async (id: string, file: File) => {
    if (!file) return;
    try {
      setReqLoading(true);
      const base64Doc = await blobToBase64(file);
      const payload = {
        [isGroupChat ? "content" : "content_file"]: isGroupChat ? base64Doc : file,
        content_type: "file",
        receiver_type: isGroupChat ? "group" : "user",
      };
      const sendFn = isGroupChat ? SendGroupMessage : SendMessage;
      const res = await sendFn(objectToFormData(payload), `${id}`);
      if (res) {
        window.dispatchEvent(new Event("refetch-users-msg"));
        window.dispatchEvent(new Event("refetchMessages"));
      }
    } catch (err) {
      toast.error("Failed to send document");
    } finally {
      setReqLoading(false);
    }
  };


  return (
    <MessagesContext.Provider
      value={{
        usersData,
        messages: pageUsersMsg,
        filteredMessages,
        searchQuery,
        setSearchQuery,
        selectedFilters,
        setSelectedFilters,
        selectedBranches,
        setSelectedBranches,
        message,
        setMessage,
        reqLoading,
        setReqLoading,
        audioUrl,
        setAudioUrl,
        usersMsgLoading,
        handleSendMsg,
        handleSendAudio,
        handleSendImage,
        handleSendDocument,
        applyFilters,
        refetchUsersMsg,
      }}
    >
      {children}
    </MessagesContext.Provider>
  );
};
