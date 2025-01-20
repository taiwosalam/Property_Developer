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
        <PageTitle
          title="Team Chat"
          noExclamationMark
        />
      </div>
    </div>
  );
};

export const About = () => {
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
    router.replace("/management/team-chat");
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
    <div className="p-4 transition-all duration-300 ease-in-out">
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
            <div className="flex items-center w-full justify-between">
              <input
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="text-text-primary dark:text-white text-sm font-medium border border-text-disabled rounded-md p-1 w-3/4 focus:outline-none"
              />
              <button type="button" onClick={() => setIsEditingName(false)}>
                <Image src={SaveIcon} alt="save" width={16} height={16} />
              </button>
            </div>
          ) : (
            <h3 className="text-text-primary dark:text-white text-sm font-medium">
              {groupName}
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
            <p className="text-status-success-3 dark:text-status-success-2 text-xs font-medium">
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
            <div className="flex items-center w-full justify-between">
              <textarea
                value={groupDescription}
                onChange={(e) => setGroupDescription(e.target.value)}
                className="text-text-primary dark:text-white text-sm font-medium border border-text-disabled rounded-md p-1 focus:outline-none w-full h-20"
              />
              <button
                className="flex justify-end ml-2"
                type="button"
                onClick={() => setIsEditingDescription(false)}
              >
                <Image src={SaveIcon} alt="save" width={16} height={16} />
              </button>
            </div>
          ) : (
            <span className="text-text-primary dark:text-white text-xs font-medium">
              {groupDescription}
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
