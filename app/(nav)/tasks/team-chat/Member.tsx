"use client";

import { ChevronLeftIcon } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useTeamChatStore } from "@/store/teamChatStore";
import { ChevronLeft, PlusIcon, SearchIcon } from "@/public/icons/icons";
import { team_chat_members_data } from "./data";
import FilterModal from "./FilterModal";
import FilterButton from "@/components/FilterButton/filter-button";
import Avatar1 from "@/public/empty/avatar-1.svg";
// Types
// MODAL IMPORTS
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
// Images
import CheckboxDefault from "@/public/icons/checkbox-default.svg";
import CheckboxChecked from "@/public/icons/checkbox-checked.svg";
import Image from "next/image";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
};

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
    console.log("close modal");
  };

  let selectedCount: number = 0;
  const { closeAddMember } = useTeamChatStore();
  const [isGroupDesc, setIsGroupDesc] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>(""); // State for search input
  // Function to filter members based on search input
  const filteredMembers = team_chat_members_data.filter((member) =>
    member.fullname.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const [checkedStates, setCheckedStates] = useState<boolean[]>(
    Array(team_chat_members_data.length).fill(false)
  );
  const [selectedMembersState, setSelectedMembers] = useState<string[]>([]);

  const [uploadedImage, setUploadedImage] = useState<string | null>(null); // State for uploaded image
  const fileInputRef = useRef<HTMLInputElement | null>(null); // Create a ref for the file input

  // Function to handle image upload
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

  const openGroupDesc = () => {
    setIsGroupDesc(true);
  };

  const handleBackNavigation = () => {
    if (isGroupDesc) {
      setIsGroupDesc(false);
    } else if (open) {
      handleClose();
    } else {
      closeAddMember();
    }
  };

  const cancel = () => {
    selectedCount = 0;
    setCheckedStates(Array(team_chat_members_data.length).fill(false));
    setSelectedMembers([]);
  };
  return (
    <>
      <div className="sticky top-0 z-[2] bg-white dark:bg-black mt-0 py-3 px-4">
        <button
          type="button"
          className="flex items-center gap-2"
          onClick={handleBackNavigation}
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
            <div onClick={handleOpen}>
              <FilterButton noTitle />
            </div>
            <Modal
              open={open}
              onClose={handleClose}
              closeAfterTransition
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={style}>
                <div className="w-full h-full flex items-center justify-center">
                  <FilterModal
                    filterOptionsWithDropdown={[]}
                    filterOptions={[]}
                    onApply={() => {}}
                    onStateSelect={() => {}}
                    date
                    closeModal={handleClose}
                  />
                </div>
              </Box>
            </Modal>
          </div>
        </div>
        {selectedCount > 0 && !isGroupDesc && (
          <div className="flex items-center justify-between gap-2 mt-2">
            <button
              onClick={cancel}
              type="button"
              className="bg-text-disabled text-sm text-white w-1/2 py-2 rounded-md"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                if (group) {
                  openGroupDesc();
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
      {!isGroupDesc && (
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
                    src={
                      checkedStates[index] ? CheckboxChecked : CheckboxDefault
                    }
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
      )}
      {isGroupDesc && (
        <div className="text-text-primary text-sm font-medium px-4 pb-4">
          <div className="flex flex-col gap-1">
            <p>Group Name</p>
            <input
              type="text"
              placeholder="Group Name"
              className="border border-text-disabled rounded-md px-2 py-3 w-full"
            />
          </div>
          <div className="flex flex-col mt-4 gap-1">
            <p>Group Description</p>
            <input
              type="text"
              placeholder="Group Description"
              className="border border-text-disabled rounded-md px-2 py-3 w-full"
            />
          </div>
          <div className="flex flex-col items-start gap-2 mt-2">
            <p className="text-text-disabled">
              Formats are .jpg, .gif and .png only 5MB max
            </p>
            {uploadedImage ? (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  type="file"
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
                className="bg-[#F4F4F9] border border-dashed border-text-label text-sm text-text-label w-2/4 h-[85px] rounded-md flex flex-col items-center justify-center gap-2"
                onClick={() => fileInputRef.current?.click()} // Trigger file input click
              >
                <input
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
          <div className="btns flex items-center justify-between gap-2 mt-2">
            <button
              type="button"
              className="text-sm text-white bg-text-disabled w-1/2 py-2 rounded-md"
            >
              Cancel
            </button>
            <button
              type="button"
              className="bg-brand-9 text-sm text-white w-1/2 py-2 rounded-md"
            >
              Create
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default MemberComponent;
