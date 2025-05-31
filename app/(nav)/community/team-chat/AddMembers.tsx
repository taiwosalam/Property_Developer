"use client";
import { deleteGroupMember, team_chat_members_data } from "./data";
import { FilterIcons, SearchIcon, TrashIcon } from "@/public/icons/icons";
import { useEffect, useState } from "react";
import { Modal, ModalContent, useModal } from "@/components/Modal/modal";
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
// import TrashIcon from "@/public/icons/trash.svg";

const AddMembers = () => {
  const { id } = useParams();
  const { setIsOpen } = useModal();
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Function to filter members based on search input

  const {
    data: apiData,
    loading,
    silentLoading,
    refetch,
  } = useFetch<GroupChatResponse>(`group-chat/${id}`);

  useRefetchOnEvent("refetch_team_chat", () => refetch({ silent: true }));

  const groupMembers = apiData?.group_chat?.users;

  const [members, setMembers] = useState<User[] | undefined>(
    groupMembers ?? undefined
  );
  const [groupId, setGroupId] = useState("");

  useEffect(() => {
    if (apiData) {
      setMembers(apiData?.group_chat?.users);
      setGroupId(apiData?.group_chat?.id.toString());
    }
  }, [apiData]);

  const filteredMembers = (members ?? []).filter((member) =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  console.log(groupMembers);

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

  const deleteMemberFromList = async (userId: string) => {
    const formData = new FormData();
    formData.append("user_ids[]", userId);

    await deleteGroupMember(groupId, formData);
  };

  return (
    <div className="transition-all duration-300 ease-in-out">
      <div className="sticky top-0 z-[2] bg-white dark:bg-darkText-primary p-4">
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
            onClick={addMember}
          >
            + Add New Member
          </button>
        </div>
      </div>
      {loading ? (
        <div>
          <TeamMessageCardSkeleton count={2} />
        </div>
      ) : filteredMembers && filteredMembers.length > 0 ? (
        filteredMembers.map((item, index) => (
          <div
            key={index}
            className="userWrapper flex items-center gap-2 justify-between w-full mt-3 px-4"
          >
            <div className="flex items-center gap-2 w-3/4">
              <div className="imgWrapper h-10 w-10 relative overflow-hidden">
                <Image
                  src={item?.profile?.picture || Avatar1}
                  alt="profile"
                  width={100}
                  height={100}
                  className="rounded-full w-full h-full object-contain"
                />
              </div>
              <div className="flex flex-col">
                <p className="text-text-primary dark:text-white text-sm font-medium">
                  {item.name}
                </p>
                <p className="text-text-quaternary dark:text-text-disabled text-xs font-normal">
                  {item?.email}
                </p>
              </div>
            </div>
            <button
              type="button"
              className="w-1/4 flex justify-end"
              onClick={() => deleteMemberFromList(item?.id.toString())}
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
