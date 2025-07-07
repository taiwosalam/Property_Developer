"use client";

import React, { useState } from "react";
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
import { useModal } from "@/components/Modal/modal";
import MessagesFilterMenu from "@/components/Message/messages-filter-menu";
import Input from "@/components/Form/Input/input";
import FilterButton from "@/components/FilterButton/filter-button";
import FixedFooter from "@/components/FixedFooter/fixed-footer";

interface SelectMembersStepProps {
  onClose: () => void;
  onNext: () => void;
  create?: boolean;
}

const SelectMembersStep: React.FC<SelectMembersStepProps> = ({
  onClose,
  onNext,
  create,
}) => {
  const {
    searchTerm,
    setSearchTerm,
    selectedMembers,
    filteredMembers,
    loading,
    groupId,
    handleCheckboxClick,
    resetForm,
    handleAddMembersToGroup,
    filterCounts,
    filterRole,
    onFilterApply,
  } = useCreateGroup();
  const { setIsOpen } = useModal();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleNext = async () => {
    if (selectedMembers.length === 0) {
      return; // Validation handled in handleSubmitCreateGroup
    }
    await onNext();
    // setIsOpen(false);
  };

  return (
    <div className="relative">
      <div className="sticky top-0 z-[2] bg-white dark:bg-darkText-primary pt-3">
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
                {
                  label: "Directors",
                  value: filterCounts["Directors"] || 0,
                },
                { label: "Staff", value: filterCounts["Staff"] || 0 },
                {
                  label: "Account Officers",
                  value: filterCounts["Account Officers"] || 0,
                },
                { label: "Landlords", value: filterCounts["Landlords"] || 0 },
                { label: "Tenants", value: filterCounts["Tenants"] || 0 },
                { label: "All", value: filterCounts["All"] || 0 },
              ]}
            />
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2 w-full">
        {loading ? (
          <TeamChatMemberSkeleton count={10} />
        ) : filteredMembers.length > 0 ? (
          filteredMembers.map((member) => (
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
      {selectedMembers.length > 0 && (
        <div className="sticky bottom-0 left-0 right-0 border-t border-text-disabled bg-white dark:bg-darkText-primary h-[35px]">
          <div className="flex items-center justify-between gap-2 mt-2">
            {/* <Button
              type="button"
              variant="border"
              size="sm_medium"
              className="px-8 py-2 w-full"
              onClick={resetForm}
            >
              Cancel
            </Button> */}
            <Button
              type="button"
              size="sm_medium"
              className="px-8 py-2 w-full"
              onClick={
                create
                  ? handleNext
                  : () => handleAddMembersToGroup(groupId || "")
              }
            >
              {create ? "Next" : `Add ${selectedMembers.length}`}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SelectMembersStep;
