import Button from "@/components/Form/Button/button";
// import { ModalContent, ModalTrigger, useModal } from "@/components/Modal/modal";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import GroupImage from "@/public/empty/SampleLandlord.jpeg";
import PencilIcon from "@/public/icons/pencil.svg";
import PageTitle from "@/components/PageTitle/page-title";
import Image from "next/image";
import ModalPreset from "@/components/Modal/modal-preset";
import { useState } from "react";
import GroupChatCamera from "@/public/icons/group-camera.svg";
import { team_chat_data, team_chat_members_data } from "./data";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import MemberComponent from "./Member";
import useStep from "@/hooks/useStep";
import SaveIcon from "@/public/icons/save.svg";
import { group } from "console";
import { updateGroupNameOrDescription } from "@/app/(nav)/community/team-chat/data";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
};

export const TeamChatHeader = () => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const { activeStep, changeStep } = useStep(2);
  return (
    <div className="flex items-center justify-between w-full mb-4">
      <div>
        <PageTitle title="Team Chat" noExclamationMark />
      </div>
    </div>
  );
};

interface IAboutTeamChat {
  about?: {
    id: number;
    group_name: string;
    description: string;
    created_at: string;
    total_members: number;
    total_active: number;
    picture: string | null;
  };
}
export const About = ({ about }: IAboutTeamChat) => {
  const router = useRouter();
  const { id } = useParams();

  const [groupImage, setGroupImage] = useState<string>(
    about?.picture || ""
  );
  const [groupName, setGroupName] = useState<string>(about?.group_name || "");
  const [groupDescription, setGroupDescription] = useState<string>(
    about?.description || ""
  );
  const [isEditingName, setIsEditingName] = useState<boolean>(false);
  const [isEditingDescription, setIsEditingDescription] =
    useState<boolean>(false);

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

  const updateNameOrDescription = async () => {
    if(!about?.id) return;
    try {
      await updateGroupNameOrDescription(about?.id, groupName, groupDescription, groupImage);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="p-4 transition-all duration-300 ease-in-out">
      <div className="imageWrapper h-20 w-20 relative overflow-hidden">
        <Image
          src={about?.picture ?? groupImage ?? GroupImage}
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
            <div className="flex items-center w-full justify-between">
              <input
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="text-text-primary dark:text-white text-sm font-medium border border-text-disabled rounded-md p-1 w-3/4 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => {
                  setIsEditingName(false);
                  updateNameOrDescription();
                }}
              >
                <Image src={SaveIcon} alt="save" width={16} height={16} />
              </button>
            </div>
          ) : (
            <h3 className="text-text-primary dark:text-white text-sm font-medium">
              {about?.group_name}
            </h3>
          )}
          {isEditingName ? null : (
            <button
              type="button"
              onClick={() => setIsEditingName(!isEditingName)}
            >
              <Image src={PencilIcon} alt="edit" width={16} height={16} />
            </button>
          )}
        </div>
        <div className="created">
          <h4 className="text-text-disabled text-sm font-normal">Created</h4>
          <p className="text-text-primary dark:text-white text-xs font-medium">
            {about?.created_at}
          </p>
        </div>
        <div className="stats">
          <h4 className="text-text-disabled text-sm font-normal">Stats</h4>
          <div className="flex items-center gap-2">
            <p className="text-text-disabled text-xs font-medium">
              {about?.total_members} Members
            </p>
            <div className="w-1 h-1 rounded-full bg-status-success-3"></div>
            <p className="text-status-success-3 dark:text-status-success-2 text-xs font-medium">
              {about?.total_active} Online
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
                className="flex justify-end ml-2"
                type="button"
                onClick={() => {
                  setIsEditingDescription(false);
                  updateNameOrDescription();
                }}
              >
                <Image src={SaveIcon} alt="save" width={16} height={16} />
              </button>
            </div>
          ) : (
            <span className="text-text-primary dark:text-white text-xs font-medium">
              {about?.description}
            </span>
          )}
          {isEditingDescription ? null : (
            <button
              className="w-1/4 flex justify-end"
              type="button"
              onClick={() => setIsEditingDescription(!isEditingDescription)}
            >
              <Image src={PencilIcon} alt="edit" width={16} height={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
