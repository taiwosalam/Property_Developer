"use client";
import { useState } from "react";
import clsx from "clsx";
import Image from "next/image";
import GroupChatCamera from "@/public/icons/group-camera.svg";
import avatarIcon from "@/public/empty/avatar-2.svg";
import { toast } from "sonner";
import dayjs from "dayjs";
import { useTeamChat } from "@/contexts/teamChatContext";
import AddMembers from "@/app/(nav)/community/team-chat/AddMembers";
import Picture from "../Picture/picture";
import { updateGroupNameAndDescription } from "@/app/(nav)/community/team-chat/data";

interface TeamChatAboutProps {
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

const TeamChatAbout = ({ about, group_members }: TeamChatAboutProps) => {
  const [side, setSide] = useState<"about" | "members">("about");
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [groupName, setGroupName] = useState(about.group_name);
  const [groupDescription, setGroupDescription] = useState(about.description);
  const [groupImage, setGroupImage] = useState(about.picture);
  // const { refetchTeams } = useTeamChat();

  const activeStyle =
    "text-white bg-brand-9 text-xs sm:text-sm sm:p-1 px-2 dark:bg-[#3C3D37] transition-all duration-300 ease-in-out w-full py-1 rounded-lg";
  const inactiveStyle =
    "text-black dark:text-white text-xs sm:text-sm bg-transparent transition-all duration-300 ease-in-out";

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setGroupImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const updateGroupDetails = async () => {
    try {
      await updateGroupNameAndDescription(
        about.id.toString(),
        groupName,
        groupDescription
      );
      toast.success("Group details updated");
      // refetchTeams();
    } catch (err) {
      toast.error("Failed to update group details");
    }
  };

  return (
    <div className="flex flex-col gap-4 bg-white h-[45vh] lg:w-[30vw] w-[80%] dark:bg-darkText-primary rounded-lg">
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
        <div className="w-[75%] overflow-y-auto custom-round-scrollbar p-4">
          {side === "about" && (
            <div>
              <div className="imageWrapper h-20 w-20 relative overflow-hidden">
                <Image
                  src={groupImage || avatarIcon}
                  alt="team chat"
                  width={100}
                  height={100}
                  className="rounded-full w-full h-full object-contain"
                />
                <div className="absolute bottom-0 right-0 bg-text-black p-1 w-full rounded-b-full bg-opacity-45">
                  <button
                    type="button"
                    onClick={() =>
                      (document.querySelector('input[type="file"]') as HTMLInputElement)?.click()
                    }
                  >
                    <input
                      type="file"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                    <Picture src={GroupChatCamera} alt="edit" size={16} />
                  </button>
                </div>
              </div>
              <div className="flex flex-col gap-2 mt-3">
                <div className="flex items-center w-full justify-between">
                  {isEditingName ? (
                    <div className="flex items-center w-full justify-between">
                      <input
                        type="text"
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                        className="text-text-primary dark:text-white text-sm font-medium border border-text-disabled rounded-md p-1 w-3/4 focus:outline-none"
                      />
                      <button
                        onClick={() => {
                          setIsEditingName(false);
                          updateGroupDetails();
                        }}
                      >
                        {/* <Picture src={SaveIcon} alt="save" size={16} /> */}
                      </button>
                    </div>
                  ) : (
                    <>
                      <h3 className="text-text-primary dark:text-white text-sm font-medium">
                        {groupName}
                      </h3>
                      <button onClick={() => setIsEditingName(true)}>
                        {/* <Picture src={PencilIcon} alt="edit" size={16} /> */}
                      </button>
                    </>
                  )}
                </div>
                <div className="created">
                  <h4 className="text-text-disabled text-sm font-normal">
                    Created
                  </h4>
                  <p className="text-text-primary dark:text-white text-xs font-medium">
                    {dayjs(about.created_at).format("M/D/YYYY h:mmA")}
                  </p>
                </div>
                <div className="stats">
                  <h4 className="text-text-disabled text-sm font-normal">
                    Stats
                  </h4>
                  <div className="flex items-center gap-2">
                    <p className="text-text-disabled text-xs font-medium">
                      {about.total_members}{" "}
                      {about.total_members > 1 ? "Members" : "Member"}
                    </p>
                    <div className="w-1 h-1 rounded-full bg-status-success-3"></div>
                    <p className="text-status-success-3 dark:text-status-success-2 text-xs font-medium">
                      {about.total_active} Online
                    </p>
                  </div>
                </div>
                <div className="flex">
                  <h3 className="text-text-disabled text-sm font-normal">
                    Description
                  </h3>
                </div>
                <div className="flex gap-2 w-full justify-between">
                  {isEditingDescription ? (
                    <div className="flex items-center w-full justify-between">
                      <textarea
                        value={groupDescription}
                        onChange={(e) => setGroupDescription(e.target.value)}
                        className="text-text-primary dark:text-white text-sm font-medium border border-text-disabled rounded-md p-1 focus:outline-none w-full h-20"
                      />
                      <button
                        onClick={() => {
                          setIsEditingDescription(false);
                          updateGroupDetails();
                        }}
                      >
                        {/* <Picture src={SaveIcon} alt="save" size={16} /> */}
                      </button>
                    </div>
                  ) : (
                    <>
                      <span className="text-text-primary dark:text-white text-xs font-medium">
                        {groupDescription}
                      </span>
                      <button onClick={() => setIsEditingDescription(true)}>
                        {/* <Picture src={PencilIcon} alt="edit" size={16} /> */}
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
          {side === "members" && (
            <AddMembers group_members={group_members} groupId={about.id} />
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamChatAbout;
