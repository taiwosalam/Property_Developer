import clsx from "clsx";
import { useState } from "react";
import { About } from "../../accountant/management/team-chat/team-chat-components";
import AddMembers from "./AddMembers";
import DeleteModal from "./DeleteModal";

interface TeamChatGroupDetailsModalProps {
  about: {
    id: number;
    group_name: string;
    description: string;
    created_at: string;
    total_members: number;
    total_active: number;
    picture: string | null;
  };
  group_members: {
    id: number;
    picture: string | null;
    fullname: string;
    role: string;
  }[];
}


export const TeamChatGroupDetailsModal = ({
  about,
  group_members,
}: TeamChatGroupDetailsModalProps) => {
  const [side, setSide] = useState<"about" | "members">("about");
  const activeStyle =
    "text-white bg-brand-9 text-xs sm:text-sm sm:p-1 px-2 dark:bg-[#3C3D37] transition-all duration-300 ease-in-out w-full py-1 rounded-lg";
  const inactiveStyle =
    "text-black dark:text-white text-xs sm:text-sm bg-transparent transition-all duration-300 ease-in-out";
  
    return (
    <div className="flex flex-col gap-4 dark:bg-darkText-primary">
      <div className="flex h-full gap-2">
        <div className="flex flex-col gap-2 w-[25%] border-r border-neutral-3 dark:border-darkText-2 h-full sm:px-4 py-4 px-2">
          <button
            className={clsx({
              [activeStyle]: side === "about",
              [inactiveStyle]: side !== "about",
            })}
            onClick={() => setSide("about")}
          >
            About
          </button>
          <button
            className={clsx({
              [activeStyle]: side === "members",
              [inactiveStyle]: side !== "members",
            })}
            onClick={() => setSide("members")}
          >
            Members
          </button>
        </div>
        <div className="w-[75%] overflow-y-auto custom-round-scrollbar">
          {side === "about" && <About about={about} />}
          {side === "members" && (
            <AddMembers group_members={group_members} groupId={about.id} />
          )}
        </div>
      </div>
    </div>
  );
};
