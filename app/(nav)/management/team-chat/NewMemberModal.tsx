"use client";

import Modal from "@mui/material/Modal";
import { useTeamChatStore } from "@/store/teamChatStore";
import MemberComponent from "./Member";
import Box from "@mui/material/Box";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
};

export const NewMemberComp = () => {
  const { isAddMember, closeAddMember } = useTeamChatStore();

  return (
    <Modal
      open={isAddMember}
      onClose={closeAddMember}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <div className="w-full h-full flex items-center justify-center">
          <div className="flex flex-col gap-4 bg-white h-[60vh] w-[30vw] dark:bg-black rounded-lg overflow-y-auto custom-round-scrollbar">
            <MemberComponent title="New Member" />
          </div>
        </div>
      </Box>
    </Modal>
  );
};
