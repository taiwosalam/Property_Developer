"use client";
import { removeGroupMember } from "./data";
import { FilterIcons, PlusIcon, SearchIcon, TrashIcon } from "@/public/icons/icons";
import { useState } from "react";
import { Modal, ModalContent, ModalTrigger, useModal } from "@/components/Modal/modal";
import { useTeamChat } from "@/contexts/teamChatContext";
import Picture from "@/components/Picture/picture";
import { empty } from "@/app/config";
import FilterButton from "@/components/FilterButton/filter-button";
import MessagesFilterMenu from "@/components/Message/messages-filter-menu";
import Input from "@/components/Form/Input/input";
import { capitalizeWords } from "@/hooks/capitalize-words";
import { toast } from "sonner";
import { useParams } from "next/navigation";

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
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { setIsOpen } = useModal();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const { setDetailsStep, onFilterApply, filterRole } = useTeamChat();

  // Compute filterCounts based on group_members
  const filterCounts = group_members.reduce(
    (counts, member) => {
      const role = member.role?.toLowerCase();
      if (role === "director") counts.director++;
      else if (role === "staff") counts.staff++;
      else if (role === "manager") counts.manager++;
      counts.all++;
      return counts;
    },
    { director: 0, staff: 0, manager: 0, all: 0 }
  );

  // Label to role mapping
  const labelToRoleMap: Record<string, string> = {
    Director: "director",
    "Other Staff": "staff", // Fixed to match filterOptions label
    "Account Manager": "manager",
    All: "all",
  };

  // Filtering logic
  const filteredMembers = (group_members ?? []).filter((member) => {
    const matchesSearch = member.fullname
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const role = member.role?.toLowerCase();
    const selectedRoles = filterRole.map((label) => labelToRoleMap[label]?.toLowerCase() || "");
    const hasAll = selectedRoles.includes("all");
    const matchesRole = filterRole.length === 0 || hasAll || selectedRoles.includes(role);
    return matchesSearch && matchesRole;
  });

  const deleteMemberFromList = async (userId: number) => {
    if (!userId) return;
    try {
      const res = await removeGroupMember(groupId, userId);
      if (res) {
        toast.success("Deleted successful");
        window.dispatchEvent(new Event("refetch_team_message")); // Trigger refetch to update group_members
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete member");
    }
  };

  return (
    <div className="transition-all duration-300 ease-in-out relative">
      {/* Sticky search and filter */}
      <div className="flex gap-4 sticky top-0 z-[2] bg-white dark:bg-black pb-2">
        <div className="flex-1 relative">
          <Input
            id="search"
            className="w-full"
            placeholder="Search for messages"
            leftIcon={"/icons/search-icon.svg"}
            inputClassName="pr-[52px] border-transparent"
            value={searchTerm}
            onChange={(val) => setSearchTerm(val)}
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
                { label: "Director", value: filterCounts.director },
                { label: "Other Staff", value: filterCounts.staff },
                { label: "Account Manager", value: filterCounts.manager },
                { label: "All", value: filterCounts.all },
              ]}
            />
          </div>
        </div>
      </div>

      {/* Members list */}
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
                  {capitalizeWords(item.fullname || "")}
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
            >
              <TrashIcon size={16} />
            </button>
          </div>
        ))
      ) : (
        <p>No Member in this group yet</p>
      )}
    </div>
  );
};

export default AddMembers;