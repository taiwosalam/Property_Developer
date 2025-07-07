"use client";
import { removeGroupMember, team_chat_members_data } from "./data";
import { FilterIcons, SearchIcon, TrashIcon } from "@/public/icons/icons";
import { useEffect, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalTrigger,
  useModal,
} from "@/components/Modal/modal";
import { useTeamChatStore } from "@/store/teamChatStore";
import Image from "next/image";
import Avatar1 from "@/public/empty/avatar-1.svg";
import DeleteModal from "./DeleteModal";
import useFetch from "@/hooks/useFetch";
import { useParams } from "next/navigation";
import { TeamMessageCardSkeleton } from "@/components/Skeleton/member-card-skeleton";
import useRefetchOnEvent from "@/hooks/useRefetchOnEvent";
import { usePersonalInfoStore } from "@/store/personal-info-store";
import { useAuthStore } from "@/store/authStore";
import MemberComponent from "./Member";
import { GroupChatResponse, User } from "./types";
import { toast } from "sonner";
import { useTeamChat } from "@/contexts/teamChatContext";
import Picture from "@/components/Picture/picture";
import { empty } from "@/app/config";
// import TrashIcon from "@/public/icons/trash.svg";

interface AddMembersProps {
  groupId: number;
  group_members: {
    id: number;
    picture: string | null;
    fullname: string;
    role: string;
  }[];
}
const AddMembers = ({ group_members, groupId }: AddMembersProps) => {
  const { id } = useParams();
  const { setIsOpen } = useModal();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const { setDetailsStep } = useTeamChat();

  const filteredMembers = (group_members ?? []).filter((member) =>
    member.fullname.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const {
    isAddMember,
    openAddMember,
    closeAddMember,
    isDeleteMember,
    openDeleteMember,
    closeDeleteMember,
    setUserNameToDelete,
  } = useTeamChatStore();

  const addMember = () => {
    setIsOpen(false);
    openAddMember();
    console.log("isAddMember is", isAddMember);
  };

  const deleteMemberFromList = async (userId: number) => {
    if (!userId) return;
    try {
      const res = await removeGroupMember(groupId, userId);
      if (res) {
        toast.success("Deleted successful");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="transition-all duration-300 ease-in-out relative">
      <div className="sticky top-0 z-[2 bg-white dark:bg-darkText-primary p-4">
        <div className="searchWrapper flex items-center gap-1 border border-text-disabled rounded-md p-1 w-full">
          <SearchIcon size={20} />
          <input
            type="text"
            placeholder="Search members"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="text-sm w-full focus:outline-none dark:bg-darkText-primary"
          />
        </div>
        <div className="membersWrapper flex items-center justify-between mt-2">
          <p className="text-text-primary dark:text-white text-xs sm:text-sm font-medium">
            Members
          </p>
          <button
            type="button"
            className="text-brand-9 text-xs sm:text-sm font-medium"
            onClick={() => setDetailsStep("members")}
          >
            + Add New Member
          </button>
        </div>
      </div>
      {filteredMembers && filteredMembers.length > 0 ? (
        filteredMembers.map((item, index) => (
          <div
            key={index}
            className="userWrapper flex items-center gap-2 justify-between w-full mt-3 px-4"
          >
            <div className="flex items-center gap-2 w-3/4">
              <div className="imgWrapper h-10 w-10 relative overflow-hidden">
                <Picture
                  src={item?.picture || empty}
                  alt="profile"
                  size={40}
                  rounded
                />
              </div>
              <div className="flex flex-col">
                <p className="text-text-primary dark:text-white text-sm font-medium">
                  {item.fullname}
                </p>
                <p className="text-text-quaternary dark:text-text-disabled text-xs font-normal">
                  {item?.role}
                </p>
              </div>
            </div>
            <button
              type="button"
              className="w-1/4 flex justify-end"
              onClick={() => deleteMemberFromList(item?.id)}
              //onClick={() => openDeleteMember()}
            >
              <TrashIcon size={16} />
            </button>
          </div>
        ))
      ) : (
        <p>No member in this group yet</p>
      )}
    </div>
  );
};

export default AddMembers;
