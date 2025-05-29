import { useTeamChatStore } from "@/store/teamChatStore";
import React from "react";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
};
const DeleteModal = () => {
  const { isDeleteMember, userNameToDelete, closeDeleteMember } =
    useTeamChatStore();

  const handleConfirmDelete = () => {
    // Execute the delete operation here
    console.log(`Deleting user: ${userNameToDelete}`);
    closeDeleteMember();
  };

  if (!isDeleteMember) return null;
  return (
    <div className="w-[20vw] h-full min-h-[20vh] flex flex-col bg-white dark:bg-darkText-primary rounded-2xl p-4">
      <h2 className="text-[20px] font-bold">Remove Member</h2>
      <p className="text-sm text-text-label dark:text-white">
        Are you sure you want to remove {userNameToDelete} from this chat?
      </p>
      <div className="flex justify-end gap-4 mt-4">
        <button
          className="bg-text-label text-sm text-white py-2 px-4 rounded-md"
          onClick={closeDeleteMember}
        >
          Cancel
        </button>
        <button
          className="bg-[#E9212E] text-sm text-white py-2 px-4 rounded-md"
          onClick={handleConfirmDelete}
        >
          Yes
        </button>
      </div>
    </div>
  );
};

export default DeleteModal;
