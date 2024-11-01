"use client";
import { team_chat_members_data } from "./data";
import { FilterIcons, SearchIcon } from "@/public/icons/icons";
import { useState } from "react";
import { Modal, ModalContent, useModal } from "@/components/Modal/modal";
import { useTeamChatStore } from "@/store/teamChatStore";
import Image from "next/image";
import Avatar1 from "@/public/empty/avatar-1.svg";
import TrashIcon from "@/public/icons/trash.svg";

const AddMembers = () => {
  const { setIsOpen } = useModal();
  const [searchTerm, setSearchTerm] = useState<string>(""); // State for search input

  // Function to filter members based on search input
  const filteredMembers = team_chat_members_data.filter((member) =>
    member.fullname.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const { isAddMember, openAddMember, closeAddMember } = useTeamChatStore();

  const addMember = () => {
    setIsOpen(false);
    openAddMember();
    console.log("isAddMember is", isAddMember);
  };

  return (
    <div className="transition-all duration-300 ease-in-out">
      <div className="sticky top-0 z-[2] bg-white dark:bg-black p-4">
        <div className="searchWrapper flex items-center gap-1 border border-text-disabled rounded-md p-1 w-full">
          <SearchIcon size={20} />
          <input
            type="text"
            placeholder="Search members"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="text-sm w-full focus:outline-none"
          />
        </div>
        <div className="membersWrapper flex items-center justify-between mt-2">
          <p className="text-text-primary text-xs sm:text-sm font-medium">
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
      {filteredMembers.map((item, index) => (
        <div
          key={index}
          className="userWrapper flex items-center gap-2 justify-between w-full mt-3 px-4"
        >
          <div className="flex items-center gap-2 w-3/4">
            <div className="imgWrapper h-10 w-10 relative overflow-hidden">
              <Image
                src={Avatar1}
                alt="profile"
                width={100}
                height={100}
                className="rounded-full w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col">
              <p className="text-text-primary text-sm font-medium">
                {item.fullname}
              </p>
              <p className="text-text-quaternary text-xs font-normal">
                {item.position}
              </p>
            </div>
          </div>
          <button type="button" className="w-1/4 flex justify-end">
            <Image src={TrashIcon} alt="delete" width={16} height={16} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default AddMembers;
