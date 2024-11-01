"use client";

import { ChevronLeftIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTeamChatStore } from "@/store/teamChatStore";
import { ChevronLeft, SearchIcon } from "@/public/icons/icons";
import { team_chat_members_data } from "./data";
import FilterModal from "@/components/Management/Landlord/filters-modal";
import { Modal } from "@mui/material";
import FilterButton from "@/components/FilterButton/filter-button";
import Avatar1 from "@/public/empty/avatar-1.svg";
// Types

// Images
import CheckboxDefault from "@/public/icons/checkbox-default.svg";
import CheckboxChecked from "@/public/icons/checkbox-checked.svg";
import Image from "next/image";

const MemberComponent = ({
  title,
  group,
}: {
  title: string;
  group?: boolean;
}) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  let selectedCount: number = 0;
  const { closeAddMember } = useTeamChatStore();
  const [searchTerm, setSearchTerm] = useState<string>(""); // State for search input
  // Function to filter members based on search input
  const filteredMembers = team_chat_members_data.filter((member) =>
    member.fullname.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const [checkedStates, setCheckedStates] = useState<boolean[]>(
    Array(team_chat_members_data.length).fill(false)
  );
  const [selectedMembersState, setSelectedMembers] = useState<string[]>([]);

  // Handle the click event to toggle the checkbox state
  const handleCheckboxClick = (index: number) => {
    const newCheckedStates = [...checkedStates];
    newCheckedStates[index] = !newCheckedStates[index];

    const newSelectedMembers = team_chat_members_data
      .filter((_, idx) => newCheckedStates[idx])
      .map((member) => member.fullname);
    setCheckedStates(newCheckedStates);
    setSelectedMembers(newSelectedMembers);
  };

  // Calculate the number of selected checkboxes
  selectedCount = checkedStates.filter((checked) => checked).length;

  return (
    <>
      <div className="sticky top-0 z-[2] bg-white dark:bg-black mt-0 py-3 px-4">
        <button
          type="button"
          className="flex items-center gap-2"
          onClick={() => handleClose()}
        >
          <span>
            <ChevronLeftIcon size={30} />
          </span>
          <h2 className="text-text-primary text-lg font-medium">{title}</h2>
        </button>
        <div className="searchWrapper flex items-center justify-between mt-2 gap-1 border border-text-disabled rounded-md p-1 w-full h-[50px]">
          <div className="flex items-center gap-1">
            <SearchIcon size={25} />
            <input
              type="text"
              placeholder="Search Name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="text-sm w-full focus:outline-none"
            />
          </div>
          <div>
            <button type="button" onClick={handleOpen}>
              <FilterButton title="open" />
            </button>
            <Modal open={open} onClose={handleClose}>
              <FilterModal
                filterOptionsWithDropdown={[]}
                filterOptions={[]}
                onApply={() => {}}
                onStateSelect={() => {}}
                date
              />
            </Modal>
          </div>
        </div>
        {selectedCount > 0 && (
          <div className="flex items-center justify-between gap-2 mt-2">
            <button
              type="button"
              className="bg-text-disabled text-sm text-white w-1/2 py-2 rounded-md"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                if (group) {
                  handleOpen();
                } else {
                  handleClose();
                }
              }}
              type="button"
              className="bg-brand-9 text-sm text-white w-1/2 py-2 rounded-md"
            >
              {group ? "Next" : "Add"} {selectedCount}
            </button>
          </div>
        )}
      </div>
      <div className="flex flex-col w-full gap-2 px-4">
        {filteredMembers.map((item, index) => (
          <div key={index} className="flex gap-2">
            <div className="checkbox">
              <button
                className="flex items-center gap-2"
                onClick={() => handleCheckboxClick(index)}
                type="button"
              >
                <Image
                  src={checkedStates[index] ? CheckboxChecked : CheckboxDefault}
                  alt="checkbox"
                  width={24}
                  height={24}
                  className="w-6 h-6"
                />
              </button>
            </div>
            <div className="flex items-center gap-2">
              <Image
                src={Avatar1}
                alt="profile"
                width={40}
                height={40}
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
        ))}
      </div>
    </>
  );
};

export default MemberComponent;
