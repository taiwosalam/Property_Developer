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
  detailsStep: "detail" | "members";
  setDetailsStep: (step: "detail" | "members") => void;
  filterCounts: Record<string, number>;
  filterRole: string[];
  onFilterApply: (role: string | string[]) => void;
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
  const [detailsStep, setDetailsStep] = useState<"detail" | "members">(
    "detail"
  );
  const [filterRole, setFilterRole] = useState<string[]>([]);

  console.log("message", message);
  // Compute filter counts for each role
  const filterCounts = useMemo(() => {
    const counts: Record<string, number> = {
      Directors: 0,
      Staff: 0,
      "Account Officers": 0,
      Landlords: 0,
      Tenants: 0,
      All: 0,
    };
    if (teamChatPageData?.team) {
      teamChatPageData.team.forEach((member) => {
        const role = member.role;
        if (role === "Director" || role === "Directors") counts.Directors++;
        else if (role === "Staff") counts.Staff++;
        else if (role === "Account Officer" || role === "Account Officers")
          counts["Account Officers"]++;
        else if (role === "Landlord" || role === "Landlords")
          counts.Landlords++;
        else if (role === "Tenant" || role === "Tenants") counts.Tenants++;
        counts.All++;
      });
    }
    return counts;
  }, [teamChatPageData?.team]);

  // Role-based and search filtering
  const filteredMemberList = useMemo(() => {
    if (!teamChatPageData?.team || teamChatPageData.team.length === 0) {
      return [];
    }
    return teamChatPageData.team.filter((member) => {
      const matchesSearch = member.fullname
        .toLowerCase()
        .includes(searchTerm.toLowerCase().trim());
      const role = member.role?.toLowerCase();
      const selectedRoles = filterRole.map((r) => r.toLowerCase());
      const hasAll = selectedRoles.includes("all");
      const matchesRole =
        filterRole.length === 0 || hasAll || selectedRoles.includes(role);
      return matchesSearch && matchesRole;
    });
  }, [teamChatPageData?.team, searchTerm, filterRole]);

  // Handler for filter menu
  const onFilterApply = (role: string | string[]) => {
    if (Array.isArray(role)) setFilterRole(role);
    else setFilterRole([role]);
  };

  const {
    data: teamData,
    refetch,
    loading,
    silentLoading,
    error,
    isNetworkError,
  } = useFetch<TeamChatResponseData>("group-chats");

  console.log({ teamData });

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
        detailsStep,
        setDetailsStep,
        filterCounts,
        filterRole,
        onFilterApply,
      }}
    >
      {children}
    </TeamChatContext.Provider>
  );
};
