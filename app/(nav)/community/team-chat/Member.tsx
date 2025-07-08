"use client";

import { ChevronLeftIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTeamChatStore } from "@/store/teamChatStore";
import { PlusIcon, SearchIcon } from "@/public/icons/icons";
import {
  addUserToGroup,
  createNewTeamChat,
  team_chat_members_data,
} from "./data";
import FilterModal from "@/components/Management/Landlord/filters-modal";
import FilterButton from "@/components/FilterButton/filter-button";
import Avatar1 from "@/public/empty/avatar-1.svg";
//import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import CheckboxDefault from "@/public/icons/checkbox-default.svg";
import CheckboxChecked from "@/public/icons/checkbox-checked.svg";
import Image from "next/image";
import useFetch from "@/hooks/useFetch";
import {
  Group,
  GroupChat,
  GroupChatResponse,
  GroupsResponse,
  TeamChatUsersResponse,
  UsersResponse,
} from "./types";
import { Modal, ModalContent, useModal } from "@/components/Modal/modal";
import SelectChatUsersModal from "@/components/Message/user-modal";
import { AuthForm } from "@/components/Auth/auth-components";
import { boolean } from "zod";
import Input from "@/components/Form/Input/input";
import Button from "@/components/Form/Button/button";
import { AxiosResponse } from "axios";
import ChildModal from "./child-modal";
import MessageCardSkeleton from "@/components/Skeleton/message-card-skeleton";
import { TeamChatMemberSkeleton } from "@/components/Skeleton/member-card-skeleton";
import { toast } from "sonner";
import { useParams } from "next/navigation";
import { IMemberList, transformTeamMemberData } from "./team.data";
import { empty } from "@/app/config";
import TextArea from "@/components/Form/TextArea/textarea";
import Picture from "@/components/Picture/picture";
import { useTeamChat } from "@/contexts/teamChatContext";
import MessagesFilterMenu from "@/components/Message/messages-filter-menu";
import { create } from "domain";

