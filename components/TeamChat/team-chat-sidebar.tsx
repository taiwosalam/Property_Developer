"use client";

import { useParams } from "next/navigation";
import { PlusIcon, SearchIcon } from "@/public/icons/icons";
import Input from "@/components/Form/Input/input";
import { TeamMessageCardSkeleton } from "@/components/Skeleton/member-card-skeleton";
import { useTeamChat } from "@/contexts/teamChatContext";
import TeamChatCard from "@/app/(nav)/community/team-chat/TeamChartCard";
import CreateGroupModal from "@/app/(nav)/community/team-chat/create-group-modal";
import { Modal, ModalContent, ModalTrigger } from "../Modal/modal";
import { UserPlusIcon } from "lucide-react";
import FilterButton from "../FilterButton/filter-button";
import MessagesFilterMenu from "../Message/messages-filter-menu";
import { useState } from "react";

const TeamChatSidebar = () => {
  const {
    teamChatPageData,
    isSearch,
    setIsSearch,
    searchTerm,
    setSearchTerm,
    filteredMemberList,
    silentLoading,
    filterCounts,
    filterRole,
    onFilterApply,
  } = useTeamChat();
  const params = useParams();
  const paramId = params.id;

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  return (
    <div className="custom-flex-col pr-2 w-full overflow-y-auto custom-round-scrollbar relative">

      {/* sticky search and filter */}
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
                  { label: "Unread", value: filterCounts["Unread"] || 0 },
                { label: "All", value: filterCounts["All"] || 0 },
              ]}
            />
          </div>
        </div>
      </div>

      {/* Team Chat List */}
      <div className="custom-flex-col overflow-x-hidden relative pb-4">
        {silentLoading ? (
          <TeamMessageCardSkeleton count={10} />
        ) : (
          filteredMemberList &&
          filteredMemberList.length > 0 &&
          filteredMemberList.map((member, idx) => (
            <TeamChatCard
              key={idx}
              {...member}
              highlight={member.id.toString() === paramId}
            />
          ))
        )}
      </div>

      {/* Floating action button */}
      <div className="fixed bottom-20 z-[10] max-w-[50px]">
        <Modal>
          <ModalTrigger asChild>
            <button
              onClick={() => {}}
              className="bg-brand-9 rounded-full text-white p-4 shadow-lg"
            >
              <PlusIcon />
            </button>
          </ModalTrigger>
          <ModalContent>
            <CreateGroupModal create />
          </ModalContent>
        </Modal>
      </div>
    </div>
  );
};

export default TeamChatSidebar;
