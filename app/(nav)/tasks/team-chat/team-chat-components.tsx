import Button from "@/components/Form/Button/button";
import { ModalContent, ModalTrigger } from "@/components/Modal/modal";
import GroupImage from "@/public/empty/SampleLandlord.jpeg";
import { Modal } from "@/components/Modal/modal";
import PencilIcon from "@/public/icons/pencil.svg";
import PageTitle from "@/components/PageTitle/page-title";
import clsx from "clsx";
import Image from "next/image";
import { useState } from "react";
import GroupChatCamera from "@/public/icons/group-camera.svg";
import { team_chat_data, team_chat_members_data } from "./data";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { SearchIcon } from "@/public/icons/icons";
import Avatar1 from "@/public/empty/avatar-1.svg";
import TrashIcon from "@/public/icons/trash.svg";

export const TeamChatHeader = () => {
  return (
    <div className="flex items-center justify-between w-full mb-4">
      <div>
        <PageTitle
          title="Team Chat"
          aboutPageModalData={{
            title: "Team Chat",
            description:
              "This page contains a list of Team Chat on the platform.",
          }}
        />
      </div>
      <div>
        <Modal>
          <ModalTrigger asChild>
            <Button type="button" className="page-header-button">
              + Create Team Chat
            </Button>
          </ModalTrigger>
          <ModalContent>
            <TeamChatCreateModal />
          </ModalContent>
        </Modal>
      </div>
    </div>
  );
};

export const TeamChatCreateModal = () => {
  return (
    <div className="flex flex-col gap-4 bg-white h-[60vh] w-[50vw] dark:bg-black p-4 rounded-lg">
      text here
    </div>
  );
};

export const TeamChatGroupDetailsModal = () => {
  const [side, setSide] = useState<"about" | "members">("about");
  const activeStyle =
    "text-black bg-brand-9 text-sm dark:bg-[#3C3D37] transition-all duration-300 ease-in-out w-full py-1 rounded-lg";
  const inactiveStyle =
    "text-text-quaternary text-sm bg-transparent transition-all duration-300 ease-in-out";
  return (
    <div className="flex flex-col gap-4 bg-white h-[45vh] w-[30vw] dark:bg-black rounded-lg">
      <div className="flex h-full gap-2">
        <div className="flex flex-col gap-2 w-[25%] border-r border-neutral-3 dark:border-darkText-2 h-full p-4">
          <button
            className={clsx(activeStyle, {
              [inactiveStyle]: side !== "about",
            })}
            onClick={() => setSide("about")}
          >
            About
          </button>
          <button
            className={clsx(activeStyle, {
              [inactiveStyle]: side !== "members",
            })}
            onClick={() => setSide("members")}
          >
            Members
          </button>
        </div>

        <div className="w-[75%] lg:max-h-screen lg:overflow-y-auto custom-round-scrollbar">
          {side === "about" && <About />}
          {side === "members" && <Members />}
        </div>
      </div>
    </div>
  );
};

const About = () => {
  const router = useRouter();
  const { id } = useParams();

  const data = team_chat_data.find((item) => item.id === id) || {
    pfp: null,
    fullname: "",
    groupDesc: "",
  };
  const [groupImage, setGroupImage] = useState<string | null>(data.pfp);
  const [groupName, setGroupName] = useState<string>(data.fullname);
  const [groupDescription, setGroupDescription] = useState<string>(
    data.groupDesc || ""
  );
  const [isEditingName, setIsEditingName] = useState<boolean>(false);
  const [isEditingDescription, setIsEditingDescription] =
    useState<boolean>(false);

  if (!data.pfp) {
    router.replace("/tasks/team-chat");
    return null;
  }

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
  return (
    <div className="p-4">
      <div className="imageWrapper h-20 w-20 relative overflow-hidden">
        <Image
          src={groupImage || GroupImage}
          alt="team chat"
          width={100}
          height={100}
          className="rounded-full w-full h-full object-contain"
        />
        <div className="absolute bottom-0 right-0 bg-text-black p-1 w-full rounded-b-full bg-opacity-45">
          <button
            type="button"
            className="rounded-full text-center w-full"
            onClick={() =>
              (
                document.querySelector('input[type="file"]') as HTMLInputElement
              )?.click()
            }
          >
            <input
              type="file"
              className="hidden"
              onChange={handleImageUpload}
            />
            <div className="flex justify-center items-center">
              <Image src={GroupChatCamera} alt="edit" width={16} height={16} />
            </div>
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-2 mt-3">
        <div className="flex items-center w-full justify-between">
          {isEditingName ? (
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="text-text-primary text-sm font-medium border border-text-disabled rounded-md p-1 w-3/4 focus:outline-none"
            />
          ) : (
            <h3 className="text-text-primary text-sm font-medium">
              {groupName}
            </h3>
          )}
          <button
            type="button"
            onClick={() => setIsEditingName(!isEditingName)}
          >
            <Image src={PencilIcon} alt="edit" width={16} height={16} />
          </button>
        </div>
        <div className="created">
          <h4 className="text-text-disabled text-sm font-normal">Created</h4>
          <p className="text-text-primary text-xs font-medium">
            12/12/2024 1:50AM
          </p>
        </div>
        <div className="stats">
          <h4 className="text-text-disabled text-sm font-normal">Stats</h4>
          <div className="flex items-center gap-2">
            <p className="text-text-disabled text-xs font-medium">
              30.2k Members
            </p>
            <div className="w-1 h-1 rounded-full bg-status-success-3"></div>
            <p className="text-status-success-3 text-xs font-medium">
              30 Online
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
            <textarea
              value={groupDescription}
              onChange={(e) => setGroupDescription(e.target.value)}
              className="text-text-primary text-sm font-medium border border-text-disabled rounded-md p-1 w-3/4 focus:outline-none"
            />
          ) : (
            <span className="text-text-primary text-xs font-medium">
              {groupDescription}
            </span>
          )}
          <button
            className="w-1/4 flex justify-end"
            type="button"
            onClick={() => setIsEditingDescription(!isEditingDescription)}
          >
            <Image src={PencilIcon} alt="edit" width={16} height={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

const Members = () => {
  const [searchTerm, setSearchTerm] = useState<string>(""); // State for search input

  // Function to filter members based on search input
  const filteredMembers = team_chat_members_data.filter((member) =>
    member.fullname.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="sticky top-0 z-[2] bg-white dark:bg-black p-4">
        <div className="searchWrapper flex items-center gap-1 border border-text-disabled rounded-md p-1 w-full">
          <SearchIcon size={20} />
          <input
            type="text"
            placeholder="Search members"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="text-sm w-full focus:outline-none"
          />
        </div>
        <div className="membersWrapper flex items-center justify-between mt-2">
          <p className="text-text-primary text-sm font-medium">Members</p>
          <button className="text-brand-9 text-sm font-medium">
            + Add New Member
          </button>
        </div>
      </div>
      {filteredMembers.map((item) => (
        <div className="userWrapper flex items-center gap-2 justify-between w-full mt-3 px-4">
          <div className="flex items-center gap-2 w-3/4">
            <div className="imgWrapper h-10 w-10 relative overflow-hidden">
              <Image
                src={Avatar1}
                alt="profile"
                width={100}
                height={100}
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
          <button type="button" className="w-1/4 flex justify-end">
            <Image src={TrashIcon} alt="delete" width={16} height={16} />
          </button>
        </div>
      ))}
    </div>
  );
};
