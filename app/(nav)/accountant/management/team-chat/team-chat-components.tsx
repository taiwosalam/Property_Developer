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
import { updateGroupNameOrDescription } from "@/app/(nav)/community/team-chat/data";
import parse from "html-react-parser";
import { useImageUploader } from "@/hooks/useImageUploader";
import { AuthForm } from "@/components/Auth/auth-components";
import { empty } from "@/app/config";
import { objectToFormData } from "@/utils/checkFormDataForImageOrAvatar";
import { DeleteIconOrange } from "@/public/icons/icons";
import Picture from "@/components/Picture/picture";
import CameraCircle from "@/public/icons/camera-circle.svg";
import Input from "@/components/Form/Input/input";
import TextArea from "@/components/Form/TextArea/textarea";
import { useModal } from "@/components/Modal/modal";

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
  const { setIsOpen } = useModal();
  const [groupImage, setGroupImage] = useState<string>(about?.picture || "");
  const [reqLoading, setReqLoading] = useState<boolean>(false);
  const [groupName, setGroupName] = useState<string>(about?.group_name || "");
  const [groupDescription, setGroupDescription] = useState<string>(
    about?.description || ""
  );
  const [isEditingName, setIsEditingName] = useState<boolean>(false);
  const [isEditingDescription, setIsEditingDescription] =
    useState<boolean>(false);

  const {
    preview,
    setPreview,
    inputFileRef,
    handleImageChange,
    clearSelection,
  } = useImageUploader({
    placeholder: about?.picture || CameraCircle,
    maxSize: {
      unit: "MB",
      value: 2,
    },
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const updateNameOrDescription = async (data: Record<string, any>) => {
    if (!about?.id) return;
    try {
      setReqLoading(true);
      const payload = {
        group_name: data.group_name,
        description: data.description,
        picture: data.picture || undefined,
        _method: "PUT",
      };

      await updateGroupNameOrDescription(about.id, objectToFormData(payload));
      setSelectedFile(null);
      setIsOpen(false);
    } catch (error) {
      console.error(error);
    } finally {
      setReqLoading(false);
    }
  };

  return (
    <div className="p-4 transition-all duration-300 ease-in-out">
      <AuthForm onFormSubmit={updateNameOrDescription}>
        <div className="flex justify-between mb-2">
          {/* Created */}
          <div className="created">
            <h4 className="text-text-disabled text-sm font-normal">Created</h4>
            <p className="text-text-primary dark:text-white text-xs font-medium">
              {about?.created_at}
            </p>
          </div>

          {/* Stats */}
          <div className="stats custom-flex-col gap-2">
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
        </div>

        <div className="flex flex-col gap-4">
          {/* Group Name */}
          <div className="flex items-center w-full justify-between">
            <Input
              id="group_name"
              name="group_name"
              placeholder="Group Name"
              defaultValue={about?.group_name}
              className="w-full"
            />
          </div>

          {/* Description */}
          <h3 className="text-text-disabled text-sm font-normal">
            Description
          </h3>
          <div className="flex items-center w-full justify-between gap-2">
            <TextArea
              id="description"
              defaultValue={about?.description}
              className="w-full"
            />
          </div>
        </div>

        {/* Group Image & submit button*/}
        <div className="flex justify-between items-center mt-1">
          <div className="flex items-end gap-3">
            <label htmlFor="picture" className="cursor-pointer relative">
              <Picture
                src={preview ?? about?.picture ?? empty}
                alt="Camera"
                size={70}
                rounded
              />
              <input
                type="file"
                id="picture"
                name="picture"
                accept="image/*"
                className="hidden pointer-events-none"
                onChange={handleImageChange}
                ref={inputFileRef}
              />
            </label>
          </div>
          <div className="self-end">
            <Button
              type="submit"
              size="base_medium"
              disabled={reqLoading}
              className="px-8 py-2"
            >
              {reqLoading ? "Updating..." : "Update"}
            </Button>
          </div>
        </div>
      </AuthForm>
    </div>
  );
};