interface MemberComponentProps {
  title?: string;
  group?: boolean;
  handleClose?: () => void;
  nextStep?: () => void;
  setStep?: (value: number) => void;
  step?: number;
}
const MemberComponent = ({
  title,
  group,
  nextStep,
  handleClose,
  step,
  setStep,
}: MemberComponentProps) => {
  const { setIsOpen } = useModal();
  const { setDetailsStep } = useTeamChat();
  const [isGroupDesc, setIsGroupDesc] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState<string[]>(["All"]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedMembers, setSelectedMembers] = useState<number[]>([]);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [reqLoading, setReqLoading] = useState(false);

  // Fetch team members
  const [teamMembers, setTeamMembers] = useState<IMemberList | null>(null);
  const { data: teamMemberData, loading } =
    useFetch<TeamChatUsersResponse>("/company/users");
  useEffect(() => {
    if (teamMemberData) {
      const transformTeam = transformTeamMemberData(teamMemberData);
      setTeamMembers(transformTeam);
    }
  }, [teamMemberData]);

  // Filtering logic
  const filterCounts = (() => {
    const counts: Record<string, number> = {
      All: 0,
      Director: 0,
      Staff: 0,
      Manager: 0,
    };
    if (!teamMembers?.members) return counts;
    counts.All = teamMembers.members.length;
    teamMembers.members.forEach((member) => {
      const role = member.role?.toLowerCase();
      if (role === "director") counts.Director++;
      if (role === "staff") counts.Staff++;
      if (role === "manager") counts.Manager++;
    });
    return counts;
  })();

  const onFilterApply = (role: string | string[]) => {
    setFilterRole(Array.isArray(role) ? role : [role]);
  };

  const filteredMembers = (() => {
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
  })();

  // Selection logic
  const handleCheckboxClick = (memberId: number) => {
    setSelectedMembers((prev) =>
      prev.includes(memberId)
        ? prev.filter((id) => id !== memberId)
        : [...prev, memberId]
    );
  };

  // Image upload
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

  // Group creation logic
  const params = useParams();
  const paramId = params?.id;
  const [groupId, setGroupId] = useState(paramId ?? "");

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
        handleClose?.();
        window.dispatchEvent(new Event("refetchTeamChat"));
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    } finally {
      setIsCreating(false);
    }
  };

  const addNewUserToGroup = async () => {
    if (groupId && selectedMembers.length > 0) {
      const userFormData = new FormData();
      selectedMembers.forEach((userId) =>
        userFormData.append("user_ids[]", String(userId))
      );
      try {
        setReqLoading(true);
        const response = await addUserToGroup(groupId as string, userFormData);
        if (response) {
          window.dispatchEvent(new Event("refetch_team_chat"));
          setDetailsStep("detail");
          // setIsOpen(false);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setReqLoading(false);
      }
    }
  };

  // Reset
  const cancel = () => {
    setSelectedMembers([]);
    setSearchTerm("");
    setUploadedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const selectedCount = selectedMembers.length;

  return (
    <div className="relative">
      <div className="w-full rounded-md bg-white overflow-y-auto custom-round-scrollbar">
        <div className="sticky top-0 z-[2] bg-white dark:bg-black mt-0 py-3 pb-2">
          {!isGroupDesc && (
            <div className="flex-1 relative">
              <Input
                id="search"
                className="w-full"
                placeholder="Search for messages"
                leftIcon={"/icons/search-icon.svg"}
                inputClassName="pr-[52px] border-transparent"
                value={searchTerm}
                onChange={setSearchTerm}
              />
              <div className="absolute top-1/2 right-0 -translate-y-1/2">
                <FilterButton
                  noTitle
                  className="bg-transparent py-[10px] px-4"
                  onClick={(e) => setAnchorEl(e.currentTarget)}
                />
                <MessagesFilterMenu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={() => setAnchorEl(null)}
                  onFilterApply={onFilterApply}
                  filterOptions={[
                    {
                      label: "Director",
                      value: filterCounts["Director"] || 0,
                    },
                    { label: "Staff", value: filterCounts["Staff"] || 0 },
                    { label: "Manager", value: filterCounts["Manager"] || 0 },
                    { label: "All", value: filterCounts["All"] || 0 },
                  ]}
                />
              </div>
            </div>
          )}
        </div>

        {!isGroupDesc && (
          <div className="flex flex-col w-full gap-2 px-4">
            {loading ? (
              <TeamChatMemberSkeleton count={4} />
            ) : filteredMembers && filteredMembers.length > 0 ? (
              filteredMembers.map((item) => (
                <div key={item.id} className="flex items-center gap-2">
                  <div className="checkbox">
                    <button
                      className="flex items-center gap-2"
                      onClick={() => handleCheckboxClick(item.id)}
                      type="button"
                    >
                      <Image
                        src={
                          selectedMembers.includes(item.id)
                            ? CheckboxChecked
                            : CheckboxDefault
                        }
                        alt="checkbox"
                        width={24}
                        height={24}
                        className="w-6 h-6"
                      />
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <Picture
                      src={item?.profile_picture || empty}
                      alt="profile"
                      size={24}
                      rounded
                    />
                  </div>
                  <div className="flex flex-col">
                    <p className="text-text-primary dark:text-white text-sm font-medium capitalize">
                      {item.username}
                    </p>
                    <p className="text-text-quaternary dark:text-text-disabled text-xs font-normal capitalize">
                      {item.role}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p>No user found</p>
            )}
          </div>
        )}
        {isGroupDesc && (
          <div className="text-text-primary text-sm font-medium px-4 pb-4 relative">
            <AuthForm
              returnType="form-data"
              onFormSubmit={handleSubmitCreateGroup}
            >
              <div className="flex flex-col gap-1">
                <p className="dark:text-white">Group Name</p>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Group Name"
                  className="border border-text-disabled dark:bg-darkText-primary rounded-md px-2 py-3 w-full"
                />
              </div>
              <div className="flex flex-col mt-4 gap-1">
                <p className="dark:text-white">Group Description</p>
                <div className="w-full">
                  <TextArea id="description" placeholder="Group Description" />
                </div>
              </div>
              <div className="flex flex-col items-start gap-2 mt-2">
                <p className="text-text-disabled">
                  Formats are .jpg, .gif and .png only 5MB max
                </p>
                {uploadedImage ? (
                  <button
                    type="button"
                    onClick={() => fileInputRef?.current?.click()}
                  >
                    <input
                      type="file"
                      id="picture"
                      name="picture"
                      className="hidden"
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                    />
                    <Image
                      src={uploadedImage}
                      alt="Uploaded Group"
                      width={85}
                      height={85}
                      className="rounded-md object-cover"
                    />
                  </button>
                ) : (
                  <button
                    type="button"
                    className="bg-[#F4F4F9] dark:bg-darkText-primary border border-dashed border-text-label text-sm text-text-label w-2/4 h-[85px] rounded-md flex flex-col items-center justify-center gap-2"
                    onClick={() => fileInputRef?.current?.click()} // Trigger file input click
                  >
                    <input
                      id="picture"
                      name="picture"
                      type="file"
                      className="hidden"
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                    />
                    <PlusIcon />
                    Add Image
                  </button>
                )}
              </div>
              <div className="btns flex items-center justify-between gap-2 mt-6">
                <button
                  onClick={handleClose}
                  type="button"
                  className="text-sm text-white bg-text-disabled w-1/2 py-2 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="bg-brand-9 text-sm text-white w-1/2 py-2 rounded-md"
                >
                  {isCreating ? "Creating..." : "Create"}
                </button>
              </div>
            </AuthForm>
          </div>
        )}
      </div>
      {/* STICKY BUTTON */}
      {selectedCount > 0 && !isGroupDesc && (
        <div className="sticky bottom-4 left-0 right-0 h-[35px]">
          <div className="flex items-center justify-between gap-2 mt-2">
            <Button
              onClick={() => {
                if (group) {
                  setIsGroupDesc(true);
                } else {
                  addNewUserToGroup();
                }
              }}
              type="button"
              variant="default"
              size="base_medium"
              disabled={reqLoading}
              className="px-8 py-1 ml-auto"
            >
              {reqLoading ? "Adding..." : group ? "Next" : "Add"}{" "}
              {selectedCount}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberComponent;
