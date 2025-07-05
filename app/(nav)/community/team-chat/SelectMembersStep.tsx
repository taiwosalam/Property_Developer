"use client";

import React from "react";
import { SearchIcon } from "@/public/icons/icons";
import Image from "next/image";
import CheckboxDefault from "@/public/icons/checkbox-default.svg";
import CheckboxChecked from "@/public/icons/checkbox-checked.svg";
import avatarIcon from "@/public/empty/avatar-2.svg";
import Button from "@/components/Form/Button/button";
import { TeamChatMemberSkeleton } from "@/components/Skeleton/member-card-skeleton";
import { useCreateGroup } from "@/contexts/createGroup";
import { ChevronLeftIcon } from "lucide-react";
import Picture from "@/components/Picture/picture";
import { empty } from "@/app/config";

interface SelectMembersStepProps {
  onClose: () => void;
  onNext: () => void;
}

const SelectMembersStep: React.FC<SelectMembersStepProps> = ({
  onClose,
  onNext,
}) => {
  const {
    searchTerm,
    setSearchTerm,
    selectedMembers,
    teamMembers,
    loading,
    groupId,
    handleCheckboxClick,
    resetForm,
    handleAddMembersToGroup,
  } = useCreateGroup();

  const searchMembers =
    teamMembers?.members?.filter((member) =>
      member.username.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  const handleNext = () => {
    if (selectedMembers.length === 0) {
      return; // Validation handled in handleSubmitCreateGroup
    }
    onNext();
  };

  return (
    <>
      <div className="sticky top-0 z-[2] bg-white dark:bg-darkText-primary py-3">
        <div className="flex items-center gap-2">
          <button type="button" onClick={onClose}>
            <ChevronLeftIcon size={30} />
          </button>
          <h2 className="text-text-primary dark:text-white text-lg font-medium">
            New Group
          </h2>
        </div>
        <div className="flex items-center gap-1 border border-text-disabled rounded-md p-1 mt-2">
          <SearchIcon size={25} />
          <input
            type="text"
            placeholder="Search Name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="text-sm w-full dark:text-white dark:bg-darkText-primary focus:outline-none"
          />
        </div>
        {selectedMembers.length > 0 && (
          <div className="flex items-center justify-between gap-2 mt-2">
            <Button
              type="button"
              size="sm_medium"
              className="px-8 py-2 w-full"
              onClick={resetForm}
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm_medium"
              className="px-8 py-2 w-full"
              onClick={
                groupId ? () => handleAddMembersToGroup(groupId) : handleNext
              }
            >
              {groupId ? `Add ${selectedMembers.length}` : "Next"}
            </Button>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-2 w-full">
        {loading ? (
          <TeamChatMemberSkeleton count={10} />
        ) : searchMembers.length > 0 ? (
          searchMembers.map((member) => (
            <div key={member.id} className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleCheckboxClick(member.id)}
                className="flex items-center gap-2"
              >
                <Picture
                  src={
                    selectedMembers.includes(member.id)
                      ? CheckboxChecked
                      : CheckboxDefault
                  }
                  alt="checkbox"
                  size={24}
                />
              </button>
              <Picture
                src={member.profile_picture || empty}
                alt="profile"
                size={40}
                rounded
              />
              <div className="flex flex-col">
                <p className="text-text-primary dark:text-white text-sm font-medium capitalize">
                  {member.username}
                </p>
                <p className="text-text-quaternary dark:text-text-disabled text-xs font-normal capitalize">
                  {member.role}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-400">No users found</p>
        )}
      </div>
    </>
  );
};

export default SelectMembersStep;
