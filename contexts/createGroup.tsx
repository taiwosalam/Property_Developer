"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import useFetch from "@/hooks/useFetch";
import { IMemberList, transformTeamMemberData } from "@/app/(nav)/community/team-chat/team.data";
import { TeamChatUsersResponse } from "@/app/(nav)/community/team-chat/types";
import { addUserToGroup, createNewTeamChat } from "@/app/(nav)/community/team-chat/data";

interface CreateGroupContextType {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedMembers: number[];
  setSelectedMembers: (members: number[]) => void;
  teamMembers: IMemberList | null;
  loading: boolean;
  uploadedImage: string | null;
  setUploadedImage: (image: string | null) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  isCreating: boolean;
  setIsCreating: (isCreating: boolean) => void;
  groupId: string | undefined;
  handleCheckboxClick: (memberId: number) => void;
  handleImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmitCreateGroup: (formData: FormData) => Promise<void>;
  handleAddMembersToGroup: (groupId: string) => Promise<void>;
  resetForm: () => void;
}

const CreateGroupContext = createContext<CreateGroupContextType | undefined>(
  undefined
);

export const useCreateGroup = () => {
  const context = useContext(CreateGroupContext);
  if (!context) {
    throw new Error("useCreateGroup must be used within CreateGroupProvider");
  }
  return context;
};

export const CreateGroupProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const params = useParams();
  const groupId = params?.id as string | undefined;
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<number[]>([]);
  const [teamMembers, setTeamMembers] = useState<IMemberList | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const { data: teamMemberData, loading } =
    useFetch<TeamChatUsersResponse>("/company/users");

  useEffect(() => {
    if (teamMemberData) {
      const transformTeam = transformTeamMemberData(teamMemberData);
      setTeamMembers(transformTeam);
    }
  }, [teamMemberData]);

  const handleCheckboxClick = (memberId: number) => {
    setSelectedMembers((prev) =>
      prev.includes(memberId)
        ? prev.filter((id) => id !== memberId)
        : [...prev, memberId]
    );
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitCreateGroup = async (formData: FormData) => {
    if (selectedMembers.length === 0) {
      toast.error("Please select at least one member");
      return;
    }
    setIsCreating(true);
    selectedMembers.forEach((userId) =>
      formData.append("user_ids[]", userId.toString())
    );
    formData.append("is_private", "1");
    try {
      const groupResponse = await createNewTeamChat(formData);
      if (groupResponse) {
        window.dispatchEvent(new Event("refetchTeamChat"));
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create group"
      );
    } finally {
      setIsCreating(false);
    }
  };

  const handleAddMembersToGroup = async (groupId: string) => {
    if (groupId && selectedMembers.length > 0) {
      const userFormData = new FormData();
      selectedMembers.forEach((userId) =>
        userFormData.append("user_ids[]", userId.toString())
      );
      try {
        const res = await addUserToGroup(groupId, userFormData);
        if (res) {
          window.dispatchEvent(new Event("refetch_team_chat"));
        }
      } catch (err) {
        toast.error("Failed to add members");
      }
    }
  };

  const resetForm = () => {
    setSelectedMembers([]);
    setSearchTerm("");
    setUploadedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const contextValue: CreateGroupContextType = {
    searchTerm,
    setSearchTerm,
    selectedMembers,
    setSelectedMembers,
    teamMembers,
    loading,
    uploadedImage,
    setUploadedImage,
    fileInputRef,
    isCreating,
    setIsCreating,
    groupId,
    handleCheckboxClick,
    handleImageUpload,
    handleSubmitCreateGroup,
    handleAddMembersToGroup,
    resetForm,
  };

  return (
    <CreateGroupContext.Provider value={contextValue}>
      {children}
    </CreateGroupContext.Provider>
  );
};
