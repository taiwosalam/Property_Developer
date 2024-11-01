"use client";

import { Modal } from "@mui/material";
import { useTeamChatStore } from "@/store/teamChatStore";
import MemberComponent from "./Member";

export const NewMemberComp = () => {
  const { isAddMember, closeAddMember } = useTeamChatStore();

  return (
    <Modal open={isAddMember} onClose={closeAddMember}>
      <div className="w-full h-full flex items-center justify-center">
        <div className="flex flex-col gap-4 bg-white h-[60vh] w-[30vw] dark:bg-black rounded-lg overflow-y-auto custom-round-scrollbar">
          <MemberComponent title="New Member" />
        </div>
      </div>
    </Modal>
  );
};
