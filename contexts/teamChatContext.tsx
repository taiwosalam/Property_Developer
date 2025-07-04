"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
} from "react";
import { useParams } from "next/navigation";
import useFetch from "@/hooks/useFetch";
import useRefetchOnEvent from "@/hooks/useRefetchOnEvent";
import { toast } from "sonner";
import { objectToFormData } from "@/utils/checkFormDataForImageOrAvatar";
import {
  IGroupChatCard,
  transformGroupChatListData,
} from "@/app/(nav)/community/team-chat/team.data";
import { TeamChatResponseData } from "@/app/(nav)/community/team-chat/types";
import { sendTeamMessage } from "@/app/(nav)/community/team-chat/[id]/data";
import { SendGroupMessage } from "@/app/(nav)/(messages-reviews)/messages/data";

type TeamChatContextType = {
  teamChatPageData: IGroupChatCard | null;
  searchTerm: string;
  setSearchTerm: (q: string) => void;
  isSearch: boolean;
  setIsSearch: (b: boolean) => void;
  message: string;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  reqLoading: boolean;
  audioUrl: string;
  setAudioUrl: (a: string) => void;
  filteredMemberList: any[];
  groupedMessages: any[];
  loading: boolean;
  silentLoading: boolean;
  error: any;
  isNetworkError: boolean;
  handleSendMsg: (id: string) => Promise<void>;
  handleSendAudio: (
    id: string,
    blob: Blob | null,
    stopRecording?: VoidFunction
  ) => Promise<void>;
  refetch: (options?: { silent: boolean }) => void;
};

const TeamChatContext = createContext<TeamChatContextType | undefined>(
  undefined
);

export const useTeamChat = () => {
  const ctx = useContext(TeamChatContext);
  if (!ctx) throw new Error("useTeamChat must be used within TeamChatProvider");
  return ctx;
};

export const TeamChatProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const params = useParams();
  const paramId = params.id;
  const [groupId, setGroupId] = useState(paramId ?? "");
  const [teamChatPageData, setTeamChatPageData] =
    useState<IGroupChatCard | null>(null);
  const [isSearch, setIsSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [message, setMessage] = useState("");
  const [reqLoading, setReqLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string>("");
  const [groupedMessages, setGroupedMessages] = useState<any[]>([]);

  const {
    data: teamData,
    refetch,
    loading,
    silentLoading,
    error,
    isNetworkError,
  } = useFetch<TeamChatResponseData>("group-chats");

  useRefetchOnEvent("refetchTeamChat", () => {
    refetch({ silent: true });
  });

  useEffect(() => {
    if (teamData) {
      const transData = transformGroupChatListData(teamData);
      setTeamChatPageData(transData);
    }
  }, [teamData]);

  useEffect(() => {
    if (paramId) {
      setGroupId(paramId);
    }
  }, [paramId]);

  const filteredMemberList = useMemo(() => {
    if (!teamChatPageData?.team || teamChatPageData.team.length === 0) {
      return [];
    }
    if (!searchTerm.trim()) {
      return teamChatPageData.team;
    }
    return teamChatPageData.team.filter((team) =>
      team.fullname.toLowerCase().includes(searchTerm.toLowerCase().trim())
    );
  }, [teamChatPageData?.team, searchTerm]);

  const handleSendMsg = async (id: string) => {
    try {
      setReqLoading(true);
      const res = await sendTeamMessage(id, message, "text");
      if (res) {
        setMessage("");
        window.dispatchEvent(new Event("refetch_team_message"));
      }
    } catch (err) {
      toast.error("Failed to send message");
    } finally {
      setReqLoading(false);
    }
  };

  // const handleSendAudio = async (
  //   id: string,
  //   recordedBlob: Blob | null,
  //   stopRecording?: VoidFunction
  // ) => {
  //   if (!recordedBlob) return;
  //   const audioFile = new File([recordedBlob], "voice-note.wav", {
  //     type: recordedBlob.type,
  //   });
  //   const payload = { file: audioFile };
  //   try {
  //     setReqLoading(true);
  //     const res = await sendTeamMessage(id, objectToFormData(payload), "audio");
  //     if (res) {
  //       setAudioUrl("");
  //       if (stopRecording) stopRecording();
  //       window.dispatchEvent(new Event("refetch_team_message"));
  //     }
  //   } catch (err) {
  //     toast.error("Failed to send audio message");
  //   } finally {
  //     setReqLoading(false);
  //   }
  // };

  // Send audio handler from msg
  const handleSendAudio = async (
    id: string,
    recordedBlob: Blob | null,
    stopRecording?: VoidFunction
  ) => {
    if (!recordedBlob) return;
    const audioFile = new File([recordedBlob], "voice-note.wav", {
      type: recordedBlob.type,
    });

    const payload = {
      file: audioFile,
      content_type: "audio",
      receiver_type: "group",
    };

    try {
      setReqLoading(true);
      const res = await SendGroupMessage(objectToFormData(payload), `${id}`);
      if (res) {
        setAudioUrl("");
        if (stopRecording) stopRecording(); // safe call
        setMessage("");
        window.dispatchEvent(new Event("refetch_team_message"));
        window.dispatchEvent(new Event("refetchTeamChat"));
      }
    } catch (err) {
      toast.error("Failed to send audio message");
    } finally {
      setReqLoading(false);
    }
  };

  return (
    <TeamChatContext.Provider
      value={{
        teamChatPageData,
        searchTerm,
        setSearchTerm,
        isSearch,
        setIsSearch,
        message,
        setMessage,
        reqLoading,
        audioUrl,
        setAudioUrl,
        filteredMemberList,
        groupedMessages,
        loading,
        silentLoading,
        error,
        isNetworkError,
        handleSendMsg,
        handleSendAudio,
        refetch,
      }}
    >
      {children}
    </TeamChatContext.Provider>
  );
};
