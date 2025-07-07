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

const TeamChatSidebar = () => {
  const {
    teamChatPageData,
    isSearch,
    setIsSearch,
    searchTerm,
    setSearchTerm,
    filteredMemberList,
    silentLoading,
  } = useTeamChat();
  const params = useParams();
  const paramId = params.id;

  return (
    <div className="custom-flex-col pr-2 w-full overflow-y-auto custom-round-scrollbar relative">
      <div className="flex gap-4 items-center w-full justify-between sticky top-0 z-50 bg-white dark:bg-darkText-primary pb-2">
        {!isSearch && (
          <div className="flex items-center gap-2 w-full">
            <h2 className="text-lg font-semibold">Groups</h2>
            <div className="flex items-center justify-center text-sm rounded-full w-6 h-6 text-white bg-brand-9">
              {teamChatPageData ? teamChatPageData.group_count : 0}
            </div>
          </div>
        )}
        {isSearch && (
          <div className="flex w-full bg-darkText-primary gap-2 items-center justify-between rounded-lg transition-all duration-300 ease-in-out">
            <Input
              id="search"
              type="text"
              placeholder="Search"
              className="w-full"
              value={searchTerm}
              onChange={setSearchTerm}
            />
          </div>
        )}
        <button className="flex" onClick={() => setIsSearch(!isSearch)}>
          {teamChatPageData && teamChatPageData.team.length > 0 ? (
            <SearchIcon size={35} />
          ) : (
            ""
          )}
        </button>
      </div>
      <div className="custom-flex-col overflow-x-hidden relative z-20 pb-4">
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
