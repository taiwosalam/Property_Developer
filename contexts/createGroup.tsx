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
import {
  IMemberList,
  transformTeamMemberData,
} from "@/app/(nav)/community/team-chat/team.data";
import { TeamChatUsersResponse } from "@/app/(nav)/community/team-chat/types";
import {
  addUserToGroup,
  createNewTeamChat,
} from "@/app/(nav)/community/team-chat/data";
import { handleAxiosError } from "@/services/api";
import { useModal } from "@/components/Modal/modal";

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
  filteredMembers: Array<any>;
  filterRole: string[];
  setFilterRole: (role: string[]) => void;
  onFilterApply: (role: string | string[]) => void;
  filterCounts: Record<string, number>;
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
  const [filterRole, setFilterRole] = useState<string[]>([]);
  const { setIsOpen } = useModal();
  const { data: teamMemberData, loading } =
    useFetch<TeamChatUsersResponse>("/company/users");

  useEffect(() => {
    if (teamMemberData) {
      const transformTeam = transformTeamMemberData(teamMemberData);
      setTeamMembers(transformTeam);
    }
  }, [teamMemberData]);

  // Compute filtered members based on searchTerm and filterRole
  const filteredMembers = React.useMemo(() => {
    if (!teamMembers?.members) return [];
    return teamMembers.members.filter((member) => {
      const matchesSearch = member.username
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const role = member.role?.toLowerCase();
      const selectedRoles = filterRole.map((r) => r.toLowerCase());
      const hasAll = selectedRoles.includes("all");
      const matchesRole =
        filterRole.length === 0 || hasAll || selectedRoles.includes(role);
      return matchesSearch && matchesRole;
    });
  }, [teamMembers, searchTerm, filterRole]);

  console.log("teamMembers", teamMembers);
  // Compute counts for each role
  const filterCounts = React.useMemo(() => {
    const counts: Record<string, number> = {
      All: 0,
      Director: 0,
      Staff: 0,
      "Account Manager": 0,
      "Account Officers": 0,
      // Add more roles as needed
    };
    if (!teamMembers?.members) return counts;
    counts["All"] = teamMembers.members.length;
    teamMembers.members.forEach((member) => {
      const role = member.role?.toLowerCase();
      if (role === "director") counts["Director"]++;
      if (role === "staff") counts["Staff"]++;
      if (role === "manager") counts["Account Manager"]++;
      if (role === "account officers") counts["Account Officers"]++;
      // Add more roles as needed
    });
    return counts;
  }, [teamMembers]);

  // Filter apply handler
  const onFilterApply = (role: string | string[]) => {
    setFilterRole(Array.isArray(role) ? role : [role]);
  };

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
        setIsOpen(false);
      }
    } catch (error) {
      handleAxiosError(error);
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
        handleAxiosError(err);
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
    filteredMembers,
    filterRole,
    setFilterRole,
    onFilterApply,
    filterCounts,
  };

  return (
    <CreateGroupContext.Provider value={contextValue}>
      {children}
    </CreateGroupContext.Provider>
  );
};
